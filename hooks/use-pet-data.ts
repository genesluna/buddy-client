import { fetchPetById, fetchPetsInfinite } from '@/server/actions/pet-actions';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export function useFetchPetsListInfinite(
  searchParamsPath: string,
  pageLimit: number
) {
  const query = useInfiniteQuery({
    queryKey: ['pets', searchParamsPath],
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
    queryKey: ['pet', petId],
    queryFn: () => fetchPetById(petId),
    enabled: !!petId,
  });

  return query;
}
