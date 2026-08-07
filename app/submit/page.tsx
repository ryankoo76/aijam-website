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
          Enter your email to start your project submission — no prior registration required.
          After you submit, you&apos;ll complete the $350 participation fee to finalize your entry.
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
            YOUR EMAIL
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
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

// ── Page entry point ──────────────────────────────────────────────────────────
// Open submission: anyone can reach the form directly (submit first, pay later).
export default function SubmitPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const rawEmail = (searchParams.email ?? '').trim().toLowerCase();

  if (!rawEmail) {
    return <EmailEntryCard />;
  }

  return <SubmitForm email={rawEmail} />;
}
