import { Suspense } from 'react';
import { HorizontalLayout } from '@/app/_widgets/layouts';
import VerifyEmailContent from './_components/verify-email-content';

function LoadingFallback() {
  return (
    <div className='flex w-full max-w-[467px] flex-col items-center text-center'>
      <div
        className='mb-6 h-16 w-16 animate-spin rounded-full border-4 border-solid border-accent border-e-transparent'
        role='status'
      >
        <span className='sr-only'>Carregando...</span>
      </div>
      <h1 className='text-2xl font-bold text-accent sm:text-3xl'>
        Carregando...
      </h1>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <HorizontalLayout>
      <Suspense fallback={<LoadingFallback />}>
        <VerifyEmailContent />
      </Suspense>
    </HorizontalLayout>
  );
}
