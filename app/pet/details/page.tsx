import VerticalLayout from '@/components/layouts/vertical-layout';
import PetDetails from '@/components/pet-details';
import MaxWidthWrapper from '@/components/ui/max-width-wrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buddy | Detalhes do animal',
  description: 'Detalhes do animal',
};

export default function PetDetailsPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  return (
    <VerticalLayout>
      <MaxWidthWrapper>
        <PetDetails petId={searchParams.id} />
      </MaxWidthWrapper>
    </VerticalLayout>
  );
}
