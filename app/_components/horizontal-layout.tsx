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
    <div className='mx-auto grid h-screen grid-cols-9 gap-0 bg-white'>
      <div className='relative col-span-4 col-start-1 hidden items-center justify-center rounded-br-4xl rounded-tr-4xl bg-accent lg:flex'>
        <BackButton />

        <Link href='/'>
          <Image src={RoundLogo} alt='Logo' width={288} height={288} priority />
        </Link>
      </div>
      <div className='col-span-9 col-start-1 mt-52 flex flex-col items-center px-8 lg:col-span-5 lg:col-start-5 lg:my-auto lg:items-start lg:px-32'>
        <div className='absolute top-0 mx-auto flex w-full justify-center rounded-b-4xl bg-accent py-2 lg:hidden'>
          <BackButton />

          <Link href='/'>
            <Image
              src={RoundLogo}
              alt='Logo'
              width={128}
              height={128}
              priority
            />
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
