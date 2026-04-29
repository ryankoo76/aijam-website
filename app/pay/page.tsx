'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function PayContent() {
  const params = useSearchParams();
  const email = params.get('email') ?? '';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePay() {
    if (!email) {
      setError('Missing email. Please register first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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

          {/* Price display */}
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

          {/* Email info */}
          {email && (
            <div style={{
              background: 'rgba(59,130,246,.06)',
              border: '1px solid rgba(59,130,246,.2)',
              padding: '1rem 1.2rem',
              marginBottom: '1.5rem',
              fontSize: '.88rem',
            }}>
              <div style={{ color: '#64748b', fontSize: '.72rem', letterSpacing: '.1em', fontFamily: "'Space Mono', monospace", marginBottom: '.4rem' }}>PAYING FOR</div>
              <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{email}</div>
            </div>
          )}

          {!email && (
            <div style={{
              background: 'rgba(239,68,68,.06)',
              border: '1px solid rgba(239,68,68,.2)',
              padding: '1rem 1.2rem',
              marginBottom: '1.5rem',
              fontSize: '.88rem',
              color: '#ef4444',
            }}>
              No email provided. Please <a href="/#register" style={{ color: '#3b82f6' }}>register first</a>.
            </div>
          )}

          {/* Error */}
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
            disabled={loading || !email}
            style={{
              width: '100%',
              padding: '1rem',
              background: loading || !email
                ? 'rgba(59,130,246,.3)'
                : 'linear-gradient(135deg,#1e40af,#0891b2)',
              color: '#fff',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '.06em',
              cursor: loading || !email ? 'not-allowed' : 'pointer',
              fontFamily: "'Outfit', sans-serif",
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
