import { buildSearchParamsPath } from '@lib/utils';
import { PetFilter } from '@components/pet-filter';
import PetsList from '@components/pets-list';
import { SearchParams } from '@lib/types';

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div>
      <PetFilter />
      <PetsList searchParams={searchParams} />
    </div>
  );
}
