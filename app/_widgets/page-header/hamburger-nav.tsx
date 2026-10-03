'use client';

import { ComponentProps, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/_lib/utils';
import Link from 'next/link';
import { useAuth, useLogout } from '@/app/_entities/auth';
import { SignOut, PlusCircle } from '@phosphor-icons/react';

interface HamburgerNavProps extends ComponentProps<'div'> {
  menuLinks: { name: string; href: string }[];
}

export default function HamburgerNav({
  menuLinks,
  ...props
}: HamburgerNavProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { mutate: handleLogout } = useLogout({ redirectTo: '/auth/login' });

  const activeProfile = user?.profiles?.[0];
  const displayName = activeProfile?.name || 'Minha Conta';
  const hasProfiles = user?.profiles && user.profiles.length > 0;

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

          {isAuthenticated && (
            <div className='mx-6 mb-2 rounded-xl bg-white/10 p-4 text-center'>
              <p className='text-xs text-white/70'>Conectado como</p>
              <p className='font-bold text-white'>{displayName}</p>
              {activeProfile?.profileType && (
                <span className='mt-1 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs text-white'>
                  {activeProfile.profileType === 'SHELTER' ? '🏠 Abrigo' : '🐾 Adotante'}
                </span>
              )}
            </div>
          )}

          {menuLinks
            .filter(({ name }) => name.toLowerCase() !== 'login')
            .map(({ name, href }) => (
              <li
                key={name}
                className='flex w-full justify-center py-4 capitalize hover:bg-secondary'
              >
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  aria-label={`Menu item ${name}`}
                  className={cn({
                    'border-b-2 border-solid border-white': pathname === href,
                  })}
                >
                  {name}
                </Link>
              </li>
            ))}

          {!isLoading && !isAuthenticated && (
            <li className='flex w-full justify-center py-4 capitalize hover:bg-secondary'>
              <Link
                href='/auth/login'
                onClick={() => setIsOpen(false)}
                aria-label='Menu item login'
                className={cn({
                  'border-b-2 border-solid border-white': pathname === '/auth/login',
                })}
              >
                login
              </Link>
            </li>
          )}

          {!isLoading && isAuthenticated && (
            <>
              {!hasProfiles && (
                <li className='flex w-full justify-center py-4 hover:bg-secondary'>
                  <Link
                    href='/profile/create'
                    onClick={() => setIsOpen(false)}
                    className='flex items-center gap-2 text-white font-medium'
                  >
                    <PlusCircle size={20} />
                    Criar meu perfil
                  </Link>
                </li>
              )}
              <li className='flex w-full justify-center py-4 hover:bg-secondary'>
                <button
                  type='button'
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className='flex items-center gap-2 text-white/90 hover:text-white font-medium'
                >
                  <SignOut size={20} />
                  Sair da conta
                </button>
              </li>
            </>
          )}
        </div>
      )}
    </div>
  );
}
