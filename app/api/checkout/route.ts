import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// ── Env diagnostics (logged once at module load) ──────────────────────────────
const stripeKey = process.env.STRIPE_SECRET_KEY ?? '';
const BASE_URL  = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

console.log('[checkout] module init —', {
  stripeKeyPresent: !!stripeKey,
  stripeKeyPrefix: stripeKey ? stripeKey.slice(0, 8) + '...' : 'MISSING',
  baseUrl: BASE_URL,
});

const stripe = new Stripe(stripeKey);

export async function POST(req: NextRequest) {
  console.log('[checkout] POST called');

  // ── Parse body ────────────────────────────────────────────────────────────
  let email: string;
  try {
    const body = await req.json();
    email = body.email ?? '';
    console.log('[checkout] email received:', email || '(empty)');
  } catch (parseErr) {
    console.error('[checkout] Failed to parse request body:', parseErr);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }

  if (!stripeKey) {
    console.error('[checkout] STRIPE_SECRET_KEY is not set');
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  // ── Create Stripe Checkout session ────────────────────────────────────────
  try {
    console.log('[checkout] Creating Stripe session for:', email);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 3000, // $30.00
            product_data: {
              name: 'AI-JAM US 2026 — Participation Fee',
              description: '11th International AI Invention Challenge · Submission Deadline: August 30, 2026',
            },
          },
          quantity: 1,
        },
      ],
      metadata: { email },
      success_url: `${BASE_URL}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/pay?email=${encodeURIComponent(email)}`,
    });

    console.log('[checkout] Session created:', session.id, '— url:', session.url?.slice(0, 60) + '...');
    return NextResponse.json({ url: session.url });

  } catch (err: unknown) {
    // Stripe SDK errors carry a .message and optionally .type / .code
    if (err instanceof Stripe.errors.StripeError) {
      console.error('[checkout] Stripe API error:', {
        type: err.type,
        code: err.code,
        statusCode: err.statusCode,
        message: err.message,
      });
      return NextResponse.json(
        { error: `Stripe error: ${err.message}` },
        { status: err.statusCode ?? 500 }
      );
    }
    // Unexpected non-Stripe error
    console.error('[checkout] Unexpected error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
