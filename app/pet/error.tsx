'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { PawPrint } from '@phosphor-icons/react';
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
    <main className='from-primary to-content-500 grid min-h-screen place-content-center bg-gradient-to-b px-4'>
      <section className='text-center' role='alert'>
        <h1 className='text-secondary text-7xl font-black'>
          Erro ao carregar pets
        </h1>

        <PawPrint
          size={64}
          className='text-secondary mx-auto mt-8'
          weight='fill'
        />

        <p className='text-content-300 mt-4'>
          Não foi possível carregar as informações dos pets. Por favor, tente
          novamente.
        </p>

        {error.digest && (
          <p className='text-content-200 mt-2 text-xs'>
            Código do erro: {error.digest}
          </p>
        )}

        <div className='mt-10 flex justify-center gap-4'>
          <Button
            onClick={reset}
            label='Tentar novamente'
            className='w-auto px-5'
          />

          <Link
            href='/'
            className='border-accent text-md text-accent hover:bg-secondary inline-flex h-[3.125rem] w-auto items-center justify-center rounded-[1.25rem] border bg-transparent px-5 text-center duration-300 hover:border-none hover:text-white'
          >
            Voltar para home
          </Link>
        </div>
      </section>
    </main>
  );
}
