import { cn } from '@lib/utils';

interface ImageSkeletonProps {
  className?: string;
}

export default function ImageSkeleton({ className }: ImageSkeletonProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full animate-pulse items-center justify-center bg-gray-300',
        className
      )}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={2}
        stroke='currentColor'
        className='h-7 w-7 text-gray-400 sm:h-10 sm:w-10 lg:h-14 lg:w-14' //TODO: Add classname to props to fix main image responsiveness
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
        />
      </svg>
    </div>
  );
}
