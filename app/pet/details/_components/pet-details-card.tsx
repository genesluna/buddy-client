import {
  CalendarBlankIcon,
  MapPinIcon,
  PawPrintIcon,
} from '@phosphor-icons/react/dist/ssr';
import { birthDateToHumanReadableAge } from '@/app/_lib/utils';
import Button from '@/app/_components/ui/button';
import Scale from '@/app/_assets/scale.svg';
import { Pet } from '@/app/_entities/pet/model';
import Image from 'next/image';
import Link from 'next/link';

interface PetDetailsCardProps {
  pet: Pet;
}

export default function PetDetailsCard({ pet }: PetDetailsCardProps) {
  return (
    <div className='min-h-[480px] w-full rounded-[1.875rem] bg-white px-[2.5rem] py-[1.875rem] xl:mt-[-4.3125rem]'>
      <h1 className='text-accent text-lg font-semibold md:text-xl lg:text-2xl'>
        {pet?.name}
      </h1>
      <div>
        <div className='mt-10 flex items-center gap-1'>
          <CalendarBlankIcon size={18} className='text-accent' weight='bold' />
          <span className='text-content-300 ms-2'>
            {birthDateToHumanReadableAge(pet.birthDate)}
          </span>
        </div>
        <div className='mt-5 flex items-center gap-1'>
          <MapPinIcon size={18} className='text-accent' weight='bold' />
          <span className='text-content-300 ms-2'>{pet.location}</span>
        </div>
        <div className='mt-5 flex items-center gap-1'>
          <Image
            src={Scale}
            width={18}
            height={18}
            alt='scale icon'
            className='text-accent'
          />
          <span className='text-content-300 ms-2'>{pet.weight} kg</span>
        </div>
        <p className='text-content-300 mt-7'>{pet.description}</p>
        <div className='flex items-center justify-center'>
          <Link
            href={`/pet/adoption?id=${pet.id}&name=${pet.name}&gender=${pet.gender}`}
          >
            <Button
              aria-label='Solicitar adoção'
              label='Solicitar adoção'
              className='mt-7 w-72'
              icon={<PawPrintIcon size={24} />}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
