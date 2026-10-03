import { Suspense } from 'react';
import { HorizontalLayout } from '@/app/_widgets/layouts';
import ResetPasswordContent from './_components/reset-password-content';
import LoadingSpinner from '@/app/_components/loading-spinner';

export default function ResetPasswordPage() {
  return (
    <HorizontalLayout>
      <h1 className='text-3xl font-bold text-accent sm:text-4xl'>Redefinir Senha</h1>
      <p className='mt-2 text-content-300 sm:text-lg'>
        Crie uma nova senha segura para sua conta
      </p>
      <Suspense fallback={<div className='flex h-32 items-center justify-center'><LoadingSpinner /></div>}>
        <ResetPasswordContent />
      </Suspense>
    </HorizontalLayout>
  );
}
