'use client';

import { useState } from 'react';

// ── Shared style tokens ───────────────────────────────────────────────────────
const mono = "'Space Mono', monospace";
const sans = "'Outfit', sans-serif";

const inputSt: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: '#0a0a0f',
  border: '1px solid rgba(255,255,255,.12)',
  color: '#e2e8f0',
  padding: '.75rem 1rem',
  fontSize: '.92rem',
  fontFamily: sans,
  outline: 'none',
};

const textareaSt: React.CSSProperties = {
  ...inputSt,
  resize: 'vertical' as const,
  lineHeight: 1.6,
};

const fieldSt: React.CSSProperties = { marginBottom: '1.1rem' };

const sectionHeaderSt: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '.75rem',
  marginBottom: '1.5rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid rgba(255,255,255,.08)',
};

const sectionBadgeSt = (color: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  background: color,
  color: '#fff',
  fontFamily: mono,
  fontSize: '.7rem',
  fontWeight: 700,
  flexShrink: 0,
});

const sectionTitleSt: React.CSSProperties = {
  fontSize: '.72rem',
  letterSpacing: '.15em',
  color: '#94a3b8',
  fontFamily: mono,
  fontWeight: 700,
};

const CATEGORIES = [
  'Education',
  'Healthcare',
  'Environment',
  'Finance',
  'Entertainment',
  'Transportation',
  'Agriculture',
  'Social Good',
  'Other',
];

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({
  label,
  hint,
  required,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={fieldSt}>
      <label style={{
        display: 'block',
        fontSize: '.72rem',
        letterSpacing: '.1em',
        color: '#475569',
        fontFamily: mono,
        marginBottom: '.4rem',
      }}>
        {label}
        {required && (
          <span style={{ color: '#ef4444', marginLeft: '.3rem' }}>*</span>
        )}
        {optional && (
          <span style={{ color: '#334155', marginLeft: '.5rem', fontSize: '.68rem', letterSpacing: '.05em' }}>
            (optional)
          </span>
        )}
      </label>
      {children}
      {hint && (
        <div style={{ marginTop: '.3rem', fontSize: '.75rem', color: '#475569' }}>{hint}</div>
      )}
    </div>
  );
}

// ── Reusable input ────────────────────────────────────────────────────────────
function Input({
  value, onChange, placeholder, type = 'text', disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{ ...inputSt, opacity: disabled ? 0.5 : 1 }}
    />
  );
}

