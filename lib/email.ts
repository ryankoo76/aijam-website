import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM_EMAIL ?? 'team@aijam.org';

// Module-level env check (shows up in Vercel function logs on cold start)
console.log('[email] module init —', {
  resendKeyPresent: !!process.env.RESEND_API_KEY,
  resendKeyPrefix:  process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.slice(0, 10) + '...' : 'MISSING',
  fromEmail:        FROM,
});

// ─── Email 1: Participant confirmation ───────────────────────────────────────
export async function sendRegistrationConfirmed({
  to,
  firstName,
  country,
  school,
}: {
  to: string;
  firstName: string;
  country: string;
  school: string;
}) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration Confirmed — AI-JAM US 2026</title>
  <style>
    body { margin:0; padding:0; background:#0a0a0f; font-family:'Helvetica Neue',Arial,sans-serif; color:#e2e8f0; }
    .wrap { max-width:600px; margin:0 auto; background:#111118; }
    .header { background:linear-gradient(135deg,#1e40af,#0891b2); padding:2rem 2.5rem; text-align:center; }
    .header h1 { margin:0; font-size:2rem; letter-spacing:.06em; color:#fff; font-weight:900; }
    .header p { margin:.4rem 0 0; font-size:.85rem; color:rgba(255,255,255,.7); letter-spacing:.1em; }
    .body { padding:2.5rem; }
    .greeting { font-size:1.1rem; font-weight:700; margin-bottom:1rem; color:#f1f5f9; }
    .confirm-badge { display:inline-block; background:rgba(16,185,129,.1); border:1px solid rgba(16,185,129,.3); color:#10b981; padding:.5rem 1.2rem; border-radius:2px; font-size:.8rem; letter-spacing:.12em; font-weight:700; margin-bottom:1.5rem; }
    .info-box { background:#1a1a2e; border:1px solid rgba(255,255,255,.08); border-left:3px solid #3b82f6; padding:1.2rem 1.5rem; margin:1.5rem 0; }
    .info-row { display:flex; gap:.5rem; margin:.35rem 0; font-size:.9rem; }
    .info-label { color:#64748b; min-width:90px; }
    .info-val { color:#e2e8f0; font-weight:600; }
    .dl-btn { display:block; background:linear-gradient(135deg,#1e40af,#0891b2); color:#fff; text-align:center; padding:1rem; text-decoration:none; font-weight:700; font-size:.95rem; letter-spacing:.06em; margin:1.8rem 0; }
    .section-title { font-size:.7rem; letter-spacing:.15em; color:#475569; margin:1.5rem 0 .6rem; font-weight:700; }
    .fee-box { background:rgba(245,158,11,.05); border:1px solid rgba(245,158,11,.18); padding:1rem 1.5rem; margin:1rem 0; font-size:.88rem; color:#cbd5e1; line-height:1.7; }
    .deadline { color:#ef4444; font-weight:700; }
    .footer { background:#0a0a0f; padding:1.5rem 2.5rem; text-align:center; border-top:1px solid rgba(255,255,255,.06); }
    .footer p { margin:.3rem 0; font-size:.75rem; color:#475569; }
    .footer a { color:#3b82f6; text-decoration:none; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>AI·JAM US 2026</h1>
    <p>11TH INTERNATIONAL AI INVENTION CHALLENGE</p>
  </div>
  <div class="body">
    <div class="greeting">Hi ${firstName}, welcome to AI-JAM US 2026! 🎉</div>
    <div class="confirm-badge">✅ REGISTRATION CONFIRMED</div>

    <p style="font-size:.95rem;color:#94a3b8;line-height:1.8;margin:0 0 1.2rem">
      Your spot in the 11th International AI Invention Challenge is secured.
      We're thrilled to have you join innovators from over 72 countries.
    </p>

    <div class="info-box">
      <div class="section-title">YOUR REGISTRATION DETAILS</div>
      <div class="info-row"><span class="info-label">Name</span><span class="info-val">${firstName}</span></div>
      <div class="info-row"><span class="info-label">Country</span><span class="info-val">${country}</span></div>
      <div class="info-row"><span class="info-label">School</span><span class="info-val">${school}</span></div>
    </div>

    <div class="section-title">STEP 1 — DOWNLOAD YOUR OFFICIAL GUIDEBOOK</div>
    <p style="font-size:.88rem;color:#94a3b8;line-height:1.7;margin:0 0 .5rem">
      Everything you need to create a winning submission:
      3-slide format, 30-second video tips, judging criteria, and key dates.
    </p>
    <a class="dl-btn" href="https://www.aijam-us.com/AIJAM_Guidebook_2026.pdf">
      📥 Download Official Guidebook (PDF)
    </a>

    <div class="section-title">PARTICIPATION FEE</div>
    <div class="fee-box">
      Participation fee details will be sent within <strong style="color:#f1f5f9">24 hours</strong>.<br />
      Early-bird pricing available — check your inbox tomorrow.
    </div>

    <div class="section-title">KEY DATES</div>
    <div class="info-box">
      <div class="info-row"><span class="info-label">Registration</span><span class="info-val" style="color:#10b981">Now Open</span></div>
      <div class="info-row"><span class="info-label">Shadow Season</span><span class="info-val">Jan – Jun 2026</span></div>
      <div class="info-row"><span class="info-label">Deadline</span><span class="info-val deadline">August 30, 2026 · 11:59 PM PT</span></div>
      <div class="info-row"><span class="info-label">Results</span><span class="info-val" style="color:#3b82f6">September 6, 2026</span></div>
    </div>

    <p style="font-size:.85rem;color:#64748b;line-height:1.7;margin-top:1.5rem">
      Questions? Reply to this email or contact us at
      <a href="mailto:team@aijam.org" style="color:#3b82f6">team@aijam.org</a>
    </p>
  </div>
  <div class="footer">
    <p><strong style="color:#94a3b8">AI-JAM US · PAIAX</strong></p>
    <p>855 Maude Avenue, Mountain View, CA</p>
    <p><a href="mailto:team@aijam.org">team@aijam.org</a> · <a href="https://www.aijam-us.com">www.aijam-us.com</a></p>
    <p style="margin-top:.8rem">©2016–2026 AI-JAM US. All Rights Reserved.</p>
  </div>
</div>
</body>
</html>`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Welcome to AI-JAM US 2026 — Registration Confirmed',
    html,
  });
}

// ─── Email 3: Payment confirmation (participant) ──────────────────────────────
export async function sendPaymentConfirmation({
  to,
  amount,
}: {
  to: string;
  amount: number; // in cents
}) {
  const displayAmount = `$${(amount / 100).toFixed(2)}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment Confirmed — AI-JAM US 2026</title>
  <style>
    body { margin:0; padding:0; background:#0a0a0f; font-family:'Helvetica Neue',Arial,sans-serif; color:#e2e8f0; }
    .wrap { max-width:600px; margin:0 auto; background:#111118; }
    .header { background:linear-gradient(135deg,#065f46,#0891b2); padding:2rem 2.5rem; text-align:center; }
    .header h1 { margin:0; font-size:2rem; letter-spacing:.06em; color:#fff; font-weight:900; }
    .header p { margin:.4rem 0 0; font-size:.85rem; color:rgba(255,255,255,.7); letter-spacing:.1em; }
    .body { padding:2.5rem; }
    .confirm-badge { display:inline-block; background:rgba(16,185,129,.1); border:1px solid rgba(16,185,129,.3); color:#10b981; padding:.5rem 1.2rem; border-radius:2px; font-size:.8rem; letter-spacing:.12em; font-weight:700; margin-bottom:1.5rem; }
    .amount-box { background:rgba(16,185,129,.05); border:1px solid rgba(16,185,129,.2); padding:1.5rem; text-align:center; margin:1.5rem 0; }
    .amount-label { font-size:.72rem; letter-spacing:.12em; color:#475569; margin-bottom:.5rem; }
    .amount-value { font-size:2.5rem; font-weight:900; color:#10b981; line-height:1; }
    .info-box { background:#1a1a2e; border:1px solid rgba(255,255,255,.08); border-left:3px solid #10b981; padding:1.2rem 1.5rem; margin:1.5rem 0; }
    .section-title { font-size:.7rem; letter-spacing:.15em; color:#475569; margin:1.5rem 0 .6rem; font-weight:700; }
    .info-row { display:flex; gap:.5rem; margin:.35rem 0; font-size:.9rem; }
    .info-label { color:#64748b; min-width:90px; }
    .info-val { color:#e2e8f0; font-weight:600; }
    .step-row { display:flex; gap:.8rem; align-items:flex-start; margin:.5rem 0; font-size:.88rem; color:#94a3b8; line-height:1.6; }
    .step-num { color:#10b981; font-weight:700; flex-shrink:0; }
    .cta-btn { display:block; background:linear-gradient(135deg,#065f46,#0891b2); color:#fff; text-align:center; padding:1rem; text-decoration:none; font-weight:700; font-size:.95rem; letter-spacing:.06em; margin:1.8rem 0; }
    .footer { background:#0a0a0f; padding:1.5rem 2.5rem; text-align:center; border-top:1px solid rgba(255,255,255,.06); }
    .footer p { margin:.3rem 0; font-size:.75rem; color:#475569; }
    .footer a { color:#3b82f6; text-decoration:none; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>AI·JAM US 2026</h1>
    <p>11TH INTERNATIONAL AI INVENTION CHALLENGE</p>
  </div>
  <div class="body">
    <div class="confirm-badge">✅ PAYMENT CONFIRMED</div>
    <p style="font-size:1.05rem;font-weight:700;color:#f1f5f9;margin:0 0 .5rem">You&apos;re officially registered!</p>
    <p style="font-size:.95rem;color:#94a3b8;line-height:1.8;margin:0 0 1.5rem">
      Your participation fee has been successfully processed.
      Welcome to the 11th International AI Invention Challenge.
    </p>

    <div class="amount-box">
      <div class="amount-label">AMOUNT PAID</div>
      <div class="amount-value">${displayAmount}</div>
      <div style="font-size:.8rem;color:#64748b;margin-top:.4rem">USD · One-time participation fee</div>
    </div>

    <div class="section-title">NEXT STEPS</div>
    <div class="info-box">
      <div class="step-row"><span class="step-num">1.</span><span>Download the Official Guidebook and review the submission format</span></div>
      <div class="step-row"><span class="step-num">2.</span><span>Prepare your 3-slide presentation and 30-second video</span></div>
      <div class="step-row"><span class="step-num">3.</span><span>Submit your project before <strong style="color:#ef4444">August 30, 2026 · 11:59 PM PT</strong></span></div>
      <div class="step-row"><span class="step-num">4.</span><span>Results announced online: September 6, 2026</span></div>
    </div>

    <a class="cta-btn" href="https://www.aijam-us.com/AIJAM_Guidebook_2026.pdf">
      📥 Download Official Guidebook (PDF)
    </a>

    <div class="section-title">KEY DATES</div>
    <div class="info-box">
      <div class="info-row"><span class="info-label">Shadow Season</span><span class="info-val">Jan – Jun 2026</span></div>
      <div class="info-row"><span class="info-label">Deadline</span><span class="info-val" style="color:#ef4444">August 30, 2026 · 11:59 PM PT</span></div>
      <div class="info-row"><span class="info-label">Results</span><span class="info-val" style="color:#3b82f6">September 6, 2026</span></div>
    </div>

    <p style="font-size:.85rem;color:#64748b;line-height:1.7;margin-top:1.5rem">
      Questions? Reply to this email or contact us at
      <a href="mailto:team@aijam.org" style="color:#3b82f6">team@aijam.org</a>
    </p>
  </div>
  <div class="footer">
    <p><strong style="color:#94a3b8">AI-JAM US · PAIAX</strong></p>
    <p>855 Maude Avenue, Mountain View, CA</p>
    <p><a href="mailto:team@aijam.org">team@aijam.org</a> · <a href="https://www.aijam-us.com">www.aijam-us.com</a></p>
    <p style="margin-top:.8rem">©2016–2026 AI-JAM US. All Rights Reserved.</p>
  </div>
</div>
</body>
</html>`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Payment Confirmed — AI-JAM US 2026 (${displayAmount})`,
    html,
  });
}

// ─── Email 4: Submission confirmation ────────────────────────────────────────
export async function sendSubmissionConfirmation({
  to,
  firstName,
  projectTitle,
}: {
  to: string;
  firstName: string;
  projectTitle: string;
}) {
  console.log('[email] sendSubmissionConfirmation — to:', to, '| from:', FROM, '| project:', projectTitle.slice(0, 40));
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Submission Received — AI-JAM US 2026</title>
  <style>
    body { margin:0; padding:0; background:#0a0a0f; font-family:'Helvetica Neue',Arial,sans-serif; color:#e2e8f0; }
    .wrap { max-width:600px; margin:0 auto; background:#111118; }
    .header { background:linear-gradient(135deg,#1e40af,#7c3aed); padding:2rem 2.5rem; text-align:center; }
    .header h1 { margin:0; font-size:2rem; letter-spacing:.06em; color:#fff; font-weight:900; }
    .header p { margin:.4rem 0 0; font-size:.85rem; color:rgba(255,255,255,.7); letter-spacing:.1em; }
    .body { padding:2.5rem; }
    .confirm-badge { display:inline-block; background:rgba(124,58,237,.1); border:1px solid rgba(124,58,237,.3); color:#a78bfa; padding:.5rem 1.2rem; border-radius:2px; font-size:.8rem; letter-spacing:.12em; font-weight:700; margin-bottom:1.5rem; }
    .project-box { background:rgba(124,58,237,.05); border:1px solid rgba(124,58,237,.2); padding:1.5rem; margin:1.5rem 0; }
    .project-label { font-size:.72rem; letter-spacing:.12em; color:#475569; margin-bottom:.5rem; }
    .project-title { font-size:1.2rem; font-weight:700; color:#f1f5f9; }
    .info-box { background:#1a1a2e; border:1px solid rgba(255,255,255,.08); border-left:3px solid #7c3aed; padding:1.2rem 1.5rem; margin:1.5rem 0; }
    .section-title { font-size:.7rem; letter-spacing:.15em; color:#475569; margin:1.5rem 0 .6rem; font-weight:700; }
    .info-row { display:flex; gap:.5rem; margin:.35rem 0; font-size:.9rem; }
    .info-label { color:#64748b; min-width:90px; }
    .info-val { color:#e2e8f0; font-weight:600; }
    .step-row { display:flex; gap:.8rem; align-items:flex-start; margin:.5rem 0; font-size:.88rem; color:#94a3b8; line-height:1.6; }
    .step-num { color:#a78bfa; font-weight:700; flex-shrink:0; }
    .footer { background:#0a0a0f; padding:1.5rem 2.5rem; text-align:center; border-top:1px solid rgba(255,255,255,.06); }
    .footer p { margin:.3rem 0; font-size:.75rem; color:#475569; }
    .footer a { color:#3b82f6; text-decoration:none; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>AI·JAM US 2026</h1>
    <p>11TH INTERNATIONAL AI INVENTION CHALLENGE</p>
  </div>
  <div class="body">
    <div class="confirm-badge">📬 SUBMISSION RECEIVED</div>
    <p style="font-size:1.05rem;font-weight:700;color:#f1f5f9;margin:0 0 .5rem">Hi ${firstName}, your project has been submitted!</p>
    <p style="font-size:.95rem;color:#94a3b8;line-height:1.8;margin:0 0 1.5rem">
      We have received your project submission for AI-JAM US 2026.
      Our judges will review your entry and announce results on September 6, 2026.
    </p>

    <div class="project-box">
      <div class="project-label">SUBMITTED PROJECT</div>
      <div class="project-title">${projectTitle}</div>
    </div>

    <div class="section-title">WHAT HAPPENS NEXT</div>
    <div class="info-box">
      <div class="step-row"><span class="step-num">1.</span><span>Your submission has been logged and will be reviewed by our judging panel</span></div>
      <div class="step-row"><span class="step-num">2.</span><span>Results will be announced on <strong style="color:#f1f5f9">September 6, 2026</strong></span></div>
      <div class="step-row"><span class="step-num">3.</span><span>Award winners will be contacted separately regarding certificates and prizes</span></div>
      <div class="step-row"><span class="step-num">4.</span><span>You may re-submit before the deadline if you need to update your project</span></div>
    </div>

    <div class="section-title">KEY DATES</div>
    <div class="info-box">
      <div class="info-row"><span class="info-label">Deadline</span><span class="info-val" style="color:#ef4444">August 30, 2026 · 11:59 PM PT</span></div>
      <div class="info-row"><span class="info-label">Results</span><span class="info-val" style="color:#3b82f6">September 6, 2026</span></div>
    </div>

    <p style="font-size:.85rem;color:#64748b;line-height:1.7;margin-top:1.5rem">
      Questions? Reply to this email or contact us at
      <a href="mailto:team@aijam.org" style="color:#3b82f6">team@aijam.org</a>
    </p>
  </div>
  <div class="footer">
    <p><strong style="color:#94a3b8">AI-JAM US · PAIAX</strong></p>
    <p>855 Maude Avenue, Mountain View, CA</p>
    <p><a href="mailto:team@aijam.org">team@aijam.org</a> · <a href="https://www.aijam-us.com">www.aijam-us.com</a></p>
    <p style="margin-top:.8rem">©2016–2026 AI-JAM US. All Rights Reserved.</p>
  </div>
</div>
</body>
</html>`;

  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: `Submission Received — AI-JAM US 2026: ${projectTitle}`,
    html,
  });

  if (result.error) {
    console.error('[email] sendSubmissionConfirmation — Resend error:', JSON.stringify(result.error));
  } else {
    console.log('[email] sendSubmissionConfirmation — sent OK, id:', result.data?.id);
  }

  return result;
}

// ─── Email 2: Admin notification ─────────────────────────────────────────────
export async function sendAdminNotification({
  firstName,
  lastName,
  email,
  country,
  school,
  participantType,
  isTeacher,
  createdAt,
}: {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  school: string;
  participantType: string;
  isTeacher: boolean;
  createdAt: string;
}) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background:#f8fafc; color:#1e293b; margin:0; padding:2rem; }
    .card { background:#fff; border:1px solid #e2e8f0; border-left:4px solid #3b82f6; padding:1.5rem 2rem; max-width:560px; }
    .title { font-size:1rem; font-weight:700; color:#1e40af; margin:0 0 1.2rem; }
    table { width:100%; border-collapse:collapse; font-size:.9rem; }
    td { padding:.45rem .5rem; border-bottom:1px solid #f1f5f9; }
    td:first-child { color:#64748b; width:130px; font-weight:600; }
    .badge { display:inline-block; background:#ecfdf5; color:#059669; border:1px solid #a7f3d0; padding:.2rem .6rem; font-size:.75rem; font-weight:700; border-radius:2px; }
  </style>
</head>
<body>
<div class="card">
  <div class="title">🔔 New Registration — AI-JAM US 2026</div>
  <table>
    <tr><td>Name</td><td><strong>${firstName} ${lastName}</strong></td></tr>
    <tr><td>Email</td><td>${email}</td></tr>
    <tr><td>Country</td><td>${country}</td></tr>
    <tr><td>School</td><td>${school}</td></tr>
    <tr><td>Type</td><td>${participantType}</td></tr>
    <tr><td>Teacher Pack</td><td>${isTeacher ? '<span class="badge">YES — Send Class Pack</span>' : 'No'}</td></tr>
    <tr><td>Registered At</td><td>${createdAt}</td></tr>
  </table>
</div>
</body>
</html>`;

  return resend.emails.send({
    from: FROM,
    to: 'team@aijam.org',
    subject: `[AI-JAM 2026] New Registration — ${firstName} ${lastName} from ${country}`,
    html,
  });
}

// ─── Sequence Day 1: Guidebook download ──────────────────────────────────────
export async function sendSequenceDay1({
  to,
  firstName,
}: {
  to: string;
  firstName: string;
}) {
  console.log('[email] sendSequenceDay1 — to:', to);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Official Guidebook — AI-JAM US 2026</title>
  <style>
    body { margin:0; padding:0; background:#0a0a0f; font-family:'Helvetica Neue',Arial,sans-serif; color:#e2e8f0; }
    .wrap { max-width:600px; margin:0 auto; background:#111118; }
    .header { background:linear-gradient(135deg,#1e40af,#0891b2); padding:2rem 2.5rem; text-align:center; }
    .header h1 { margin:0; font-size:2rem; letter-spacing:.06em; color:#fff; font-weight:900; }
    .header p { margin:.4rem 0 0; font-size:.85rem; color:rgba(255,255,255,.7); letter-spacing:.1em; }
    .body { padding:2.5rem; }
    .section-title { font-size:.7rem; letter-spacing:.15em; color:#475569; margin:1.5rem 0 .6rem; font-weight:700; }
    .info-box { background:#1a1a2e; border:1px solid rgba(255,255,255,.08); border-left:3px solid #3b82f6; padding:1.2rem 1.5rem; margin:1.5rem 0; }
    .dl-btn { display:block; background:linear-gradient(135deg,#1e40af,#0891b2); color:#fff; text-align:center; padding:1rem; text-decoration:none; font-weight:700; font-size:.95rem; letter-spacing:.06em; margin:1.8rem 0; }
    .checklist-row { display:flex; gap:.8rem; align-items:flex-start; margin:.5rem 0; font-size:.88rem; color:#94a3b8; line-height:1.6; }
    .check { color:#10b981; font-weight:700; flex-shrink:0; }
    .footer { background:#0a0a0f; padding:1.5rem 2.5rem; text-align:center; border-top:1px solid rgba(255,255,255,.06); }
    .footer p { margin:.3rem 0; font-size:.75rem; color:#475569; }
    .footer a { color:#3b82f6; text-decoration:none; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>AI·JAM US 2026</h1>
    <p>11TH INTERNATIONAL AI INVENTION CHALLENGE</p>
  </div>
  <div class="body">
    <p style="font-size:1.05rem;font-weight:700;color:#f1f5f9;margin:0 0 .5rem">Hi ${firstName}! 👋 Day 1 resource inside.</p>
    <p style="font-size:.95rem;color:#94a3b8;line-height:1.8;margin:0 0 1.5rem">
      Here's your first resource to get started strong: the Official AI-JAM US 2026 Guidebook.
      It covers everything you need to prepare a winning submission.
    </p>

    <a class="dl-btn" href="https://www.aijam-us.com/AIJAM_Guidebook_2026.pdf">
      📥 Download Official Guidebook (PDF)
    </a>

    <div class="section-title">WHAT'S INSIDE THE GUIDEBOOK</div>
    <div class="info-box">
      <div class="checklist-row"><span class="check">✓</span><span>3-slide presentation format with exact specs</span></div>
      <div class="checklist-row"><span class="check">✓</span><span>30-second video guidelines and upload instructions</span></div>
      <div class="checklist-row"><span class="check">✓</span><span>Full judging criteria and scoring rubric</span></div>
      <div class="checklist-row"><span class="check">✓</span><span>Category descriptions and eligibility requirements</span></div>
      <div class="checklist-row"><span class="check">✓</span><span>Key dates and submission portal walkthrough</span></div>
    </div>

    <div class="section-title">KEY DATES</div>
    <div class="info-box">
      <div style="display:flex;gap:.5rem;margin:.35rem 0;font-size:.9rem"><span style="color:#64748b;min-width:90px">Deadline</span><span style="color:#ef4444;font-weight:600">August 30, 2026 · 11:59 PM PT</span></div>
      <div style="display:flex;gap:.5rem;margin:.35rem 0;font-size:.9rem"><span style="color:#64748b;min-width:90px">Results</span><span style="color:#3b82f6;font-weight:600">September 6, 2026</span></div>
    </div>

    <p style="font-size:.85rem;color:#64748b;line-height:1.7;margin-top:1.5rem">
      Questions? Reply to this email or contact us at
      <a href="mailto:team@aijam.org" style="color:#3b82f6">team@aijam.org</a>
    </p>
  </div>
  <div class="footer">
    <p><strong style="color:#94a3b8">AI-JAM US · PAIAX</strong></p>
    <p>855 Maude Avenue, Mountain View, CA</p>
    <p><a href="mailto:team@aijam.org">team@aijam.org</a> · <a href="https://www.aijam-us.com">www.aijam-us.com</a></p>
    <p style="margin-top:.8rem">©2016–2026 AI-JAM US. All Rights Reserved.</p>
  </div>
</div>
</body>
</html>`;

  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: '📥 Your AI-JAM US 2026 Official Guidebook — Day 1',
    html,
  });
  if (result.error) console.error('[email] sendSequenceDay1 — Resend error:', JSON.stringify(result.error));
  else console.log('[email] sendSequenceDay1 — sent OK, id:', result.data?.id);
  return result;
}

// ─── Sequence Day 2: Submission form + tips ───────────────────────────────────
export async function sendSequenceDay2({
  to,
  firstName,
}: {
  to: string;
  firstName: string;
}) {
  console.log('[email] sendSequenceDay2 — to:', to);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>How to Submit Your Project — AI-JAM US 2026</title>
  <style>
    body { margin:0; padding:0; background:#0a0a0f; font-family:'Helvetica Neue',Arial,sans-serif; color:#e2e8f0; }
    .wrap { max-width:600px; margin:0 auto; background:#111118; }
    .header { background:linear-gradient(135deg,#1e40af,#7c3aed); padding:2rem 2.5rem; text-align:center; }
    .header h1 { margin:0; font-size:2rem; letter-spacing:.06em; color:#fff; font-weight:900; }
    .header p { margin:.4rem 0 0; font-size:.85rem; color:rgba(255,255,255,.7); letter-spacing:.1em; }
    .body { padding:2.5rem; }
    .section-title { font-size:.7rem; letter-spacing:.15em; color:#475569; margin:1.5rem 0 .6rem; font-weight:700; }
    .info-box { background:#1a1a2e; border:1px solid rgba(255,255,255,.08); border-left:3px solid #7c3aed; padding:1.2rem 1.5rem; margin:1.5rem 0; }
    .tip-row { display:flex; gap:.8rem; align-items:flex-start; margin:.6rem 0; font-size:.88rem; color:#94a3b8; line-height:1.6; }
    .tip-num { color:#a78bfa; font-weight:700; flex-shrink:0; min-width:20px; }
    .cta-btn { display:block; background:linear-gradient(135deg,#1e40af,#7c3aed); color:#fff; text-align:center; padding:1rem; text-decoration:none; font-weight:700; font-size:.95rem; letter-spacing:.06em; margin:1.8rem 0; }
    .footer { background:#0a0a0f; padding:1.5rem 2.5rem; text-align:center; border-top:1px solid rgba(255,255,255,.06); }
    .footer p { margin:.3rem 0; font-size:.75rem; color:#475569; }
    .footer a { color:#3b82f6; text-decoration:none; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>AI·JAM US 2026</h1>
    <p>11TH INTERNATIONAL AI INVENTION CHALLENGE</p>
  </div>
  <div class="body">
    <p style="font-size:1.05rem;font-weight:700;color:#f1f5f9;margin:0 0 .5rem">Hi ${firstName}! Day 2 — How to Submit 🚀</p>
    <p style="font-size:.95rem;color:#94a3b8;line-height:1.8;margin:0 0 1.5rem">
      Ready to submit your project? The submission form is live. Here's everything you need to know.
    </p>

    <a class="cta-btn" href="https://www.aijam-us.com/submit">
      🖊 Open the Submission Form
    </a>

    <div class="section-title">WHAT YOU'LL NEED TO SUBMIT</div>
    <div class="info-box">
      <div class="tip-row"><span class="tip-num">1.</span><span><strong style="color:#e2e8f0">Project Title & Abstract</strong> — Clear, concise description of your AI innovation</span></div>
      <div class="tip-row"><span class="tip-num">2.</span><span><strong style="color:#e2e8f0">3-Slide Presentation</strong> — Upload to Google Slides or Canva, paste the share link</span></div>
      <div class="tip-row"><span class="tip-num">3.</span><span><strong style="color:#e2e8f0">30-Second Video</strong> — Demo or pitch uploaded to YouTube or Google Drive</span></div>
      <div class="tip-row"><span class="tip-num">4.</span><span><strong style="color:#e2e8f0">Team Members</strong> — Full names of all team members (up to 4)</span></div>
      <div class="tip-row"><span class="tip-num">5.</span><span><strong style="color:#e2e8f0">Shipping Address</strong> — Required for award certificate delivery</span></div>
    </div>

    <div class="section-title">PRO TIPS</div>
    <div class="info-box" style="border-left-color:#10b981">
      <div class="tip-row"><span class="tip-num" style="color:#10b981">💡</span><span>Keep your abstract under 150 words — clarity beats length every time</span></div>
      <div class="tip-row"><span class="tip-num" style="color:#10b981">💡</span><span>Your 30-second video is the most important element — practice it 10 times</span></div>
      <div class="tip-row"><span class="tip-num" style="color:#10b981">💡</span><span>You can re-submit as many times as you want before August 30 — don't wait for perfection</span></div>
    </div>

    <p style="font-size:.85rem;color:#64748b;line-height:1.7;margin-top:1.5rem">
      Questions? Reply to this email or contact us at
      <a href="mailto:team@aijam.org" style="color:#3b82f6">team@aijam.org</a>
    </p>
  </div>
  <div class="footer">
    <p><strong style="color:#94a3b8">AI-JAM US · PAIAX</strong></p>
    <p>855 Maude Avenue, Mountain View, CA</p>
    <p><a href="mailto:team@aijam.org">team@aijam.org</a> · <a href="https://www.aijam-us.com">www.aijam-us.com</a></p>
    <p style="margin-top:.8rem">©2016–2026 AI-JAM US. All Rights Reserved.</p>
  </div>
</div>
</body>
</html>`;

  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: '🚀 How to Submit Your Project — AI-JAM US 2026 Day 2',
    html,
  });
  if (result.error) console.error('[email] sendSequenceDay2 — Resend error:', JSON.stringify(result.error));
  else console.log('[email] sendSequenceDay2 — sent OK, id:', result.data?.id);
  return result;
}

// ─── Sequence Day 3: Category examples ───────────────────────────────────────
export async function sendSequenceDay3({
  to,
  firstName,
}: {
  to: string;
  firstName: string;
}) {
  console.log('[email] sendSequenceDay3 — to:', to);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Inspiring Project Ideas by Category — AI-JAM US 2026</title>
  <style>
    body { margin:0; padding:0; background:#0a0a0f; font-family:'Helvetica Neue',Arial,sans-serif; color:#e2e8f0; }
    .wrap { max-width:600px; margin:0 auto; background:#111118; }
    .header { background:linear-gradient(135deg,#0f766e,#0891b2); padding:2rem 2.5rem; text-align:center; }
    .header h1 { margin:0; font-size:2rem; letter-spacing:.06em; color:#fff; font-weight:900; }
    .header p { margin:.4rem 0 0; font-size:.85rem; color:rgba(255,255,255,.7); letter-spacing:.1em; }
    .body { padding:2.5rem; }
    .section-title { font-size:.7rem; letter-spacing:.15em; color:#475569; margin:1.5rem 0 .6rem; font-weight:700; }
    .cat-card { background:#1a1a2e; border:1px solid rgba(255,255,255,.08); padding:1rem 1.2rem; margin:.8rem 0; }
    .cat-label { font-size:.72rem; letter-spacing:.12em; color:#0891b2; font-weight:700; margin-bottom:.4rem; }
    .cat-example { font-size:.9rem; color:#e2e8f0; font-weight:600; margin-bottom:.3rem; }
    .cat-desc { font-size:.82rem; color:#94a3b8; line-height:1.6; }
    .cta-btn { display:block; background:linear-gradient(135deg,#0f766e,#0891b2); color:#fff; text-align:center; padding:1rem; text-decoration:none; font-weight:700; font-size:.95rem; letter-spacing:.06em; margin:1.8rem 0; }
    .footer { background:#0a0a0f; padding:1.5rem 2.5rem; text-align:center; border-top:1px solid rgba(255,255,255,.06); }
    .footer p { margin:.3rem 0; font-size:.75rem; color:#475569; }
    .footer a { color:#3b82f6; text-decoration:none; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>AI·JAM US 2026</h1>
    <p>11TH INTERNATIONAL AI INVENTION CHALLENGE</p>
  </div>
  <div class="body">
    <p style="font-size:1.05rem;font-weight:700;color:#f1f5f9;margin:0 0 .5rem">Hi ${firstName}! Day 3 — Project inspiration 💡</p>
    <p style="font-size:.95rem;color:#94a3b8;line-height:1.8;margin:0 0 1.5rem">
      Wondering what kind of projects win at AI-JAM? Here are example projects across our key categories to spark your creativity.
    </p>

    <div class="section-title">EXAMPLE WINNING PROJECTS BY CATEGORY</div>

    <div class="cat-card">
      <div class="cat-label">🏥 AI IN HEALTH &amp; MEDICINE</div>
      <div class="cat-example">EarlyVision — AI-Powered Early Diabetic Retinopathy Detection</div>
      <div class="cat-desc">A mobile app using a CNN trained on 80,000 retinal images to screen for diabetic retinopathy in under 10 seconds, targeting rural clinics without ophthalmologists.</div>
    </div>

    <div class="cat-card">
      <div class="cat-label">🌿 AI IN ENVIRONMENT &amp; SUSTAINABILITY</div>
      <div class="cat-example">AquaGuard — Real-Time River Pollution Detection via Satellite + AI</div>
      <div class="cat-desc">Combines Sentinel-2 satellite imagery with an LSTM model to detect and predict industrial discharge events in river systems, alerting local authorities 48 hours in advance.</div>
    </div>

    <div class="cat-card">
      <div class="cat-label">📚 AI IN EDUCATION</div>
      <div class="cat-example">MathMind — Adaptive AI Tutor for Underserved Students</div>
      <div class="cat-desc">A personalized math tutoring system that identifies each student's knowledge gaps using IRT models and generates customized exercises, achieving 40% improvement in test scores in a 3-month pilot.</div>
    </div>

    <div class="cat-card">
      <div class="cat-label">🏙 AI IN SMART CITIES</div>
      <div class="cat-example">FlowSync — AI Traffic Signal Optimization for Urban Intersections</div>
      <div class="cat-desc">Reinforcement learning agent that dynamically adjusts signal timing based on real-time vehicle density, reducing average wait times by 31% in simulation.</div>
    </div>

    <div class="cat-card">
      <div class="cat-label">🔒 AI IN SAFETY &amp; SECURITY</div>
      <div class="cat-example">SafeWalk — AI-Powered Nighttime Pedestrian Safety Alert System</div>
      <div class="cat-desc">Uses computer vision on dashboard cameras to detect pedestrians in low-visibility conditions and alert drivers 2 seconds earlier than standard sensors.</div>
    </div>

    <a class="cta-btn" href="https://www.aijam-us.com/submit">
      Start Your Submission →
    </a>

    <p style="font-size:.85rem;color:#64748b;line-height:1.7;margin-top:.5rem">
      Questions? Reply to this email or contact us at
      <a href="mailto:team@aijam.org" style="color:#3b82f6">team@aijam.org</a>
    </p>
  </div>
  <div class="footer">
    <p><strong style="color:#94a3b8">AI-JAM US · PAIAX</strong></p>
    <p>855 Maude Avenue, Mountain View, CA</p>
    <p><a href="mailto:team@aijam.org">team@aijam.org</a> · <a href="https://www.aijam-us.com">www.aijam-us.com</a></p>
    <p style="margin-top:.8rem">©2016–2026 AI-JAM US. All Rights Reserved.</p>
  </div>
</div>
</body>
</html>`;

  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: '💡 Inspiring Project Examples by Category — AI-JAM US 2026 Day 3',
    html,
  });
  if (result.error) console.error('[email] sendSequenceDay3 — Resend error:', JSON.stringify(result.error));
  else console.log('[email] sendSequenceDay3 — sent OK, id:', result.data?.id);
  return result;
}

// ─── Sequence Day 5: Deadline reminder ───────────────────────────────────────
export async function sendSequenceDay5({
  to,
  firstName,
}: {
  to: string;
  firstName: string;
}) {
  console.log('[email] sendSequenceDay5 — to:', to);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Submission Deadline Reminder — AI-JAM US 2026</title>
  <style>
    body { margin:0; padding:0; background:#0a0a0f; font-family:'Helvetica Neue',Arial,sans-serif; color:#e2e8f0; }
    .wrap { max-width:600px; margin:0 auto; background:#111118; }
    .header { background:linear-gradient(135deg,#7c2d12,#dc2626); padding:2rem 2.5rem; text-align:center; }
    .header h1 { margin:0; font-size:2rem; letter-spacing:.06em; color:#fff; font-weight:900; }
    .header p { margin:.4rem 0 0; font-size:.85rem; color:rgba(255,255,255,.7); letter-spacing:.1em; }
    .body { padding:2.5rem; }
    .deadline-box { background:rgba(239,68,68,.07); border:1px solid rgba(239,68,68,.3); padding:1.5rem; text-align:center; margin:1.5rem 0; }
    .deadline-label { font-size:.72rem; letter-spacing:.12em; color:#475569; margin-bottom:.5rem; }
    .deadline-date { font-size:1.4rem; font-weight:900; color:#ef4444; }
    .deadline-sub { font-size:.82rem; color:#94a3b8; margin-top:.3rem; }
    .section-title { font-size:.7rem; letter-spacing:.15em; color:#475569; margin:1.5rem 0 .6rem; font-weight:700; }
    .info-box { background:#1a1a2e; border:1px solid rgba(255,255,255,.08); border-left:3px solid #ef4444; padding:1.2rem 1.5rem; margin:1.5rem 0; }
    .step-row { display:flex; gap:.8rem; align-items:flex-start; margin:.5rem 0; font-size:.88rem; color:#94a3b8; line-height:1.6; }
    .step-num { color:#ef4444; font-weight:700; flex-shrink:0; }
    .cta-btn { display:block; background:linear-gradient(135deg,#7c2d12,#dc2626); color:#fff; text-align:center; padding:1rem; text-decoration:none; font-weight:700; font-size:.95rem; letter-spacing:.06em; margin:1.8rem 0; }
    .footer { background:#0a0a0f; padding:1.5rem 2.5rem; text-align:center; border-top:1px solid rgba(255,255,255,.06); }
    .footer p { margin:.3rem 0; font-size:.75rem; color:#475569; }
    .footer a { color:#3b82f6; text-decoration:none; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>AI·JAM US 2026</h1>
    <p>11TH INTERNATIONAL AI INVENTION CHALLENGE</p>
  </div>
  <div class="body">
    <p style="font-size:1.05rem;font-weight:700;color:#f1f5f9;margin:0 0 .5rem">Hi ${firstName}! ⏰ Deadline reminder</p>
    <p style="font-size:.95rem;color:#94a3b8;line-height:1.8;margin:0 0 1.5rem">
      Don't let your hard work go to waste — the submission deadline is approaching. Make sure your project is in before it closes.
    </p>

    <div class="deadline-box">
      <div class="deadline-label">SUBMISSION DEADLINE</div>
      <div class="deadline-date">August 30, 2026</div>
      <div class="deadline-sub">11:59 PM Pacific Time · No extensions</div>
    </div>

    <div class="section-title">SUBMISSION CHECKLIST</div>
    <div class="info-box">
      <div class="step-row"><span class="step-num">□</span><span>Project title, abstract, and team members filled in</span></div>
      <div class="step-row"><span class="step-num">□</span><span>3-slide presentation link (Google Slides or Canva)</span></div>
      <div class="step-row"><span class="step-num">□</span><span>30-second video URL (YouTube or Google Drive)</span></div>
      <div class="step-row"><span class="step-num">□</span><span>Key features, social impact, and marketability sections completed</span></div>
      <div class="step-row"><span class="step-num">□</span><span>Shipping address for award delivery</span></div>
    </div>

    <a class="cta-btn" href="https://www.aijam-us.com/submit">
      ✅ Submit My Project Now
    </a>

    <p style="font-size:.82rem;color:#64748b;line-height:1.7;margin-top:.5rem">
      Already submitted? You can still re-submit to update your project before the deadline.<br />
      Questions? Reply to this email or contact <a href="mailto:team@aijam.org" style="color:#3b82f6">team@aijam.org</a>
    </p>
  </div>
  <div class="footer">
    <p><strong style="color:#94a3b8">AI-JAM US · PAIAX</strong></p>
    <p>855 Maude Avenue, Mountain View, CA</p>
    <p><a href="mailto:team@aijam.org">team@aijam.org</a> · <a href="https://www.aijam-us.com">www.aijam-us.com</a></p>
    <p style="margin-top:.8rem">©2016–2026 AI-JAM US. All Rights Reserved.</p>
  </div>
</div>
</body>
</html>`;

  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: '⏰ Deadline Reminder — Submit by August 30 · AI-JAM US 2026',
    html,
  });
  if (result.error) console.error('[email] sendSequenceDay5 — Resend error:', JSON.stringify(result.error));
  else console.log('[email] sendSequenceDay5 — sent OK, id:', result.data?.id);
  return result;
}

// ─── Sequence Day 7: Payment nudge (unpaid only) ──────────────────────────────
export async function sendSequenceDay7({
  to,
  firstName,
}: {
  to: string;
  firstName: string;
}) {
  console.log('[email] sendSequenceDay7 — to:', to);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Complete Your Registration — AI-JAM US 2026</title>
  <style>
    body { margin:0; padding:0; background:#0a0a0f; font-family:'Helvetica Neue',Arial,sans-serif; color:#e2e8f0; }
    .wrap { max-width:600px; margin:0 auto; background:#111118; }
    .header { background:linear-gradient(135deg,#78350f,#d97706); padding:2rem 2.5rem; text-align:center; }
    .header h1 { margin:0; font-size:2rem; letter-spacing:.06em; color:#fff; font-weight:900; }
    .header p { margin:.4rem 0 0; font-size:.85rem; color:rgba(255,255,255,.7); letter-spacing:.1em; }
    .body { padding:2.5rem; }
    .warning-badge { display:inline-block; background:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.3); color:#f59e0b; padding:.5rem 1.2rem; border-radius:2px; font-size:.8rem; letter-spacing:.12em; font-weight:700; margin-bottom:1.5rem; }
    .section-title { font-size:.7rem; letter-spacing:.15em; color:#475569; margin:1.5rem 0 .6rem; font-weight:700; }
    .info-box { background:#1a1a2e; border:1px solid rgba(255,255,255,.08); border-left:3px solid #f59e0b; padding:1.2rem 1.5rem; margin:1.5rem 0; }
    .step-row { display:flex; gap:.8rem; align-items:flex-start; margin:.5rem 0; font-size:.88rem; color:#94a3b8; line-height:1.6; }
    .step-num { color:#f59e0b; font-weight:700; flex-shrink:0; }
    .cta-btn { display:block; background:linear-gradient(135deg,#78350f,#d97706); color:#fff; text-align:center; padding:1rem; text-decoration:none; font-weight:700; font-size:.95rem; letter-spacing:.06em; margin:1.8rem 0; }
    .footer { background:#0a0a0f; padding:1.5rem 2.5rem; text-align:center; border-top:1px solid rgba(255,255,255,.06); }
    .footer p { margin:.3rem 0; font-size:.75rem; color:#475569; }
    .footer a { color:#3b82f6; text-decoration:none; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>AI·JAM US 2026</h1>
    <p>11TH INTERNATIONAL AI INVENTION CHALLENGE</p>
  </div>
  <div class="body">
    <div class="warning-badge">⚠ ACTION REQUIRED</div>
    <p style="font-size:1.05rem;font-weight:700;color:#f1f5f9;margin:0 0 .5rem">Hi ${firstName}, your registration is incomplete.</p>
    <p style="font-size:.95rem;color:#94a3b8;line-height:1.8;margin:0 0 1.5rem">
      You've registered for AI-JAM US 2026 but haven't completed your participation fee payment yet.
      Without payment, you won't be able to submit your project.
    </p>

    <div class="section-title">WHY COMPLETE PAYMENT?</div>
    <div class="info-box">
      <div class="step-row"><span class="step-num">✓</span><span>Unlock access to the project submission portal</span></div>
      <div class="step-row"><span class="step-num">✓</span><span>Compete for Gold, Silver, and Bronze awards + certificates</span></div>
      <div class="step-row"><span class="step-num">✓</span><span>Join innovators from 72+ countries on a global stage</span></div>
      <div class="step-row"><span class="step-num">✓</span><span>Submission deadline: <strong style="color:#ef4444">August 30, 2026</strong></span></div>
    </div>

    <a class="cta-btn" href="https://www.aijam-us.com/pay">
      💳 Complete Payment Now
    </a>

    <p style="font-size:.82rem;color:#64748b;line-height:1.7;margin-top:.5rem">
      If you've already paid, please disregard this email or reply and we'll verify your status.<br />
      Questions? Contact us at <a href="mailto:team@aijam.org" style="color:#3b82f6">team@aijam.org</a>
    </p>
  </div>
  <div class="footer">
    <p><strong style="color:#94a3b8">AI-JAM US · PAIAX</strong></p>
    <p>855 Maude Avenue, Mountain View, CA</p>
    <p><a href="mailto:team@aijam.org">team@aijam.org</a> · <a href="https://www.aijam-us.com">www.aijam-us.com</a></p>
    <p style="margin-top:.8rem">©2016–2026 AI-JAM US. All Rights Reserved.</p>
  </div>
</div>
</body>
</html>`;

  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: '⚠ Complete Your AI-JAM US 2026 Registration — Payment Pending',
    html,
  });
  if (result.error) console.error('[email] sendSequenceDay7 — Resend error:', JSON.stringify(result.error));
  else console.log('[email] sendSequenceDay7 — sent OK, id:', result.data?.id);
  return result;
}
