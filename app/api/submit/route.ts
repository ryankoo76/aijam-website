import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendSubmissionConfirmation } from '@/lib/email';

export async function POST(req: NextRequest) {
  console.log('[submit] POST called');

  let form: FormData;
  try {
    form = await req.formData();
  } catch (err) {
    console.error('[submit] Failed to parse form data:', err);
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  // ── Extract fields ────────────────────────────────────────────────────────
  const email         = ((form.get('email')          as string) ?? '').trim().toLowerCase();
  const category      =  (form.get('category')       as string) ?? '';
  const projectTitle  =  (form.get('projectTitle')   as string) ?? '';
  const teamMembers   =  (form.get('teamMembers')    as string) ?? '';
  const abstract      =  (form.get('abstract')       as string) ?? '';
  const keyFeatures   =  (form.get('keyFeatures')    as string) ?? '';
  const socialImpact  =  (form.get('socialImpact')   as string) ?? '';
  const marketability =  (form.get('marketability')  as string) ?? '';
  const videoUrl      =  (form.get('videoUrl')       as string) ?? '';
  const slidesFile    =  form.get('slidesFile') as File | null;
  const inspiration      = (form.get('inspiration')      as string) ?? '';
  const biggestChallenge = (form.get('biggestChallenge') as string) ?? '';
  const aiRole           = (form.get('aiRole')           as string) ?? '';
  const futurePlans      = (form.get('futurePlans')      as string) ?? '';
  const recipientName    = (form.get('recipientName')    as string) ?? '';
  const address          = (form.get('address')          as string) ?? '';
  const city             = (form.get('city')             as string) ?? '';
  const country          = (form.get('country')          as string) ?? '';
  const postalCode       = (form.get('postalCode')       as string) ?? '';

  console.log('[submit] fields received —', {
    email: email || '(empty)',
    category,
    projectTitle: projectTitle.slice(0, 40),
    abstractLen: abstract.length,
    hasSlidesFile: !!slidesFile && slidesFile.size > 0,
    slidesFileSize: slidesFile?.size ?? 0,
  });

  // ── Validate required fields ──────────────────────────────────────────────
  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }
  if (!category || !projectTitle || !abstract) {
    return NextResponse.json(
      { error: 'Category, project title, and abstract are required.' },
      { status: 400 }
    );
  }

  // ── Verify payment status ─────────────────────────────────────────────────
  const { data: reg, error: regLookupErr } = await supabaseAdmin
    .from('aijam_registrations')
    .select('submission_status, first_name')
    .eq('email', email)
    .maybeSingle();

  if (regLookupErr) {
    console.error('[submit] Registration lookup error:', regLookupErr);
  }

  if (!reg) {
    console.warn('[submit] Email not found in aijam_registrations:', email);
    return NextResponse.json(
      { error: 'Email not found in registrations. Please register first.' },
      { status: 404 }
    );
  }

  if (reg.submission_status !== 'paid' && reg.submission_status !== 'submitted') {
    console.warn('[submit] Payment not completed for:', email, '— status:', reg.submission_status);
    return NextResponse.json(
      { error: 'Payment required before submitting a project.' },
      { status: 403 }
    );
  }

  // ── Upload slides PDF to Supabase Storage ─────────────────────────────────
  let slidesUrl = '';
  if (slidesFile && slidesFile.size > 0) {
    if (slidesFile.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Slides must be a PDF file.' }, { status: 400 });
    }
    if (slidesFile.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'Slides file must be under 20 MB.' }, { status: 400 });
    }

    const bytes = await slidesFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeEmail = email.replace(/[@.]/g, '_');
    const fileName = `${safeEmail}_${Date.now()}.pdf`;

    console.log('[submit] Uploading slides —', fileName, 'bytes:', buffer.length);

    const { data: storageData, error: storageError } = await supabaseAdmin
      .storage
      .from('submissions')
      .upload(fileName, buffer, { contentType: 'application/pdf', upsert: true });

    if (storageError) {
      console.error('[submit] Storage upload error:', {
        message: (storageError as unknown as Record<string, unknown>).message,
        error:   JSON.stringify(storageError),
      });
      return NextResponse.json({ error: 'Failed to upload slides file.' }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('submissions')
      .getPublicUrl(storageData.path);

    slidesUrl = publicUrl;
    console.log('[submit] Slides uploaded — url:', slidesUrl.slice(0, 60) + '...');
  }

  // ── Insert into aijam_submissions ─────────────────────────────────────────
  console.log('[submit] Inserting submission for:', email);

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
      slides_url:         slidesUrl,
      inspiration,
      biggest_challenge:  biggestChallenge,
      ai_role:            aiRole,
      future_plans:       futurePlans,
      recipient_name:     recipientName,
      address,
      city,
      country,
      postal_code:        postalCode,
    })
    .select('id')
    .single();

  if (subError) {
    const se = subError as unknown as Record<string, unknown>;
    console.error('[submit] aijam_submissions insert error:', {
      message: se.message,
      code:    se.code,
      details: se.details,
      raw:     JSON.stringify(subError),
    });
    return NextResponse.json({ error: 'Failed to save submission.' }, { status: 500 });
  }

  console.log('[submit] Submission saved — id:', submission.id);

  // ── Update registration status → 'submitted' ──────────────────────────────
  const { error: statusError } = await supabaseAdmin
    .from('aijam_registrations')
    .update({ submission_status: 'submitted' })
    .eq('email', email);

  if (statusError) {
    console.error('[submit] Registration status update error:', statusError);
  } else {
    console.log('[submit] Registration status updated → submitted for:', email);
  }

  // ── Send confirmation email (non-blocking) ────────────────────────────────
  sendSubmissionConfirmation({
    to: email,
    firstName: reg.first_name ?? 'Participant',
    projectTitle,
  }).catch((err) => console.error('[submit] Confirmation email error:', err));

  return NextResponse.json({ success: true, id: submission.id });
}
