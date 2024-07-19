import ImageSkeleton from './image-skeleton';

export default function PetDetailsShelterCard() {
  return (
    <div className='flex min-h-[161px] w-full flex-col items-center rounded-[1.875rem] bg-white px-[2.5rem] py-[1.875rem] sm:flex-row'>
      <ImageSkeleton className='h-[112px] w-[112px] rounded-2xl sm:ms-[-20px]' />

      <div className='mt-4 flex w-full flex-1 flex-col items-center justify-center gap-2 sm:ms-4 sm:mt-0 sm:items-start'>
        <div className='mt-1 h-3 w-full rounded-full bg-gray-300' />
        <div className='mt-2 h-3 w-full rounded-full bg-gray-300' />
        <div className='mt-2 h-3 w-40 rounded-full bg-gray-300' />
      </div>
    </div>
  );
}
