import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendSubmissionConfirmation } from '@/lib/email';

export async function POST(req: NextRequest) {
  console.log('[submit] POST called');

  // ── 1. Env diagnostics ────────────────────────────────────────────────────
  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
  const supabaseKey  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  const resendKey    = process.env.RESEND_API_KEY            ?? '';
  const fromEmail    = process.env.FROM_EMAIL                ?? '';
  console.log('[submit] env check —', {
    supabaseUrlPresent: !!supabaseUrl,
    supabaseUrlPrefix:  supabaseUrl ? supabaseUrl.slice(0, 30) + '...' : 'MISSING',
    supabaseKeyPresent: !!supabaseKey,
    supabaseKeyPrefix:  supabaseKey ? supabaseKey.slice(0, 10) + '...' : 'MISSING',
    resendKeyPresent:   !!resendKey,
    resendKeyPrefix:    resendKey   ? resendKey.slice(0, 10)   + '...' : 'MISSING',
    fromEmailPresent:   !!fromEmail,
    fromEmail:          fromEmail   || '(not set — will fall back to team@aijam.org)',
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
  const streetAddress    =  body.streetAddress    ?? '';
  const apt              =  body.apt              ?? '';
  const city             =  body.city             ?? '';
  const shippingState    =  body.shippingState    ?? '';
  const postalCode       =  body.postalCode       ?? '';
  const country          =  body.country          ?? '';

  console.log('[submit] fields —', {
    email:        email        || '(empty)',
    category:     category     || '(empty)',
    projectTitle: (projectTitle || '(empty)').slice(0, 50),
    abstractLen:  abstract.length,
    videoUrl:     videoUrl     || '(empty)',
    slidesLink:   slidesLink   || '(none)',
    shippingCity: city         || '(empty)',
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
  if (!teamMembers) {
    console.warn('[submit] Validation failed: missing team members');
    return NextResponse.json({ error: 'Team members is required.' }, { status: 400 });
  }
  if (!abstract) {
    console.warn('[submit] Validation failed: missing abstract');
    return NextResponse.json({ error: 'Abstract is required.' }, { status: 400 });
  }
  if (!keyFeatures) {
    console.warn('[submit] Validation failed: missing key features');
    return NextResponse.json({ error: 'Key features is required.' }, { status: 400 });
  }
  if (!socialImpact) {
    console.warn('[submit] Validation failed: missing social impact');
    return NextResponse.json({ error: 'Social impact is required.' }, { status: 400 });
  }
  if (!marketability) {
    console.warn('[submit] Validation failed: missing marketability');
    return NextResponse.json({ error: 'Marketability is required.' }, { status: 400 });
  }
  if (!videoUrl) {
    console.warn('[submit] Validation failed: missing video URL');
    return NextResponse.json({ error: 'Video URL is required.' }, { status: 400 });
  }
  if (!recipientName) {
    console.warn('[submit] Validation failed: missing recipient name');
    return NextResponse.json({ error: 'Recipient name is required.' }, { status: 400 });
  }
  if (!streetAddress) {
    console.warn('[submit] Validation failed: missing street address');
    return NextResponse.json({ error: 'Street address is required.' }, { status: 400 });
  }
  if (!city) {
    console.warn('[submit] Validation failed: missing city');
    return NextResponse.json({ error: 'City is required.' }, { status: 400 });
  }
  if (!shippingState) {
    console.warn('[submit] Validation failed: missing state/province');
    return NextResponse.json({ error: 'State / Province is required.' }, { status: 400 });
  }
  if (!postalCode) {
    console.warn('[submit] Validation failed: missing postal code');
    return NextResponse.json({ error: 'Postal code is required.' }, { status: 400 });
  }
  if (!country) {
    console.warn('[submit] Validation failed: missing country');
    return NextResponse.json({ error: 'Country is required.' }, { status: 400 });
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
    first_name:        reg.first_name,
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
      project_title:     projectTitle,
      team_members:      teamMembers,
      abstract,
      key_features:      keyFeatures,
      social_impact:     socialImpact,
      marketability,
      video_url:         videoUrl,
      slides_link:       slidesLink,
      inspiration,
      biggest_challenge: biggestChallenge,
      ai_role:           aiRole,
      future_plans:      futurePlans,
      shipping_name:     recipientName,
      shipping_address:  streetAddress,
      shipping_apt:      apt,
      shipping_city:     city,
      shipping_state:    shippingState,
      shipping_postal:   postalCode,
      shipping_country:  country,
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
  void (async () => {
    try {
      console.log('[submit] Sending confirmation email to:', email);
      const result = await sendSubmissionConfirmation({
        to:           email,
        firstName:    reg.first_name ?? 'Participant',
        projectTitle,
      });
      if (result.error) {
        console.error('[submit] Confirmation email — Resend API error:', JSON.stringify(result.error));
      } else {
        console.log('[submit] Confirmation email sent — Resend id:', result.data?.id);
      }
    } catch (err) {
      console.error('[submit] Confirmation email threw exception:', err);
    }
  })();

  console.log('[submit] Done — returning success for:', email);
  return NextResponse.json({ success: true, id: submission.id });
}
