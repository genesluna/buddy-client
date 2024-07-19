import { PetListFilter } from '@components/pet-list-filter';
import PetsList from '@components/pets-list';
import { SearchParams } from '@lib/types';

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div>
      <PetListFilter />
      <PetsList searchParams={searchParams} />
    </div>
  );
}
