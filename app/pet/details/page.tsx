import PetDetails from '@/app/pet/details/_components/pet-details';
import VerticalLayout from '@/app/_components/vertical-layout';
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
      <PetDetails petId={searchParams.id} />
    </VerticalLayout>
  );
}
