import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import SubmitForm from '@/components/SubmitForm';

// ── Shared dark-theme card shell ──────────────────────────────────────────────
function PageShell({ children }: { children: React.ReactNode }) {
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
      <div style={{ maxWidth: '520px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '2rem',
            letterSpacing: '.1em',
            color: '#fff',
            lineHeight: 1,
          }}>
            AI·JAM US 2026
          </div>
          <div style={{
            fontSize: '.75rem',
            letterSpacing: '.15em',
            color: '#475569',
            marginTop: '.4rem',
          }}>
            11TH INTERNATIONAL AI INVENTION CHALLENGE
          </div>
        </div>
        {children}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/" style={{ color: '#3b82f6', fontSize: '.88rem', textDecoration: 'none' }}>
            ← Back to AI-JAM US
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Email entry (no ?email= param) ───────────────────────────────────────────
function EmailEntryCard() {
  return (
    <PageShell>
      <div style={{
        background: '#111118',
        border: '1px solid rgba(255,255,255,.1)',
        padding: '2.5rem',
      }}>
        <div style={{
          fontSize: '.7rem',
          letterSpacing: '.15em',
          color: '#475569',
          marginBottom: '1.5rem',
          fontFamily: "'Space Mono', monospace",
        }}>
          PROJECT SUBMISSION
        </div>

        <p style={{ fontSize: '.95rem', color: '#94a3b8', lineHeight: 1.8, marginTop: 0, marginBottom: '1.5rem' }}>
          Enter your registered email address to access the submission form.
        </p>

        {/* Plain HTML GET form — no JS needed */}
        <form method="get" action="/submit">
          <label style={{
            display: 'block',
            fontSize: '.72rem',
            letterSpacing: '.1em',
            color: '#475569',
            fontFamily: "'Space Mono', monospace",
            marginBottom: '.5rem',
          }}>
            REGISTERED EMAIL
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your registration email"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: '#0a0a0f',
              border: '1px solid rgba(255,255,255,.12)',
              color: '#e2e8f0',
              padding: '.75rem 1rem',
              fontSize: '.95rem',
              fontFamily: "'Outfit', sans-serif",
              outline: 'none',
              marginBottom: '1.2rem',
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg,#1e40af,#7c3aed)',
              color: '#fff',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '.06em',
              cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Continue →
          </button>
        </form>
      </div>
    </PageShell>
  );
}

// ── Error card ────────────────────────────────────────────────────────────────
function ErrorCard({ message, cta }: { message: string; cta?: React.ReactNode }) {
  return (
    <PageShell>
      <div style={{
        background: '#111118',
        border: '1px solid rgba(239,68,68,.3)',
        padding: '2.5rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ color: '#ef4444', margin: '0 0 1rem', fontSize: '1.2rem' }}>Cannot Access Submission Form</h2>
        <p style={{ color: '#94a3b8', fontSize: '.92rem', lineHeight: 1.7, margin: '0 0 1.5rem' }}>{message}</p>
        {cta}
      </div>
    </PageShell>
  );
}

// ── Already submitted card ────────────────────────────────────────────────────
function AlreadySubmittedCard({ email }: { email: string }) {
  return (
    <PageShell>
      <div style={{
        background: '#111118',
        border: '1px solid rgba(124,58,237,.3)',
        padding: '2.5rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>

        <div style={{
          display: 'inline-block',
          background: 'rgba(124,58,237,.1)',
          border: '1px solid rgba(124,58,237,.3)',
          color: '#a78bfa',
          padding: '.5rem 1.2rem',
          fontSize: '.78rem',
          letterSpacing: '.12em',
          fontWeight: 700,
          marginBottom: '1.5rem',
          fontFamily: "'Space Mono', monospace",
        }}>
          PROJECT SUBMITTED
        </div>

        <h2 style={{ color: '#f1f5f9', margin: '0 0 .8rem', fontSize: '1.3rem' }}>
          You&apos;ve already submitted!
        </h2>

        <p style={{ color: '#94a3b8', fontSize: '.92rem', lineHeight: 1.7, margin: '0 0 1.5rem' }}>
          A submission has been received for<br />
          <strong style={{ color: '#e2e8f0' }}>{email}</strong>.<br />
          Results will be announced on September 6, 2026.
        </p>

        <p style={{ color: '#64748b', fontSize: '.82rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
          Need to update your project? You can re-submit before the deadline (August 30, 2026).
        </p>

        <a
          href={`/submit/resubmit?email=${encodeURIComponent(email)}`}
          style={{
            display: 'inline-block',
            background: 'rgba(124,58,237,.15)',
            border: '1px solid rgba(124,58,237,.3)',
            color: '#a78bfa',
            padding: '.7rem 1.5rem',
            textDecoration: 'none',
            fontSize: '.88rem',
            fontWeight: 600,
            marginRight: '.8rem',
          }}
        >
          Re-submit Project
        </a>
      </div>
    </PageShell>
  );
}

// ── Gate: checks DB and decides what to render ────────────────────────────────
async function SubmitGate({ email }: { email: string }) {
  console.log('[submit-page] Checking payment status for:', email);

  const { data: reg, error } = await supabaseAdmin
    .from('aijam_registrations')
    .select('submission_status, first_name')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('[submit-page] Supabase lookup error:', error);
  }

  if (!reg) {
    console.warn('[submit-page] Email not found in registrations:', email);
    return (
      <ErrorCard
        message={`The email "${email}" is not registered. Please complete registration first.`}
        cta={
          <a href="/#register" style={{ color: '#3b82f6', fontSize: '.9rem' }}>
            Register Now →
          </a>
        }
      />
    );
  }

  const status = reg.submission_status;
  console.log('[submit-page] submission_status for', email, ':', status);

  // Not paid → redirect to payment page
  if (status !== 'paid' && status !== 'submitted') {
    console.log('[submit-page] Redirecting to /pay — status:', status);
    redirect(`/pay?email=${encodeURIComponent(email)}`);
  }

  // Already submitted → show notice (with re-submit option)
  if (status === 'submitted') {
    return <AlreadySubmittedCard email={email} />;
  }

  // Paid and not yet submitted → show form
  return <SubmitForm email={email} />;
}

// ── Page entry point ──────────────────────────────────────────────────────────
export default async function SubmitPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const rawEmail = (searchParams.email ?? '').trim().toLowerCase();

  if (!rawEmail) {
    return <EmailEntryCard />;
  }

  return <SubmitGate email={rawEmail} />;
}
