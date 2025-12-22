import { PetListFilter } from '@/app/pet/_components/pet-list-filter';
import VerticalLayout from './_components/vertical-layout';
import PetsList from '@/app/pet/_components/pets-list';
import { SearchParams } from './_types/props';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;
  return (
    <VerticalLayout>
      <PetListFilter />
      <PetsList searchParams={resolvedParams} />
    </VerticalLayout>
  );
}
