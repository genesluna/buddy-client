import {
  CalendarBlank,
  MapPin,
  PawPrint,
} from '@phosphor-icons/react/dist/ssr';
import Button from '@/app/_components/ui/button';
import { calculateAge } from '@/app/_lib/utils';
import Scale from '@/app/_assets/scale.svg';
import { Pet } from '@/app/pet/_types/pet';
import Image from 'next/image';
import Link from 'next/link';

interface PetDetailsCardProps {
  pet: Pet;
}

export default function PetDetailsCard({ pet }: PetDetailsCardProps) {
  return (
    <div className='min-h-[480px] w-full rounded-[1.875rem] bg-white px-[2.5rem] py-[1.875rem] xl:mt-[-4.3125rem]'>
      <h1 className='text-lg font-semibold text-accent md:text-xl lg:text-2xl'>
        {pet?.name}
      </h1>
      <div>
        <div className='mt-10 flex items-center gap-1'>
          <CalendarBlank size={18} className='text-accent' weight='bold' />
          <span className='ms-2 text-content-300'>{`${
            pet ? calculateAge(pet.birthDate) : 0
          } anos de idade.`}</span>
        </div>
        <div className='mt-5 flex items-center gap-1'>
          <MapPin size={18} className='text-accent' weight='bold' />
          <span className='ms-2 text-content-300'>{pet.location}</span>
        </div>
        <div className='mt-5 flex items-center gap-1'>
          <Image
            src={Scale}
            width={18}
            height={18}
            alt='scale icon'
            className='text-accent'
          />
          <span className='ms-2 text-content-300'>{pet.weight} kg</span>
        </div>
        <p className='mt-7 text-content-300'>{pet.description}</p>
        <div className='flex items-center justify-center'>
          <Link
            href={`/pet/adoption?id=${pet.id}&name=${pet.name}&gender=${pet.gender}`}
          >
            <Button
              label='Solicitar adoção'
              className='mt-7 w-72'
              icon={<PawPrint size={24} />}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
