'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { LockKey } from '@phosphor-icons/react/dist/ssr';
import Button from '@/app/_components/ui/button';
import { reportError } from '@/app/_lib/error-reporting';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: ErrorProps) {
  useEffect(() => {
    reportError(error, { source: 'AuthError', digest: error.digest });
  }, [error]);

  return (
    <main className='grid min-h-screen place-content-center bg-gradient-to-b from-primary to-content-500 px-4'>
      <section className='text-center' role='alert' aria-live='polite'>
        <h1 className='text-7xl font-black text-secondary'>
          Erro de autenticação
        </h1>

        <LockKey size={64} className='mx-auto mt-8 text-secondary' weight='fill' />

        <p className='mt-4 text-content-300'>
          Ocorreu um erro durante o processo de autenticação. Por favor, tente
          novamente.
        </p>

        {error.digest && (
          <p className='mt-2 text-xs text-content-200'>
            Código do erro: {error.digest}
          </p>
        )}

        <div className='mt-10 flex justify-center gap-4'>
          <Button onClick={reset} label='Tentar novamente' className='w-auto px-5' />

          <Link href='/'>
            <Button outline label='Voltar para home' className='w-auto px-5' />
          </Link>
        </div>
      </section>
    </main>
  );
}
