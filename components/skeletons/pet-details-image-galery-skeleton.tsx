import ImageSkeleton from './image-skeleton';

export default function PetDetailsImgageGallerySkleton() {
  const thumbImgClassName = `rounded-full w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-36 lg:h-36 xl:w-28 xl:h-28 2xl:w-30 2xl:h-30 md:rounded-3xl 
    object-cover cursor-pointer transition ease-in-out hover:-translate-y-1 hover:shadow-xl aspect-square`;
  return (
    <>
      <div className='h-full w-full overflow-hidden'>
        <ImageSkeleton className='aspect-video h-full w-full rounded-3xl object-cover' />
      </div>
      <div className='flex w-full items-center justify-between 2xl:h-full 2xl:w-40 2xl:flex-col'>
        <ImageSkeleton className={thumbImgClassName} />
        <ImageSkeleton className={thumbImgClassName} />
        <ImageSkeleton className={thumbImgClassName} />
        <ImageSkeleton className={thumbImgClassName} />
      </div>
    </>
  );
}
