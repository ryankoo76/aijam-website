import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { sendPaymentConfirmation } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  let event: Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // Development fallback: parse without verification
      console.warn('[webhook] STRIPE_WEBHOOK_SECRET not set — skipping signature verification');
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // ── Handle checkout.session.completed ────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true });
    }

    const email = (session.metadata?.email ?? session.customer_email ?? '').toLowerCase();
    const sessionId = session.id;
    const amountTotal = session.amount_total ?? 3000;

    // Upsert payment record
    const { error: payError } = await supabaseAdmin
      .from('aijam_payments')
      .upsert(
        {
          stripe_session_id: sessionId,
          email,
          amount: amountTotal,
          currency: session.currency ?? 'usd',
          status: 'completed',
        },
        { onConflict: 'stripe_session_id' }
      );

    if (payError) {
      console.error('[webhook] aijam_payments upsert error:', payError);
    }

    // Update registration status
    const { error: regError } = await supabaseAdmin
      .from('aijam_registrations')
      .update({ submission_status: 'paid' })
      .eq('email', email);

    if (regError) {
      console.error('[webhook] aijam_registrations update error:', regError);
    }

    // Send confirmation email (non-blocking)
    sendPaymentConfirmation({ to: email, amount: amountTotal }).catch((err) =>
      console.error('[webhook] email error:', err)
    );

    console.log(`[webhook] Payment completed — ${email} — session ${sessionId}`);
  }

  return NextResponse.json({ received: true });
}
