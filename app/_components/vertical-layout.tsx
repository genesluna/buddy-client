import { PageHeader } from '@/app/_widgets/page-header';
import { PageFooter } from '@/app/_widgets/page-footer';

export default function VerticalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <div className='flex min-h-screen w-full flex-col items-center'>
    <>
      <PageHeader />
      <main className='flex w-[90%] max-w-[83.3125rem] flex-1 flex-col sm:w-[80%]'>
        {children}
      </main>
      <PageFooter />
    </>
  );
}
