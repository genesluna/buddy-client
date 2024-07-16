import { PetFilter } from '@components/pet-filter';
import { buildSearchParamsPath } from '@lib/utils';
import { SearchParams } from '@lib/search-params';
import PetsList from '@components/pets-list';

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const searchParamsPath = buildSearchParamsPath('', searchParams);

  return (
    <div>
      <PetFilter />
      <PetsList searchParamsPath={searchParamsPath} />
    </div>
  );
}