// ── Reusable textarea ─────────────────────────────────────────────────────────
function Textarea({
  value, onChange, placeholder, rows = 3, maxLen, disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  maxLen?: number;
  disabled?: boolean;
}) {
  return (
    <div>
      <textarea
        value={value}
        onChange={e => onChange(maxLen ? e.target.value.slice(0, maxLen) : e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        style={{
          ...textareaSt,
          minHeight: `${rows * 24 + 24}px`,
          opacity: disabled ? 0.5 : 1,
        }}
      />
      {maxLen && (
        <div style={{
          textAlign: 'right',
          fontSize: '.72rem',
          color: value.length >= maxLen ? '#ef4444' : '#475569',
          marginTop: '.2rem',
          fontFamily: mono,
        }}>
          {value.length} / {maxLen}
        </div>
      )}
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────
export default function SubmitForm({ email: initialEmail }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  // Email
  const [email, setEmail] = useState(initialEmail);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Section A — all required
  const [category,      setCategory]      = useState('');
  const [projectTitle,  setProjectTitle]  = useState('');
  const [teamMembers,   setTeamMembers]   = useState('');
  const [abstract,      setAbstract]      = useState('');
  const [keyFeatures,   setKeyFeatures]   = useState('');
  const [socialImpact,  setSocialImpact]  = useState('');
  const [marketability, setMarketability] = useState('');

  // Section B
  const [videoUrl,   setVideoUrl]   = useState('');
  const [slidesLink, setSlidesLink] = useState('');

  // Section C — all optional
  const [inspiration,      setInspiration]      = useState('');
  const [biggestChallenge, setBiggestChallenge] = useState('');
  const [aiRole,           setAiRole]           = useState('');
  const [futurePlans,      setFuturePlans]      = useState('');

  // Section D — required (apt optional)
  const [recipientName,  setRecipientName]  = useState('');
  const [streetAddress,  setStreetAddress]  = useState('');
  const [apt,            setApt]            = useState('');
  const [city,           setCity]           = useState('');
  const [shippingState,  setShippingState]  = useState('');
  const [postalCode,     setPostalCode]     = useState('');
  const [country,        setCountry]        = useState('');

  // Required: all Section A + videoUrl + all Section D except apt
  const canSubmit =
    emailValid &&
    !!category && !!projectTitle && !!teamMembers && !!abstract &&
    !!keyFeatures && !!socialImpact && !!marketability &&
    !!videoUrl &&
    !!recipientName && !!streetAddress && !!city && !!shippingState && !!postalCode && !!country &&
    !loading;

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:            email.trim().toLowerCase(),
          category,
          projectTitle,
          teamMembers,
          abstract,
          keyFeatures,
          socialImpact,
          marketability,
          videoUrl,
          slidesLink,
          inspiration,
          biggestChallenge,
          aiRole,
          futurePlans,
          recipientName,
          streetAddress,
          apt,
          city,
          shippingState,
          postalCode,
          country,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Submission failed. Please try again.');
        setLoading(false);
        return;
      }
      setSuccess(true);
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: sans,
      }}>
        <div style={{ maxWidth: '520px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '.1em', color: '#fff', lineHeight: 1 }}>
              AI·JAM US 2026
            </div>
            <div style={{ fontSize: '.75rem', letterSpacing: '.15em', color: '#475569', marginTop: '.4rem' }}>
              11TH INTERNATIONAL AI INVENTION CHALLENGE
            </div>
          </div>

          <div style={{
            background: '#111118',
            border: '1px solid rgba(124,58,237,.3)',
            padding: '2.5rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🚀</div>

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
              fontFamily: mono,
            }}>
              📬 SUBMISSION RECEIVED
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 .8rem' }}>
              Your project is submitted!
            </h1>

            <p style={{ fontSize: '.95rem', color: '#94a3b8', lineHeight: 1.8, margin: '0 0 2rem' }}>
              A confirmation email has been sent to<br />
              <strong style={{ color: '#e2e8f0' }}>{email}</strong>.<br />
              Results will be announced on September 6, 2026.
            </p>

            <div style={{
              background: '#1a1a2e',
              border: '1px solid rgba(255,255,255,.08)',
              borderLeft: '3px solid #7c3aed',
              padding: '1.2rem 1.5rem',
              textAlign: 'left',
              marginBottom: '2rem',
            }}>
              <div style={{ fontSize: '.72rem', letterSpacing: '.1em', color: '#475569', marginBottom: '.6rem', fontFamily: mono }}>
                WHAT HAPPENS NEXT
              </div>
              {[
                'Our judges will review your submission',
                'Results announced: September 6, 2026',
                'Winners contacted regarding awards',
                'You may re-submit before Aug 30 if needed',
              ].map((s, i) => (
                <div key={s} style={{ display: 'flex', gap: '.8rem', marginBottom: '.5rem', fontSize: '.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  <span style={{ color: '#a78bfa', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <a href="/" style={{
              display: 'block',
              background: 'linear-gradient(135deg,#1e40af,#7c3aed)',
              color: '#fff',
              padding: '1rem',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '.06em',
            }}>
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

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', padding: '2rem 1rem', fontFamily: sans }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Page header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '.1em', color: '#fff', lineHeight: 1 }}>
            AI·JAM US 2026
          </div>
          <div style={{ fontSize: '.75rem', letterSpacing: '.15em', color: '#475569', marginTop: '.4rem' }}>
            11TH INTERNATIONAL AI INVENTION CHALLENGE
          </div>
        </div>

        {/* Title bar */}
        <div style={{ background: 'linear-gradient(135deg,#1e40af,#7c3aed)', padding: '1.2rem 2rem' }}>
          <div style={{ fontSize: '.68rem', letterSpacing: '.15em', color: 'rgba(255,255,255,.6)', fontFamily: mono, marginBottom: '.3rem' }}>
            PROJECT SUBMISSION FORM
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
            Submit your AI project · Deadline: August 30, 2026
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── Email ──────────────────────────────────────────────────────── */}
          <div style={{
            background: '#111118',
            border: '1px solid rgba(255,255,255,.1)',
            borderTop: 'none',
            padding: '1.5rem 2rem',
            marginBottom: '1.5rem',
          }}>
            <Field label="REGISTERED EMAIL" required>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Required"
                disabled={loading}
                style={{
                  ...inputSt,
                  border: `1px solid ${!emailValid && email.length > 0 ? 'rgba(239,68,68,.5)' : 'rgba(255,255,255,.12)'}`,
                  opacity: loading ? 0.5 : 1,
                }}
              />
              {!emailValid && email.length > 0 && (
                <div style={{ marginTop: '.3rem', fontSize: '.75rem', color: '#ef4444' }}>
                  Please enter a valid email address.
                </div>
              )}
            </Field>
          </div>

          {/* ══ Section A — Basic Information ══════════════════════════════════ */}
          <div style={{
            background: '#111118',
            border: '1px solid rgba(255,255,255,.1)',
            padding: '2rem',
            marginBottom: '1.5rem',
          }}>
            <div style={sectionHeaderSt}>
              <div style={sectionBadgeSt('#1e40af')}>A</div>
              <div>
                <div style={sectionTitleSt}>BASIC INFORMATION</div>
                <div style={{ fontSize: '.8rem', color: '#475569', marginTop: '.2rem' }}>
                  All fields required
                </div>
              </div>
            </div>

            {/* Category */}
            <Field label="CATEGORY" required>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                disabled={loading}
                style={{
                  ...inputSt,
                  appearance: 'none' as const,
                  cursor: 'pointer',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                <option value="">Required — select a category…</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>

            {/* Project title */}
            <Field label="PROJECT TITLE" required>
              <Input
                value={projectTitle}
                onChange={setProjectTitle}
                placeholder="Required"
                disabled={loading}
              />
            </Field>

            {/* Team members */}
            <Field
              label="TEAM MEMBERS"
              required
              hint="Full names of all team members, one per line"
            >
              <Textarea
                value={teamMembers}
                onChange={setTeamMembers}
                placeholder={"Required — e.g.\nJane Smith\nJohn Doe\nAlex Kim"}
                rows={3}
                disabled={loading}
              />
            </Field>

            {/* Abstract */}
            <Field label="ABSTRACT" required hint="Summarize your project in 500 characters or less">
              <Textarea
                value={abstract}
                onChange={setAbstract}
                placeholder="Required — a concise summary of your project, its goal, and how AI plays a role…"
                rows={4}
                maxLen={500}
                disabled={loading}
              />
            </Field>

            {/* Key features */}
            <Field label="KEY FEATURES" required hint="What makes your project unique?">
              <Textarea
                value={keyFeatures}
                onChange={setKeyFeatures}
                placeholder="Required — list the core features or capabilities of your AI solution…"
                rows={3}
                disabled={loading}
              />
            </Field>

            {/* Social impact */}
            <Field label="SOCIAL IMPACT" required hint="How does your project benefit society?">
              <Textarea
                value={socialImpact}
                onChange={setSocialImpact}
                placeholder="Required — describe the positive impact your project has on people or the environment…"
                rows={3}
                disabled={loading}
              />
            </Field>

            {/* Marketability */}
            <Field label="MARKETABILITY" required hint="Who are the target users? What is the potential market?">
              <Textarea
                value={marketability}
                onChange={setMarketability}
                placeholder="Required — explain the target audience, potential business model, or scalability…"
                rows={3}
                disabled={loading}
              />
            </Field>
          </div>

          {/* ══ Section B — Media ════════════════════════════════════════════════ */}
          <div style={{
            background: '#111118',
            border: '1px solid rgba(255,255,255,.1)',
            padding: '2rem',
            marginBottom: '1.5rem',
          }}>
            <div style={sectionHeaderSt}>
              <div style={sectionBadgeSt('#0891b2')}>B</div>
              <div>
                <div style={sectionTitleSt}>MEDIA</div>
                <div style={{ fontSize: '.8rem', color: '#475569', marginTop: '.2rem' }}>
                  Demo video required · Slides optional
                </div>
              </div>
            </div>

            {/* Video URL */}
            <Field
              label="VIDEO URL"
              required
              hint="YouTube or Vimeo link to your 30-second demo video"
            >
              <Input
                value={videoUrl}
                onChange={setVideoUrl}
                placeholder="Required — https://www.youtube.com/watch?v=..."
                type="url"
                disabled={loading}
              />
            </Field>

            {/* Slides link */}
            <Field
              label="SLIDES LINK"
              optional
              hint="Upload your slides to Google Drive or Dropbox and paste the shareable link here"
            >
              <Input
                value={slidesLink}
                onChange={setSlidesLink}
                placeholder="https://drive.google.com/... or https://dropbox.com/..."
                type="url"
                disabled={loading}
              />
            </Field>

            {/* Email alternative */}
            <div style={{
              background: 'rgba(255,255,255,.02)',
              border: '1px solid rgba(255,255,255,.06)',
              padding: '.8rem 1rem',
              fontSize: '.78rem',
              color: '#475569',
              lineHeight: 1.7,
            }}>
              Or email your slides to{' '}
              <a href="mailto:team@aijam.org" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                team@aijam.org
              </a>
              {' '}with subject:{' '}
              <span style={{ color: '#94a3b8', fontFamily: mono, fontSize: '.72rem' }}>
                [Your Project Title] Slides
              </span>
            </div>
          </div>

          {/* ══ Section C — Team Story ════════════════════════════════════════════ */}
          <div style={{
            background: '#111118',
            border: '1px solid rgba(255,255,255,.1)',
            padding: '2rem',
            marginBottom: '1.5rem',
          }}>
            <div style={sectionHeaderSt}>
              <div style={sectionBadgeSt('#059669')}>C</div>
              <div>
                <div style={sectionTitleSt}>TEAM STORY</div>
                <div style={{ fontSize: '.8rem', color: '#475569', marginTop: '.2rem' }}>
                  All fields optional — tell the story behind your project
                </div>
              </div>
            </div>

            <Field label="INSPIRATION" optional hint="What problem or idea inspired this project?">
              <Textarea
                value={inspiration}
                onChange={setInspiration}
                placeholder="Describe the moment or experience that sparked the idea for your project…"
                rows={3}
                disabled={loading}
              />
            </Field>

            <Field label="BIGGEST CHALLENGE" optional hint="What was the hardest part of building this?">
              <Textarea
                value={biggestChallenge}
                onChange={setBiggestChallenge}
                placeholder="Describe a major obstacle your team faced and how you overcame it…"
                rows={3}
                disabled={loading}
              />
            </Field>

            <Field label="ROLE OF AI" optional hint="How is artificial intelligence used in your project?">
              <Textarea
                value={aiRole}
                onChange={setAiRole}
                placeholder="Explain which AI technologies, models, or techniques you used and why…"
                rows={3}
                disabled={loading}
              />
            </Field>

            <Field label="FUTURE PLANS" optional hint="Where do you see this project going?">
              <Textarea
                value={futurePlans}
                onChange={setFuturePlans}
                placeholder="Share your vision for the next steps, improvements, or scaling plans…"
                rows={3}
                disabled={loading}
              />
            </Field>
          </div>

          {/* ══ Section D — Shipping Address ══════════════════════════════════════ */}
          <div style={{
            background: '#111118',
            border: '1px solid rgba(255,255,255,.1)',
            padding: '2rem',
            marginBottom: '1.5rem',
          }}>
            <div style={sectionHeaderSt}>
              <div style={sectionBadgeSt('#d97706')}>D</div>
              <div>
                <div style={sectionTitleSt}>SHIPPING ADDRESS</div>
                <div style={{ fontSize: '.8rem', color: '#475569', marginTop: '.2rem' }}>
                  Required for award delivery
                </div>
              </div>
            </div>

            {/* Recipient Name — full width */}
            <Field label="RECIPIENT NAME" required>
              <Input
                value={recipientName}
                onChange={setRecipientName}
                placeholder="Required — full name of award recipient"
                disabled={loading}
              />
            </Field>

            {/* Street Address — full width */}
            <Field label="STREET ADDRESS" required>
              <Input
                value={streetAddress}
                onChange={setStreetAddress}
                placeholder="Required — 123 Main Street"
                disabled={loading}
              />
            </Field>

            {/* Apt/Suite/Unit — full width, optional */}
            <Field label="APT / SUITE / UNIT" optional>
              <Input
                value={apt}
                onChange={setApt}
                placeholder="Apt 4B, Suite 200, Unit 3…"
                disabled={loading}
              />
            </Field>

            {/* City + State — 2 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="CITY" required>
                <Input
                  value={city}
                  onChange={setCity}
                  placeholder="Required"
                  disabled={loading}
                />
              </Field>
              <Field label="STATE / PROVINCE" required>
                <Input
                  value={shippingState}
                  onChange={setShippingState}
                  placeholder="Required"
                  disabled={loading}
                />
              </Field>
            </div>

            {/* Postal Code + Country — 2 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="POSTAL CODE" required>
                <Input
                  value={postalCode}
                  onChange={setPostalCode}
                  placeholder="Required"
                  disabled={loading}
                />
              </Field>
              <Field label="COUNTRY" required>
                <Input
                  value={country}
                  onChange={setCountry}
                  placeholder="Required"
                  disabled={loading}
                />
              </Field>
            </div>
          </div>

          {/* ── Error ────────────────────────────────────────────────────────── */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,.06)',
              border: '1px solid rgba(239,68,68,.2)',
              padding: '.9rem 1.2rem',
              marginBottom: '1rem',
              fontSize: '.88rem',
              color: '#ef4444',
            }}>
              {error}
            </div>
          )}

          {/* ── Submit button ─────────────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: '100%',
              padding: '1.1rem',
              background: canSubmit
                ? 'linear-gradient(135deg,#1e40af,#7c3aed)'
                : 'rgba(124,58,237,.15)',
              color: canSubmit ? '#fff' : '#64748b',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '.06em',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              fontFamily: sans,
              transition: 'background .2s',
              marginBottom: '.8rem',
            }}
          >
            {loading ? '⏳ Submitting...' : '🚀 Submit Project'}
          </button>

          {/* Hint when button is disabled */}
          {!canSubmit && !loading && (
            <div style={{ textAlign: 'center', fontSize: '.78rem', color: '#475569', marginBottom: '1.5rem' }}>
              {!emailValid
                ? 'Enter a valid email address to continue.'
                : !category
                  ? 'Select a category (Section A) to continue.'
                  : !projectTitle
                    ? 'Enter a project title (Section A) to continue.'
                    : !teamMembers
                      ? 'Enter team members (Section A) to continue.'
                      : !abstract
                        ? 'Enter an abstract (Section A) to continue.'
                        : !keyFeatures
                          ? 'Enter key features (Section A) to continue.'
                          : !socialImpact
                            ? 'Enter social impact (Section A) to continue.'
                            : !marketability
                              ? 'Enter marketability (Section A) to continue.'
                              : !videoUrl
                                ? 'Enter a video URL (Section B) to continue.'
                                : !recipientName
                                  ? 'Enter a recipient name (Section D) to continue.'
                                  : !streetAddress
                                    ? 'Enter a street address (Section D) to continue.'
                                    : !city
                                      ? 'Enter a city (Section D) to continue.'
                                      : !shippingState
                                        ? 'Enter a state / province (Section D) to continue.'
                                        : !postalCode
                                          ? 'Enter a postal code (Section D) to continue.'
                                          : !country
                                            ? 'Enter a country (Section D) to continue.'
                                            : ''}
            </div>
          )}

          {/* Required fields legend */}
          <div style={{ textAlign: 'center', fontSize: '.75rem', color: '#334155', marginBottom: '.6rem' }}>
            <span style={{ color: '#ef4444' }}>*</span> Required fields
          </div>

          <div style={{ textAlign: 'center', fontSize: '.78rem', color: '#334155', marginBottom: '1.5rem' }}>
            Submission deadline:{' '}
            <span style={{ color: '#ef4444', fontWeight: 600 }}>August 30, 2026 · 11:59 PM PT</span>
          </div>
        </form>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '.5rem', marginBottom: '3rem' }}>
          <a href="/" style={{ color: '#3b82f6', fontSize: '.88rem', textDecoration: 'none' }}>
            ← Back to AI-JAM US
          </a>
        </div>
      </div>
    </div>
  );
}
