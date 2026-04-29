import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import SubmitForm from '@/components/SubmitForm';

// Re-submit page: same as submit but bypasses the "already submitted" gate.
// Still enforces that the email must be paid/submitted (not just registered).

export default async function ResubmitPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = (searchParams.email ?? '').trim().toLowerCase();

  if (!email) redirect('/submit');

  const { data: reg } = await supabaseAdmin
    .from('aijam_registrations')
    .select('submission_status')
    .eq('email', email)
    .maybeSingle();

  if (!reg || (reg.submission_status !== 'paid' && reg.submission_status !== 'submitted')) {
    redirect(`/pay?email=${encodeURIComponent(email)}`);
  }

  return <SubmitForm email={email} />;
}
