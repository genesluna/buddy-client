import ImageSkeleton from './image-skeleton';

export default function PetCardSkeleton() {
  return (
    <div className='h-[310px] w-auto animate-pulse rounded-3xl bg-white p-3 transition duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl'>
      <div className='relative h-[200px] w-full'>
        <ImageSkeleton className='rounded-2xl' />
      </div>

      <div className='px-3 pt-2'>
        <div className='mt-1 h-4 w-56 rounded-full bg-gray-300' />
        <div className='mt-2 h-4 w-56 rounded-full bg-gray-300' />
        <div className='mt-2 h-4 w-56 rounded-full bg-gray-300' />
      </div>
    </div>
  );
}
