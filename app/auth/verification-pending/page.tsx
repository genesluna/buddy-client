import { Suspense } from 'react';
import { EnvelopeSimple } from '@phosphor-icons/react/dist/ssr';
import { HorizontalLayout } from '@/app/_widgets/layouts';
import VerificationPendingContent from './_components/verification-pending-content';

function LoadingFallback() {
  return (
    <div className='flex w-full max-w-[467px] flex-col items-center text-center'>
      <EnvelopeSimple size={64} className='mb-6 text-accent' weight='fill' />
      <h1 className='text-2xl font-bold text-accent sm:text-3xl'>
        Verifique seu email
      </h1>
      <p className='mt-2 text-content-300'>Carregando...</p>
    </div>
  );
}

export default function VerificationPendingPage() {
  return (
    <HorizontalLayout>
      <Suspense fallback={<LoadingFallback />}>
        <VerificationPendingContent />
      </Suspense>
    </HorizontalLayout>
  );
}
