import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendSubmissionConfirmation } from '@/lib/email';

export async function POST(req: NextRequest) {
  console.log('[submit] POST called');

  // ── 1. Env diagnostics ────────────────────────────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  console.log('[submit] env check —', {
    supabaseUrlPresent:  !!supabaseUrl,
    supabaseUrlPrefix:   supabaseUrl  ? supabaseUrl.slice(0, 30)  + '...' : 'MISSING',
    supabaseKeyPresent:  !!supabaseKey,
    supabaseKeyPrefix:   supabaseKey  ? supabaseKey.slice(0, 10)  + '...' : 'MISSING',
  });

  // ── 2. Parse JSON body ────────────────────────────────────────────────────
  let body: Record<string, string>;
  try {
    body = await req.json();
    console.log('[submit] body parsed OK — keys:', Object.keys(body).join(', '));
  } catch (err) {
    console.error('[submit] Failed to parse JSON body:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // ── 3. Extract fields ─────────────────────────────────────────────────────
  const email            = (body.email            ?? '').trim().toLowerCase();
  const category         =  body.category         ?? '';
  const projectTitle     =  body.projectTitle     ?? '';
  const teamMembers      =  body.teamMembers      ?? '';
  const abstract         =  body.abstract         ?? '';
  const keyFeatures      =  body.keyFeatures      ?? '';
  const socialImpact     =  body.socialImpact     ?? '';
  const marketability    =  body.marketability    ?? '';
  const videoUrl         =  body.videoUrl         ?? '';
  const slidesLink       =  body.slidesLink       ?? '';
  const inspiration      =  body.inspiration      ?? '';
  const biggestChallenge =  body.biggestChallenge ?? '';
  const aiRole           =  body.aiRole           ?? '';
  const futurePlans      =  body.futurePlans      ?? '';
  const recipientName    =  body.recipientName    ?? '';
  const address          =  body.address          ?? '';
  const city             =  body.city             ?? '';
  const country          =  body.country          ?? '';
  const postalCode       =  body.postalCode       ?? '';

  console.log('[submit] fields —', {
    email:        email        || '(empty)',
    category:     category     || '(empty)',
    projectTitle: (projectTitle || '(empty)').slice(0, 50),
    abstractLen:  abstract.length,
    videoUrl:     videoUrl     || '(empty)',
    slidesLink:   slidesLink   || '(none)',
  });

  // ── 4. Validate required fields ───────────────────────────────────────────
  if (!email) {
    console.warn('[submit] Validation failed: missing email');
    return NextResponse.json({ error: 'Missing email.' }, { status: 400 });
  }
  if (!category) {
    console.warn('[submit] Validation failed: missing category');
    return NextResponse.json({ error: 'Category is required.' }, { status: 400 });
  }
  if (!projectTitle) {
    console.warn('[submit] Validation failed: missing project title');
    return NextResponse.json({ error: 'Project title is required.' }, { status: 400 });
  }
  if (!abstract) {
    console.warn('[submit] Validation failed: missing abstract');
    return NextResponse.json({ error: 'Abstract is required.' }, { status: 400 });
  }
  if (!videoUrl) {
    console.warn('[submit] Validation failed: missing video URL');
    return NextResponse.json({ error: 'Video URL is required.' }, { status: 400 });
  }

  // ── 5. Verify payment status ──────────────────────────────────────────────
  console.log('[submit] Looking up registration for:', email);
  const { data: reg, error: regLookupErr } = await supabaseAdmin
    .from('aijam_registrations')
    .select('submission_status, first_name')
    .eq('email', email)
    .maybeSingle();

  if (regLookupErr) {
    const e = regLookupErr as unknown as Record<string, unknown>;
    console.error('[submit] Registration lookup error:', {
      message: e.message,
      code:    e.code,
      details: e.details,
      raw:     JSON.stringify(regLookupErr),
    });
    return NextResponse.json(
      { error: `Database error during registration lookup: ${e.message ?? JSON.stringify(regLookupErr)}` },
      { status: 500 }
    );
  }

  if (!reg) {
    console.warn('[submit] Email not found in aijam_registrations:', email);
    return NextResponse.json(
      { error: 'Email not found in registrations. Please register at aijam-us.com first.' },
      { status: 404 }
    );
  }

  console.log('[submit] Registration found —', {
    email,
    submission_status: reg.submission_status,
    first_name: reg.first_name,
  });

  if (reg.submission_status !== 'paid' && reg.submission_status !== 'submitted') {
    console.warn('[submit] Payment not completed — status:', reg.submission_status);
    return NextResponse.json(
      { error: `Payment required before submitting. Current status: ${reg.submission_status}` },
      { status: 403 }
    );
  }

  // ── 6. Insert into aijam_submissions ──────────────────────────────────────
  console.log('[submit] Inserting into aijam_submissions for:', email);

  const { data: submission, error: subError } = await supabaseAdmin
    .from('aijam_submissions')
    .insert({
      email,
      category,
      project_title:      projectTitle,
      team_members:       teamMembers,
      abstract,
      key_features:       keyFeatures,
      social_impact:      socialImpact,
      marketability,
      video_url:          videoUrl,
      slides_url:         slidesLink,
      inspiration,
      biggest_challenge:  biggestChallenge,
      ai_role:            aiRole,
      future_plans:       futurePlans,
      shipping_name:      recipientName,
      shipping_address:   address,
      shipping_city:      city,
      shipping_country:   country,
      shipping_postal:    postalCode,
    })
    .select('id')
    .single();

  if (subError) {
    const e = subError as unknown as Record<string, unknown>;
    console.error('[submit] aijam_submissions insert error:', {
      message: e.message,
      code:    e.code,
      details: e.details,
      hint:    e.hint,
      raw:     JSON.stringify(subError),
    });
    return NextResponse.json(
      { error: `Failed to save submission: ${e.message ?? JSON.stringify(subError)}` },
      { status: 500 }
    );
  }

  console.log('[submit] Submission saved — id:', submission.id);

  // ── 7. Update registration status → 'submitted' ───────────────────────────
  const { error: statusError } = await supabaseAdmin
    .from('aijam_registrations')
    .update({ submission_status: 'submitted' })
    .eq('email', email);

  if (statusError) {
    const e = statusError as unknown as Record<string, unknown>;
    console.error('[submit] Registration status update error:', {
      message: e.message,
      code:    e.code,
      raw:     JSON.stringify(statusError),
    });
    // Non-fatal — submission was saved, just log the error
  } else {
    console.log('[submit] Registration status → submitted for:', email);
  }

  // ── 8. Send confirmation email (non-blocking) ─────────────────────────────
  sendSubmissionConfirmation({
    to: email,
    firstName: reg.first_name ?? 'Participant',
    projectTitle,
  }).catch((err) => console.error('[submit] Confirmation email error:', err));

  console.log('[submit] Done — returning success for:', email);
  return NextResponse.json({ success: true, id: submission.id });
}
