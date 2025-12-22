import { CalendarBlank, MapPin } from '@phosphor-icons/react/dist/ssr';
import { birthDateToHumanReadableAge } from '@/app/_lib/utils';
import { Pet } from '@/app/_entities/pet/model';
import Image from 'next/image';
import Link from 'next/link';

interface PetCardProps {
  pet: Pet;
}

export default function PetListCard({ pet }: PetCardProps) {
  return (
    <Link
      href={`pet/details?id=${pet.id}#`}
      aria-label={pet.name}
      className='h-[310px] w-auto rounded-3xl bg-white p-3 transition duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl'
    >
      <div className='relative h-[200px] w-full'>
        <Image
          src={pet.avatar}
          alt='pet photo'
          sizes='(max-width: 768px) 90vw, (max-width: 1280px) 40vw, (max-width: 1536px) 26vw, 18vw'
          fill
          className='rounded-2xl object-cover grayscale-0 transition duration-700 ease-in-out hover:grayscale'
          priority
        />
      </div>

      <div className='px-3 pt-2'>
        <h3 className='text-md font-semibold'>{pet.name}</h3>

        <div className='mt-1 flex items-center gap-1'>
          <CalendarBlank size={18} className='text-accent' />
          <span className='text-sm'>
            {birthDateToHumanReadableAge(pet.birthDate)}
          </span>
        </div>

        <div className='mt-1 flex items-center gap-1'>
          <MapPin size={18} className='text-accent' />
          <span className='text-sm'>{pet.location}</span>
        </div>
      </div>
    </Link>
  );
}
