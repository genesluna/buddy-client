'use client';

import { useEffect } from 'react';
import { SmileySad } from '@phosphor-icons/react';
import Button from '@/app/_components/ui/button';
import { reportError } from '@/app/_lib/error-reporting';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    reportError(error, { source: 'GlobalError', digest: error.digest });
  }, [error]);

  return (
    <main className='grid min-h-screen place-content-center bg-gradient-to-b from-primary to-content-500 px-4'>
      <section className='text-center' role='alert'>
        <h1 className='text-9xl font-black text-secondary'>Oops!</h1>

        <SmileySad size={64} className='mx-auto mt-8 text-secondary' weight='fill' />

        <p className='mt-4 text-content-300'>
          Algo deu errado. Por favor, tente novamente.
        </p>

        {error.digest && (
          <p className='mt-2 text-xs text-content-200'>
            Código do erro: {error.digest}
          </p>
        )}

        <div className='mt-10 flex justify-center gap-4'>
          <Button onClick={reset} label='Tentar novamente' className='w-auto px-5' />
          <Button href='/' label='Voltar para home' outline className='w-auto px-5' />
        </div>
      </section>
    </main>
  );
}
