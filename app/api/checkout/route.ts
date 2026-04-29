import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

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

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout] Stripe error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
