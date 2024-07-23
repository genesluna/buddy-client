'use client';

import { ArrowCircleLeft } from '@phosphor-icons/react/dist/ssr';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <ArrowCircleLeft
      size={40}
      className='absolute left-8 top-11 cursor-pointer text-white'
      onClick={() => router.back()}
    />
  );
}
