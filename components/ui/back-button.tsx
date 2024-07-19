'use client';

import { ArrowCircleLeft } from '@phosphor-icons/react/dist/ssr';

export default function BackButton() {
  function previous() {
    window.history.back();
  }

  return (
    <ArrowCircleLeft
      size={40}
      className='absolute left-8 top-11 cursor-pointer text-white'
      onClick={previous}
    />
  );
}
