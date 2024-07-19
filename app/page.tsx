import VerticalLayout from '@components/layouts/vertical-layout';
import { PetListFilter } from '@components/pet-list-filter';
import PetsList from '@components/pets-list';
import MaxWidthWrapper from '@components/ui/max-width-wrapper';
import { SearchParams } from '@lib/types';

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <VerticalLayout>
      <MaxWidthWrapper>
        <PetListFilter />
        <PetsList searchParams={searchParams} />
      </MaxWidthWrapper>
    </VerticalLayout>
  );
}
