import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM_EMAIL ?? 'team@aijam.org';

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
