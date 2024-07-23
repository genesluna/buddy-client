import RoundLogo from '@/app/_assets/logo_round.svg';
import HamburgerNav from './hamburguer-nav';
import { MainNav } from './main-nav';
import Image from 'next/image';
import Link from 'next/link';

export function PageHeader() {
  const links = [
    { name: 'home', href: '/' },
    { name: 'sobre', href: '/about' },
    { name: 'contato', href: '/contact' },
    { name: 'login', href: '/auth/login' },
  ];

  return (
    <header className='h-60 w-full rounded-b-4xl bg-accent'>
      <div className='mx-auto grid w-[90%] max-w-[83.3125rem] grid-cols-8 items-center gap-4 pb-7 pt-1 sm:w-[80%]'>
        <Link
          href='/'
          className='col-span-5 col-start-1 flex-grow justify-start 2xl:col-span-2 2xl:col-start-4'
        >
          <Image
            src={RoundLogo}
            alt='Logo'
            className='2xl:mx-auto'
            width={160}
            height={160}
            priority
          />
        </Link>

        <MainNav
          navLinks={links}
          className='col-span-3 col-start-7 hidden justify-end lg:flex'
        />
        <HamburgerNav
          menuLinks={links}
          className='group col-span-2 col-start-7 flex justify-end space-y-1 lg:hidden'
        />
      </div>
    </header>
  );
}
