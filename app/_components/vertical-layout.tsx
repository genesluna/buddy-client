import { PageHeader } from '@/app/_components/page-header';
import PageFooter from '@/app/_components/page-footer';

export default function VerticalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen w-full flex-col items-center'>
      <PageHeader />
      {children}
      <PageFooter />
    </div>
  );
}
