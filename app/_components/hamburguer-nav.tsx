'use client';

import { ComponentProps, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/_lib/utils';
import Link from 'next/link';

interface HamburgerNavProps extends ComponentProps<'div'> {
  menuLinks: { name: string; href: string }[];
}

export default function HamburgerNav({
  menuLinks,
  ...props
}: HamburgerNavProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const pathname = usePathname();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div {...props}>
      <button
        onClick={handleClick}
        id='hamburger'
        aria-label='Menu'
        aria-expanded={isOpen}
        className='inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-secondary hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
      >
        <svg
          className='block h-8 w-8'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M4 6h16M4 12h16M4 18h16'
          />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute right-0 top-0 z-20 flex w-screen flex-col justify-end space-y-3 rounded-2xl bg-accent pb-10 text-white shadow-lg duration-150 lg:hidden'>
          <button onClick={handleClick} className='relative ml-auto px-10 py-8'>
            <svg
              className='block h-8 w-8'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>

          {menuLinks.map(({ name, href }) => (
            <li
              key={name}
              className='flex w-full justify-center py-4 capitalize hover:bg-secondary'
            >
              <Link
                href={href}
                aria-label={`Menu item ${name}`}
                className={cn({
                  'border-b-2 border-solid border-white': pathname === href,
                })}
              >
                {name}
              </Link>
            </li>
          ))}
        </div>
      )}
    </div>
  );
}
