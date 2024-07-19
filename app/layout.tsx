import ReactQueryProvider from '@lib/providers/react-query-provider';
import { Poppins as FontSans } from 'next/font/google';
import { PageHeader } from '@components/page-header';
import PageFooter from '@components/page-footer';
import type { Metadata, Viewport } from 'next';
import { cn } from '@lib/utils';
import '@styles/globals.css';

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
        <ReactQueryProvider>
          <PageHeader />
          <main className='flex w-[90%] max-w-[83.3125rem] flex-1 flex-col sm:w-[80%]'>
            {children}
          </main>
          <PageFooter />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
