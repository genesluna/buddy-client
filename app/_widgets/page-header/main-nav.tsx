'use client';

import { usePathname } from 'next/navigation';
import { ComponentProps, useState, useRef, useEffect } from 'react';
import { cn } from '@/app/_lib/utils';
import Link from 'next/link';
import { useAuth, useLogout } from '@/app/_entities/auth';
import { User, SignOut, CaretDown, PlusCircle } from '@phosphor-icons/react';

interface MainNavProps extends ComponentProps<'nav'> {
  navLinks: { name: string; href: string }[];
}

export function MainNav({ navLinks, ...props }: MainNavProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { mutate: handleLogout } = useLogout({ redirectTo: '/auth/login' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeProfile = user?.profiles?.[0];
  const displayName = activeProfile?.name || 'Minha Conta';
  const hasProfiles = user?.profiles && user.profiles.length > 0;

  return (
    <nav {...props}>
      <ul className='flex items-center space-x-[2.5rem] xl:space-x-[3rem]'>
        {navLinks
          .filter(({ name }) => name.toLowerCase() !== 'login')
          .map(({ name, href }) => (
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
          ))}

        {!isLoading && !isAuthenticated && (
          <li className='flex h-[3.25rem] w-[5.625rem] cursor-pointer items-center justify-center rounded-[1.25rem] bg-white duration-300 ease-in-out hover:drop-shadow-glow'>
            <Link
              href='/auth/login'
              className='text-xl font-medium capitalize text-content-200'
            >
              login
            </Link>
          </li>
        )}

        {!isLoading && isAuthenticated && (
          <li className='relative' ref={dropdownRef}>
            <button
              type='button'
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              aria-label='Menu do usuário'
              className='flex h-[3.25rem] max-w-[200px] cursor-pointer items-center gap-2 rounded-[1.25rem] bg-white px-4 text-content-200 duration-300 ease-in-out hover:drop-shadow-glow focus:outline-none'
            >
              <User size={22} weight='bold' className='text-accent shrink-0' />
              <span className='truncate text-base font-semibold text-content-200'>
                {displayName}
              </span>
              <CaretDown
                size={16}
                weight='bold'
                className={cn('text-content-200 transition-transform duration-200 shrink-0', {
                  'rotate-180': dropdownOpen,
                })}
              />
            </button>

            {dropdownOpen && (
              <div className='absolute right-0 top-[3.75rem] z-50 flex w-56 flex-col overflow-hidden rounded-2xl bg-white p-2 text-content-200 shadow-xl ring-1 ring-black/5'>
                <div className='border-b border-gray-100 px-3 py-2'>
                  <p className='text-xs font-medium text-content-300'>Conectado como</p>
                  <p className='truncate text-sm font-bold text-accent'>
                    {displayName}
                  </p>
                  {activeProfile?.profileType && (
                    <span className='mt-1 inline-block rounded-full bg-tertiary/40 px-2 py-0.5 text-xs font-semibold text-accent'>
                      {activeProfile.profileType === 'SHELTER'
                        ? '🏠 Abrigo'
                        : '🐾 Adotante'}
                    </span>
                  )}
                </div>

                {!hasProfiles && (
                  <Link
                    href='/profile/create'
                    onClick={() => setDropdownOpen(false)}
                    className='mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-accent hover:bg-primary/60 transition-colors'
                  >
                    <PlusCircle size={18} weight='bold' />
                    Criar meu perfil
                  </Link>
                )}

                <button
                  type='button'
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className='mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-error hover:bg-red-50 transition-colors'
                >
                  <SignOut size={18} weight='bold' />
                  Sair
                </button>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}
