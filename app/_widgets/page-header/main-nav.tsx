'use client';

import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';
import { cn } from '@/app/_lib/utils';
import Link from 'next/link';

interface MainNavProps extends ComponentProps<'nav'> {
  navLinks: { name: string; href: string }[];
}

export function MainNav({ navLinks, ...props }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav {...props}>
      <ul className='flex items-center space-x-4 xl:space-x-6'>
        {navLinks.map(({ name, href }) => {
          const lowerName = name.toLowerCase();

          if (lowerName === 'login' || lowerName === 'entrar') {
            return (
              <li
                key={name}
                className='flex h-[2.5rem] cursor-pointer items-center justify-center rounded-[1.25rem] border border-white px-4 duration-300 ease-in-out hover:bg-white/10'
              >
                <Link
                  href={href}
                  className='text-base font-medium capitalize text-white'
                >
                  {name}
                </Link>
              </li>
            );
          }

          if (lowerName === 'cadastre-se' || lowerName === 'cadastrar') {
            return (
              <li
                key={name}
                className='flex h-[2.5rem] cursor-pointer items-center justify-center rounded-[1.25rem] bg-white px-4 duration-300 ease-in-out hover:bg-primary hover:drop-shadow-glow'
              >
                <Link
                  href={href}
                  className='text-base font-semibold capitalize text-accent'
                >
                  {name}
                </Link>
              </li>
            );
          }

          return (
            <li
              key={name}
              className='text-lg font-medium capitalize text-white duration-300 ease-in-out hover:drop-shadow-glow'
            >
              <Link
                href={href}
                className={cn({
                  'border-b-2 border-solid border-white': pathname === href,
                })}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
