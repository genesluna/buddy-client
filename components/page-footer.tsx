import Link from 'next/link';
import HorizontalLogo from '@/assets/logo_hor.svg';
import SocialIcons from './ui/social-icons';
import Image from 'next/image';

export default function PageFooter() {
  return (
    <footer className='flex h-56 w-full flex-col items-center justify-center rounded-t-4xl bg-accent'>
      <Link href='/' aria-label='Home'>
        <Image
          src={HorizontalLogo}
          alt='Logo'
          width={147}
          height={56}
          priority
        />
      </Link>

      <SocialIcons />

      <p className='mt-6 text-sm text-white'>
        © 2024. Todos os direitos reservados.
      </p>
    </footer>
  );
}
