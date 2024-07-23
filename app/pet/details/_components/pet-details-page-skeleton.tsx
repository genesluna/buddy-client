import PetDetailsImgageGallerySkleton from './pet-details-image-galery-skeleton';
import PetDetailsShelterCardSkeleton from './pet-details-shelter-card-skeleton';
import PetDetailsCardSkeleton from './pet-details-card-skeleton';

export default function PetDetailsPageSkeleton() {
  return (
    <div className='flex w-full flex-col gap-6 pb-20 xl:flex-row'>
      <div className='mt-[-4.3125rem] flex w-auto max-w-[821px] basis-[63%] flex-col items-start gap-7 rounded-[1.875rem] bg-white p-6 2xl:h-[552px] 2xl:flex-row'>
        <PetDetailsImgageGallerySkleton />
      </div>

      <div className='flex max-w-[821px] basis-[37%] flex-col items-start gap-7'>
        <PetDetailsCardSkeleton />
        <PetDetailsShelterCardSkeleton />
      </div>
    </div>
  );
}
