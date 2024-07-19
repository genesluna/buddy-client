'use client';

import PetDetailsPageSkeleton from './skeletons/pet-details-page-skeleton';
import PetDetailsImgageGallery from './pet-details-image-gallery';
import PetDetailsShelterCard from './pet-details-shelter-card';
import { useFetchPetById } from '@hooks/use-pet-data';
import { useScrollTop } from '@hooks/use-scroll-top';
import PetDetailsCard from './pet-details-card';

export default function PetDetails({ petId }: { petId: string }) {
  const { data, error, isLoading } = useFetchPetById(petId);

  useScrollTop();

  if (isLoading) {
    return <PetDetailsPageSkeleton />;
  }

  if (error) {
    console.error('Pet data Error:', error);
    return null;
    // TODO: Handle error. Toast?
  }

  return (
    <div className='flex w-full flex-col gap-6 pb-20 xl:flex-row'>
      <div className='mt-[-4.3125rem] flex w-auto max-w-[821px] basis-[63%] flex-col items-start gap-7 rounded-[1.875rem] bg-white p-6 2xl:h-[552px] 2xl:flex-row'>
        <PetDetailsImgageGallery pet={data![0]} />
      </div>

      <div className='flex max-w-[821px] basis-[37%] flex-col items-start gap-7'>
        <PetDetailsCard pet={data![0]} />
        <PetDetailsShelterCard pet={data![0]} />
      </div>
    </div>
  );
}
