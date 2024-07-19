import PetDetails from '@components/pet-details';
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
  return <PetDetails petId={searchParams.id} />;
}
