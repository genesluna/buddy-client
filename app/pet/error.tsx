'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { PawPrint } from '@phosphor-icons/react/dist/ssr';
import Button from '@/app/_components/ui/button';
import { reportError } from '@/app/_lib/error-reporting';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PetError({ error, reset }: ErrorProps) {
  useEffect(() => {
    reportError(error, { source: 'PetError', digest: error.digest });
  }, [error]);

  return (
    <main className='grid min-h-screen place-content-center bg-gradient-to-b from-primary to-content-500 px-4'>
      <section className='text-center' role='alert' aria-live='polite'>
        <h1 className='text-7xl font-black text-secondary'>
          Erro ao carregar pets
        </h1>

        <PawPrint size={64} className='mx-auto mt-8 text-secondary' weight='fill' />

        <p className='mt-4 text-content-300'>
          Não foi possível carregar as informações dos pets. Por favor, tente
          novamente.
        </p>

        {error.digest && (
          <p className='mt-2 text-xs text-content-200'>
            Código do erro: {error.digest}
          </p>
        )}

        <div className='mt-10 flex justify-center gap-4'>
          <Button onClick={reset} label='Tentar novamente' className='w-auto px-5' />

          <Link
            href='/'
            className='inline-flex h-[3.125rem] w-auto items-center justify-center rounded-[1.25rem] border border-accent bg-transparent px-5 text-center text-md text-accent duration-300 hover:border-none hover:bg-secondary hover:text-white'
          >
            Voltar para home
          </Link>
        </div>
      </section>
    </main>
  );
}
