'use client';

import { fetchPetsInfinite } from '@server/actions/pet-actions';
import { buildSearchParamsPath } from '@lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import PetListSkeleton from './pet-list-skeleton';
import { useEffect, useState } from 'react';
import { SearchParams } from '@lib/types';
import PetCard from './pet-card';

export default function PetsList({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [limit, setLimit] = useState<number>(0);
  const searchParamsPath = buildSearchParamsPath('', searchParams);

  const { data, error, isLoading, fetchNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ['pets', searchParamsPath],
      queryFn: (pageParams) =>
        fetchPetsInfinite(pageParams.pageParam, searchParamsPath, limit),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      enabled: limit > 0,
    });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  useEffect(() => {
    const width = window.innerWidth;

    if (width >= 1536) {
      setLimit(8);
    } else if (width >= 1280) {
      setLimit(6);
    } else {
      setLimit(4);
    }
  }, []);

  console.log(limit);

  if (isLoading) {
    return <PetListSkeleton numberOfItems={limit} />;
  }

  if (error) {
    console.error(error);
    // TODO: Handle error. Toast?
  }

  return (
    <div className='mb-14'>
      {data?.pages.map((page) => {
        return (
          <div key={page.currentPage}>
            <section
              key={page.currentPage}
              className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
            >
              {page.data.map((pet) => {
                return <PetCard key={pet.id} pet={pet} />;
              })}
            </section>
          </div>
        );
      })}

      <div ref={ref}>
        {isFetchingNextPage && <PetListSkeleton numberOfItems={limit} />}
      </div>
    </div>
  );
}
