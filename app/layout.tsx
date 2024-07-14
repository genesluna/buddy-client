import type { Metadata } from 'next';
import { Poppins as FontSans } from 'next/font/google';
import { cn } from '@lib/utils';
import '@styles/globals.css';
import { PageHeader } from '@components/page-header';
import PageFooter from '@components/page-footer';

const fontSans = FontSans({
  weight: ['400', '600', '800'],
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Buddy',
  description: 'Aplicativo de adoção de animais de estimação.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-br'>
      <body
        className={cn(
          'flex min-h-screen w-full flex-col items-center overflow-x-hidden scroll-auto font-sans antialiased',
          fontSans.variable
        )}
      >
        <PageHeader />
        <main className='flex w-[90%] max-w-[83.3125rem] flex-1 flex-col sm:w-[80%]'>
          {children}
        </main>
        <PageFooter />
      </body>
    </html>
  );
}
