'use client';

import { useFetchPetsListInfinite } from '@/app/pet/_hooks/use-pet-data';
import { buildSearchParamsPath } from '@/app/_lib/utils';
import { useInView } from 'react-intersection-observer';
import { SearchParams } from '@/app/_types/props';
import PetListSkeleton from './pet-list-skeleton';
import { useEffect, useState } from 'react';
import PetListCard from './pet-list-card';

export default function PetsList({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const searchParamsPath = buildSearchParamsPath('', searchParams);

  const pageLimit = usePageLimit();

  const { data, error, isLoading, fetchNextPage, isFetchingNextPage } =
    useFetchPetsListInfinite(searchParamsPath, pageLimit);

  const ref = useInfiniteScroll(fetchNextPage);

  if (isLoading) {
    return <PetListSkeleton numberOfItems={pageLimit} />;
  }

  const noPetsFound = data?.pages[0].data.length === 0;

  if (noPetsFound) {
    return (
      <section className='flex flex-grow flex-col items-center justify-center'>
        <span className='text-5xl'>😿</span>
        <span className='mt-2 text-lg text-content-200'>Sem resultados.</span>
      </section>
    );
  }

  if (error) {
    return (
      <section className='flex flex-grow flex-col items-center justify-center'>
        <span className='text-6xl'>😿</span>
        <span className='mt-2 text-lg text-content-200'>
          Algo não saiu como esperado.
        </span>
        <span className='text-md text-content-200'>
          Tente novamente mais tarde.
        </span>
      </section>
    );
  }

  return (
    <section className='mb-14'>
      {data?.pages.map((page) => {
        return (
          <ul key={page.currentPage}>
            <li
              key={page.currentPage}
              className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
            >
              {page.data.map((pet) => {
                return <PetListCard key={pet.id} pet={pet} />;
              })}
            </li>
          </ul>
        );
      })}

      <div ref={ref}>
        {isFetchingNextPage && <PetListSkeleton numberOfItems={pageLimit} />}
      </div>
    </section>
  );
}

function usePageLimit() {
  const [limit, setLimit] = useState<number>(0);

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

  return limit;
}

function useInfiniteScroll(fetchNextPage: () => void) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return ref;
}
