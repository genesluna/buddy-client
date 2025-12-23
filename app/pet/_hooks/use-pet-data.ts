import { fetchPetById, fetchPetsInfinite } from '@/app/_entities/pet/queries';
import { PET_QUERY_KEYS } from '@/app/_entities/pet/query-keys';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export function useFetchPetsListInfinite(
  searchParamsPath: string,
  pageLimit: number
) {
  const query = useInfiniteQuery({
    queryKey: PET_QUERY_KEYS.list(searchParamsPath),
    queryFn: (pageParams) =>
      fetchPetsInfinite(pageParams.pageParam, searchParamsPath, pageLimit),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: pageLimit > 0,
  });

  return query;
}

export function useFetchPetById(petId: string) {
  const query = useQuery({
    queryKey: PET_QUERY_KEYS.detail(petId),
    queryFn: () => fetchPetById(petId),
    enabled: !!petId,
  });

  return query;
}
