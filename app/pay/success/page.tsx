import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { sendPaymentConfirmation } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function SuccessContent({ sessionId }: { sessionId: string }) {
  // ── Retrieve Stripe session ───────────────────────────────────────────────
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return <ErrorCard message="Could not verify payment. Please contact team@aijam.org." />;
  }

  if (session.payment_status !== 'paid') {
    return <ErrorCard message="Payment not completed. Please try again." />;
  }

  const email = (session.metadata?.email ?? session.customer_email ?? '').toLowerCase();
  const amountTotal = session.amount_total ?? 3000;

  // ── Upsert into aijam_payments ────────────────────────────────────────────
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
    console.error('[success] aijam_payments upsert error:', payError);
  }

  // ── Update registration submission_status → 'paid' ───────────────────────
  const { error: regError } = await supabaseAdmin
    .from('aijam_registrations')
    .update({ submission_status: 'paid' })
    .eq('email', email);

  if (regError) {
    console.error('[success] aijam_registrations update error:', regError);
  }

  // ── Send confirmation email (non-blocking) ───────────────────────────────
  sendPaymentConfirmation({ to: email, amount: amountTotal }).catch((err) =>
    console.error('[success] email error:', err)
  );

  const displayAmount = `$${(amountTotal / 100).toFixed(2)}`;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '2rem',
            letterSpacing: '.1em',
            color: '#fff',
            lineHeight: 1,
          }}>AI·JAM US 2026</div>
          <div style={{
            fontSize: '.75rem',
            letterSpacing: '.15em',
            color: '#475569',
            marginTop: '.4rem',
          }}>11TH INTERNATIONAL AI INVENTION CHALLENGE</div>
        </div>

        {/* Success card */}
        <div style={{
          background: '#111118',
          border: '1px solid rgba(16,185,129,.3)',
          padding: '2.5rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>

          <div style={{
            display: 'inline-block',
            background: 'rgba(16,185,129,.1)',
            border: '1px solid rgba(16,185,129,.3)',
            color: '#10b981',
            padding: '.5rem 1.2rem',
            fontSize: '.78rem',
            letterSpacing: '.12em',
            fontWeight: 700,
            marginBottom: '1.5rem',
            fontFamily: "'Space Mono', monospace",
          }}>✅ PAYMENT CONFIRMED</div>

          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#f1f5f9',
            margin: '0 0 .8rem',
          }}>You&apos;re officially in!</h1>

          <p style={{
            fontSize: '.95rem',
            color: '#94a3b8',
            lineHeight: 1.8,
            margin: '0 0 2rem',
          }}>
            Your {displayAmount} participation fee has been received.<br />
            A confirmation email is on its way to<br />
            <strong style={{ color: '#e2e8f0' }}>{email}</strong>
          </p>

          {/* Details */}
          <div style={{
            background: '#1a1a2e',
            border: '1px solid rgba(255,255,255,.08)',
            borderLeft: '3px solid #10b981',
            padding: '1.2rem 1.5rem',
            textAlign: 'left',
            marginBottom: '2rem',
          }}>
            <div style={{ fontSize: '.72rem', letterSpacing: '.1em', color: '#475569', marginBottom: '.8rem', fontFamily: "'Space Mono', monospace" }}>NEXT STEPS</div>
            {[
              'Check your email for payment receipt',
              'Start preparing your AI project submission',
              'Submission deadline: August 30, 2026',
              'Results announced: September 6, 2026',
            ].map((step, i) => (
              <div key={step} style={{ display: 'flex', gap: '.8rem', alignItems: 'flex-start', marginBottom: '.5rem', fontSize: '.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
                <span style={{ color: '#10b981', flexShrink: 0, fontWeight: 700 }}>{i + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <a
            href="/"
            style={{
              display: 'block',
              background: 'linear-gradient(135deg,#1e40af,#0891b2)',
              color: '#fff',
              padding: '1rem',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '.06em',
            }}
          >
            ← Back to AI-JAM US
          </a>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '.78rem', color: '#475569' }}>
          Questions? <a href="mailto:team@aijam.org" style={{ color: '#3b82f6' }}>team@aijam.org</a>
        </div>
      </div>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        <div style={{
          background: '#111118',
          border: '1px solid rgba(239,68,68,.3)',
          padding: '2.5rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ color: '#ef4444', margin: '0 0 1rem', fontSize: '1.2rem' }}>Payment Verification Failed</h2>
          <p style={{ color: '#94a3b8', fontSize: '.92rem', lineHeight: 1.7, margin: '0 0 1.5rem' }}>{message}</p>
          <a href="/pay" style={{ color: '#3b82f6', fontSize: '.9rem' }}>← Try again</a>
        </div>
      </div>
    </div>
  );
}

// ── Page entry point (Server Component) ──────────────────────────────────────
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  if (!sessionId) redirect('/pay');

  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontFamily: "'Outfit', sans-serif" }}>
        Verifying payment...
      </div>
    }>
      <SuccessContent sessionId={sessionId} />
    </Suspense>
  );
}
