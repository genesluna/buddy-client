import ReactQueryProvider from '@/app/_lib/providers/react-query-provider';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Poppins as FontSans } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import { cn } from '@/app/_lib/utils';
import '@/styles/globals.css';

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
          'relative min-h-screen overflow-x-hidden scroll-auto font-sans antialiased',
          fontSans.variable
        )}
      >
        <ReactQueryProvider>
          {children}
          <Toaster position='bottom-right' />
          <SpeedInsights />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
