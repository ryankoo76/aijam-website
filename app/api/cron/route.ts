import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  sendSequenceDay1,
  sendSequenceDay2,
  sendSequenceDay3,
  sendSequenceDay5,
  sendSequenceDay7,
} from '@/lib/email';

export async function GET(req: NextRequest) {
  console.log('[cron] GET called —', new Date().toISOString());

  // ── 1. Auth via CRON_SECRET ───────────────────────────────────────────────
  const secret = process.env.CRON_SECRET ?? '';
  const authHeader = req.headers.get('authorization') ?? '';

  if (!secret) {
    console.warn('[cron] CRON_SECRET is not set — rejecting request');
    return NextResponse.json({ error: 'Server misconfigured: CRON_SECRET not set' }, { status: 500 });
  }

  if (authHeader !== `Bearer ${secret}`) {
    console.warn('[cron] Unauthorized — invalid or missing Authorization header');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('[cron] Auth passed');

  // ── 2. Fetch all registrations with email_sequence_day ────────────────────
  console.log('[cron] Fetching registrations...');
  const { data: registrations, error: fetchError } = await supabaseAdmin
    .from('aijam_registrations')
    .select('id, email, first_name, email_sequence_day, submission_status');

  if (fetchError) {
    const e = fetchError as unknown as Record<string, unknown>;
    console.error('[cron] Failed to fetch registrations:', {
      message: e.message,
      code: e.code,
      raw: JSON.stringify(fetchError),
    });
    return NextResponse.json(
      { error: `Database error: ${e.message ?? JSON.stringify(fetchError)}` },
      { status: 500 }
    );
  }

  if (!registrations || registrations.length === 0) {
    console.log('[cron] No registrations found — nothing to do');
    return NextResponse.json({ success: true, processed: 0 });
  }

  console.log(`[cron] Found ${registrations.length} registrations to process`);

  // ── 3. Process each registration ──────────────────────────────────────────
  const results = {
    total: registrations.length,
    sent: 0,
    skipped: 0,
    errors: 0,
  };

  for (const reg of registrations) {
    const day: number = reg.email_sequence_day ?? 0;
    const email: string = reg.email;
    const firstName: string = reg.first_name ?? 'Participant';
    const status: string = reg.submission_status ?? 'registered';

    console.log(`[cron] Processing ${email} — day=${day}, status=${status}`);

    try {
      let sent = false;

      if (day === 1) {
        await sendSequenceDay1({ to: email, firstName });
        sent = true;
        console.log(`[cron] Day 1 email sent to ${email}`);
      } else if (day === 2) {
        await sendSequenceDay2({ to: email, firstName });
        sent = true;
        console.log(`[cron] Day 2 email sent to ${email}`);
      } else if (day === 3) {
        await sendSequenceDay3({ to: email, firstName });
        sent = true;
        console.log(`[cron] Day 3 email sent to ${email}`);
      } else if (day === 5) {
        await sendSequenceDay5({ to: email, firstName });
        sent = true;
        console.log(`[cron] Day 5 email sent to ${email}`);
      } else if (day === 7) {
        // Day 7: only send payment nudge to unpaid registrants
        if (status === 'registered') {
          await sendSequenceDay7({ to: email, firstName });
          sent = true;
          console.log(`[cron] Day 7 payment nudge sent to ${email}`);
        } else {
          console.log(`[cron] Day 7 skipped for ${email} — status is '${status}' (not 'registered')`);
          results.skipped++;
        }
      } else {
        // Days 4, 6, 0, 8+ — no email scheduled, just increment
        console.log(`[cron] No email scheduled for day ${day} — incrementing for ${email}`);
      }

      if (sent) results.sent++;

      // ── 4. Increment email_sequence_day ──────────────────────────────────
      const { error: updateError } = await supabaseAdmin
        .from('aijam_registrations')
        .update({ email_sequence_day: day + 1 })
        .eq('id', reg.id);

      if (updateError) {
        const e = updateError as unknown as Record<string, unknown>;
        console.error(`[cron] Failed to increment day for ${email}:`, {
          message: e.message,
          code: e.code,
          raw: JSON.stringify(updateError),
        });
        results.errors++;
      } else {
        console.log(`[cron] email_sequence_day updated to ${day + 1} for ${email}`);
      }
    } catch (err) {
      console.error(`[cron] Unexpected error processing ${email}:`, err);
      results.errors++;
    }
  }

  console.log('[cron] Done —', results);
  return NextResponse.json({ success: true, ...results });
}
