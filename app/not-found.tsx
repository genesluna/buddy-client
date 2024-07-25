import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <main className='grid min-h-screen place-content-center bg-gradient-to-b from-primary to-content-500 px-4'>
      <section className='text-center'>
        <h1 className='text-9xl font-black text-secondary'>404</h1>

        <p className='mt-8 text-6xl'>😿</p>

        <p className='mt-4 text-gray-500'>
          Não conseguimos encontrar o que está procurando.
        </p>

        <Link
          href='/'
          className='mt-10 inline-block rounded-[1.25rem] bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-secondary focus:outline-none focus:ring'
        >
          Voltar para home page
        </Link>
      </section>
    </main>
  );
}
