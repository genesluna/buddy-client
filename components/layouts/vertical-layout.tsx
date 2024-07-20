import PageFooter from '@/components/page-footer';
import { PageHeader } from '@/components/page-header';

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
