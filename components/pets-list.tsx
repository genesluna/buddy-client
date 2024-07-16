'use client';

// TODO: Move to SSR in the future. Not possible now because
// suspense is not working in the current version of Next.js

import PetCard from './pet-card';
import { useQuery } from '@tanstack/react-query';
import { fetchPets } from '@server/actions/pet-actions';
import PetCardSkeleton from './pet-card-skeleton';

export default function PetsList({
  searchParamsPath,
}: {
  searchParamsPath: string;
}) {
  const {
    data: pets,
    error,
    isLoading,
  } = useQuery({
    queryFn: async () => fetchPets(searchParamsPath),
    queryKey: ['pets-list', searchParamsPath],
  });

  return isLoading ? (
    <section className='mb-14 mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      {Array.from({ length: 8 }).map((_, index) => (
        <PetCardSkeleton key={index} />
      ))}
    </section>
  ) : (
    <section className='mb-14 mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      {pets?.map((pet) => <PetCard key={pet.id} pet={pet} />)}
    </section>
  );
}
