import SubmitForm, { type ExistingSubmission } from '@/components/SubmitForm';
import { supabaseAdmin } from '@/lib/supabase';

// Always render fresh — this page shows participant-specific submission data.
export const dynamic = 'force-dynamic';

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

        <p style={{ fontSize: '.85rem', color: '#64748b', lineHeight: 1.7, marginTop: 0, marginBottom: '1.5rem' }}>
          <strong style={{ color: '#94a3b8' }}>Already submitted?</strong> Enter the same email and your
          existing submission will load, ready to review or update — no extra payment needed.
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

// ── Load this email's most recent submission (if any) ────────────────────────
async function loadExistingSubmission(email: string): Promise<ExistingSubmission | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('aijam_submissions')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[submit page] existing submission lookup error:', JSON.stringify(error));
      return null;
    }
    if (!data) {
      console.log('[submit page] no existing submission for:', email);
      return null;
    }

    const row = data as Record<string, unknown>;
    // Some legacy rows used older column names — fall back across both.
    const pick = (...keys: string[]): string => {
      for (const k of keys) {
        const v = row[k];
        if (typeof v === 'string' && v.trim() !== '') return v;
      }
      return '';
    };

    console.log('[submit page] existing submission found for:', email, '— id:', pick('id'));

    return {
      id:               pick('id'),
      category:         pick('category'),
      projectTitle:     pick('project_title'),
      teamMembers:      pick('team_members'),
      abstract:         pick('abstract'),
      keyFeatures:      pick('key_features'),
      socialImpact:     pick('social_impact', 'impact'),
      marketability:    pick('marketability', 'market'),
      videoUrl:         pick('video_url'),
      slidesLink:       pick('slides_link', 'slides_url', 'slide_url'),
      inspiration:      pick('inspiration', 'story_inspiration'),
      biggestChallenge: pick('biggest_challenge', 'story_challenge'),
      aiRole:           pick('ai_role', 'story_ai_role'),
      futurePlans:      pick('future_plans', 'story_future'),
      recipientName:    pick('shipping_name'),
      streetAddress:    pick('shipping_address'),
      apt:              pick('shipping_apt'),
      city:             pick('shipping_city'),
      shippingState:    pick('shipping_state'),
      postalCode:       pick('shipping_postal'),
      country:          pick('shipping_country'),
      paymentStatus:    pick('payment_status') || 'unpaid',
      createdAt:        pick('created_at'),
    };
  } catch (err) {
    console.error('[submit page] existing submission lookup threw:', err);
    return null;
  }
}

// ── Page entry point ──────────────────────────────────────────────────────────
// Open submission: anyone can reach the form directly (submit first, pay later).
// If this email already submitted, their answers are loaded back into the form
// so they can review or update instead of starting from a blank page.
export default async function SubmitPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const rawEmail = (searchParams.email ?? '').trim().toLowerCase();

  if (!rawEmail) {
    return <EmailEntryCard />;
  }

  const existing = await loadExistingSubmission(rawEmail);

  return <SubmitForm email={rawEmail} existing={existing} />;
}
