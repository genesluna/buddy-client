import noImg from '@/app/_assets/noimg.webp';
import { Pet } from '@/app/_entities/pet/model';
import { isValidImageUrl } from '@/app/_lib/utils';
import Image from 'next/image';

interface PetDetailsCardProps {
  pet: Pet;
}

export default function PetDetailsShelterCard({ pet }: PetDetailsCardProps) {
  const shelter = pet.shelterResponseCompact;
  const shelterName = shelter?.nameShelter || 'Abrigo';
  const avatarSrc = isValidImageUrl(shelter?.avatar) ? shelter.avatar : noImg;

  return (
    <div className='flex min-h-[161px] w-full flex-col items-center rounded-[1.875rem] bg-white px-[2.5rem] py-[1.875rem] sm:flex-row'>
      <Image
        src={avatarSrc}
        width={112}
        height={112}
        className='aspect-square w-[112px] sm:ms-[-20px] rounded-full object-cover'
        alt='shelter avatar'
      />
      <div className='mt-4 flex flex-col items-center justify-center sm:ms-4 sm:mt-0 sm:items-start'>
        <span className='text-center text-content-300 sm:text-start'>
          {shelterName}
        </span>
        <a href='#' className='mt-2 text-sm text-accent'>
          Página do abrigo
        </a>
      </div>
    </div>
  );
}
