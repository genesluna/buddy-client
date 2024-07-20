'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';

interface MainNavProps extends ComponentProps<'nav'> {
  navLinks: { name: string; href: string }[];
}

export function MainNav({ navLinks, ...props }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav {...props}>
      <ul className='flex items-center space-x-[3rem]'>
        {navLinks.map(({ name, href }) =>
          name.toLowerCase() === 'login' ? (
            <li
              key={name}
              className='flex h-[3.25rem] w-[5.625rem] cursor-pointer items-center justify-center rounded-[1.25rem] bg-white duration-300 ease-in-out hover:drop-shadow-glow'
            >
              <Link
                href={href}
                className='text-xl font-medium capitalize text-content-200'
              >
                {name}
              </Link>
            </li>
          ) : (
            <li
              key={name}
              className='text-xl font-medium capitalize text-white duration-300 ease-in-out hover:drop-shadow-glow'
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
          )
        )}
      </ul>
    </nav>
  );
}
