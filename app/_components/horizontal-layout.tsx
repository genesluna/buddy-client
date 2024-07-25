import BackButton from '@/app/_components/ui/back-button';
import RoundLogo from '@/app/_assets/logo_round.svg';
import Image from 'next/image';
import Link from 'next/link';

export default function HorizontalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen w-full flex-col justify-center bg-white lg:flex-row'>
      <header className='relative w-full items-center justify-center rounded-b-4xl bg-accent py-2 lg:flex lg:w-[44.5%] lg:rounded-bl-none lg:rounded-br-4xl lg:rounded-tr-4xl'>
        <BackButton />

        <Link
          href='/'
          aria-label='Home'
          className='flex w-full items-center justify-center'
        >
          <Image
            src={RoundLogo}
            alt='Logo'
            width={288}
            height={288}
            priority
            className='h-32 w-32 lg:h-72 lg:w-72'
          />
        </Link>
      </header>
      <main className='flex w-auto flex-1 flex-col items-center justify-center px-7 py-7 lg:w-[55.5%] lg:items-start lg:px-20 xl:px-32'>
        {children}
      </main>
    </div>
  );
}
