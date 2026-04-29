'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function PayContent() {
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canPay = emailValid && !loading;

  async function handlePay() {
    if (!canPay) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Failed to create checkout session.');
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  const showValidationHint = email.length > 0 && !emailValid;

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

        {/* Card */}
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
          }}>PARTICIPATION FEE</div>

          {/* Price */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '.5rem',
            marginBottom: '1.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid rgba(255,255,255,.08)',
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#f1f5f9', lineHeight: 1 }}>$30</div>
            <div style={{ fontSize: '1rem', color: '#64748b', paddingBottom: '.4rem' }}>USD · one-time</div>
          </div>

          {/* What's included */}
          <div style={{ marginBottom: '1.8rem' }}>
            <div style={{ fontSize: '.72rem', letterSpacing: '.1em', color: '#475569', marginBottom: '.8rem', fontFamily: "'Space Mono', monospace" }}>INCLUDES</div>
            {[
              'Official participation certificate',
              'AI-enhanced poster of your project',
              'Social media content package',
              'Access to AI-JAM US global community',
              'Grand Prix / Gold / Silver / Bronze award eligibility',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', gap: '.6rem', alignItems: 'flex-start', marginBottom: '.5rem', fontSize: '.92rem', color: '#94a3b8', lineHeight: 1.6 }}>
                <span style={{ color: '#10b981', flexShrink: 0, marginTop: '.1rem' }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Email input */}
          <div style={{ marginBottom: '1.5rem' }}>
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
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="Enter your registration email"
              disabled={loading}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: '#0a0a0f',
                border: `1px solid ${showValidationHint ? 'rgba(239,68,68,.5)' : 'rgba(255,255,255,.12)'}`,
                color: '#e2e8f0',
                padding: '.75rem 1rem',
                fontSize: '.95rem',
                fontFamily: "'Outfit', sans-serif",
                outline: 'none',
                opacity: loading ? 0.5 : 1,
              }}
            />
            {showValidationHint && (
              <div style={{ marginTop: '.4rem', fontSize: '.78rem', color: '#ef4444' }}>
                Please enter a valid email address.
              </div>
            )}
          </div>

          {/* API error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,.06)',
              border: '1px solid rgba(239,68,68,.2)',
              padding: '.8rem 1.2rem',
              marginBottom: '1rem',
              fontSize: '.88rem',
              color: '#ef4444',
            }}>{error}</div>
          )}

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={!canPay}
            style={{
              width: '100%',
              padding: '1rem',
              background: canPay
                ? 'linear-gradient(135deg,#1e40af,#0891b2)'
                : 'rgba(59,130,246,.2)',
              color: canPay ? '#fff' : '#64748b',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '.06em',
              cursor: canPay ? 'pointer' : 'not-allowed',
              fontFamily: "'Outfit', sans-serif",
              transition: 'background .2s',
            }}
          >
            {loading ? 'Redirecting to Stripe...' : '💳 Pay $30 Now'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '.78rem', color: '#475569' }}>
            Secured by Stripe · SSL encrypted
          </div>
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/" style={{ color: '#3b82f6', fontSize: '.88rem', textDecoration: 'none' }}>
            ← Back to AI-JAM US
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontFamily: "'Outfit', sans-serif" }}>
        Loading...
      </div>
    }>
      <PayContent />
    </Suspense>
  );
}
