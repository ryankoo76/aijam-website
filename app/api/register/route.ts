import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendRegistrationConfirmed, sendAdminNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, country, school, participantType, isTeacher } = body;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!firstName || !email || !country || !participantType || !school) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // ── Supabase insert ───────────────────────────────────────────────────────
    const { data, error: dbError } = await supabaseAdmin
      .from('registrations')
      .insert({
        first_name: firstName.trim(),
        last_name: (lastName ?? '').trim(),
        email: email.trim().toLowerCase(),
        country,
        school: school.trim(),
        participant_type: participantType,
        is_teacher: isTeacher ?? false,
        email_sequence_day: 0,
        submission_status: 'registered',
      })
      .select('id, created_at')
      .single();

    if (dbError) {
      console.error('[register] Supabase error:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const createdAt = new Date(data.created_at).toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // ── Emails (non-blocking — fire and forget, log errors) ───────────────────
    Promise.all([
      sendRegistrationConfirmed({
        to: email.trim().toLowerCase(),
        firstName: firstName.trim(),
        country,
        school: school.trim(),
      }),
      sendAdminNotification({
        firstName: firstName.trim(),
        lastName: (lastName ?? '').trim(),
        email: email.trim().toLowerCase(),
        country,
        school: school.trim(),
        participantType,
        isTeacher: isTeacher ?? false,
        createdAt,
      }),
    ]).catch((err) => console.error('[register] Email error:', err));

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error('[register] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
