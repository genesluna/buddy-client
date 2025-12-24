import ReactQueryProvider from '@/app/_lib/providers/react-query-provider';
import { AuthProvider } from '@/app/_entities/auth';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Poppins as FontSans } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import { cn } from '@/app/_lib/utils';
import '@/styles/globals.css';
import Script from 'next/script';

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
          'relative flex min-h-screen w-full flex-col items-center overflow-x-hidden scroll-auto font-sans antialiased',
          fontSans.variable
        )}
      >
        <ReactQueryProvider>
          <AuthProvider>
            {children}
            <Toaster position='bottom-right' />
            <SpeedInsights />
          </AuthProvider>
        </ReactQueryProvider>
        <Script
          id="tracker-collector"
          src="/scripts/tracker-collector.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
