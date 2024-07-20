import { Pet } from '@/lib/models/pet';
import Image from 'next/image';

interface PetDetailsCardProps {
  pet: Pet;
}

export default function PetDetailsShelterCard({ pet }: PetDetailsCardProps) {
  return (
    <div className='flex min-h-[161px] w-full flex-col items-center rounded-[1.875rem] bg-white px-[2.5rem] py-[1.875rem] sm:flex-row'>
      <Image
        src={pet.shelterResponseCompact.avatar}
        width={112}
        height={112}
        className='aspect-square w-[112px] sm:ms-[-20px]'
        alt='shelter avatar'
      />
      <div className='mt-4 flex flex-col items-center justify-center sm:ms-4 sm:mt-0 sm:items-start'>
        <span className='text-center text-content-300 sm:text-start'>
          {pet.shelterResponseCompact.nameShelter}
        </span>
        <a href='#' className='mt-2 text-sm text-accent'>
          Página do abrigo
        </a>
      </div>
    </div>
  );
}
