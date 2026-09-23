'use client';

import { useSearchParams } from 'next/navigation';
import ResetPasswordForm from './reset-password-form';

export default function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  return <ResetPasswordForm initialToken={token} />;
}
