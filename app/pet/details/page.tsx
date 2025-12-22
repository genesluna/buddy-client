import PetDetails from '@/app/pet/details/_components/pet-details';
import VerticalLayout from '@/app/_components/vertical-layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buddy | Detalhes do animal',
  description: 'Detalhes do animal',
};

export default async function PetDetailsPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id } = await searchParams;
  return (
    <VerticalLayout>
      <PetDetails petId={id} />
    </VerticalLayout>
  );
}
