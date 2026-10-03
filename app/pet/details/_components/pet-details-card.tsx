'use client';

import {
  CalendarBlank,
  MapPin,
  PawPrint,
  Info,
} from '@phosphor-icons/react';
import { birthDateToHumanReadableAge } from '@/app/_lib/utils';
import Button from '@/app/_components/ui/button';
import Scale from '@/app/_assets/scale.svg';
import { Pet } from '@/app/_entities/pet/model';
import { useAuth } from '@/app/_entities/auth/use-auth';
import Image from 'next/image';
import Link from 'next/link';

interface PetDetailsCardProps {
  pet: Pet;
}

export default function PetDetailsCard({ pet }: PetDetailsCardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  const isAdopter = user?.profiles?.some(
    (p) => p.profileType === 'ADOPTER' || (p.profileType as string) === 'USER'
  );
  const isShelterOnly =
    user?.profiles &&
    user.profiles.length > 0 &&
    !isAdopter &&
    user.profiles.some((p) => p.profileType === 'SHELTER');
  const hasNoProfiles =
    isAuthenticated && (!user?.profiles || user.profiles.length === 0);

  return (
    <div className='min-h-[480px] w-full rounded-[1.875rem] bg-white px-10 py-7.5 xl:-mt-17.25'>
      <h1 className='text-accent text-lg font-semibold md:text-xl lg:text-2xl'>
        {pet?.name}
      </h1>
      <div>
        <div className='mt-10 flex items-center gap-1'>
          <CalendarBlank size={18} className='text-accent' weight='bold' />
          <span className='text-content-300 ms-2'>
            {birthDateToHumanReadableAge(pet.birthDate)}
          </span>
        </div>
        <div className='mt-5 flex items-center gap-1'>
          <MapPin size={18} className='text-accent' weight='bold' />
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

        {/* Adoption Action Section */}
        <div className='mt-8 flex flex-col items-center justify-center gap-3'>
          {!isLoading && isAdopter && (
            <Link
              href={`/pet/adoption?id=${pet.id}&name=${pet.name}&gender=${pet.gender}`}
              className='w-full sm:w-auto'
            >
              <Button
                aria-label='Solicitar adoção'
                label='Solicitar adoção'
                className='w-full sm:w-72'
                icon={<PawPrint size={24} weight='bold' />}
              />
            </Link>
          )}

          {!isLoading && !isAuthenticated && (
            <div className='flex w-full flex-col items-center rounded-2xl bg-tertiary/20 p-4 text-center border border-tertiary/40'>
              <Button
                aria-label='Solicitar adoção'
                label='Solicitar adoção'
                className='w-full sm:w-72 cursor-not-allowed opacity-60'
                disabled
                icon={<PawPrint size={24} />}
              />
              <p className='mt-3 text-xs text-content-300'>
                Faça{' '}
                <Link
                  href='/auth/login'
                  className='font-semibold text-accent underline hover:text-accent/80'
                >
                  login
                </Link>{' '}
                ou{' '}
                <Link
                  href='/auth/register'
                  className='font-semibold text-accent underline hover:text-accent/80'
                >
                  cadastre-se
                </Link>{' '}
                com perfil de adotante para solicitar a adoção.
              </p>
            </div>
          )}

          {!isLoading && isShelterOnly && (
            <div className='flex w-full flex-col items-center rounded-2xl bg-amber-50 p-4 text-center border border-amber-200'>
              <Button
                aria-label='Solicitar adoção'
                label='Solicitar adoção'
                className='w-full sm:w-72 cursor-not-allowed opacity-50'
                disabled
                icon={<PawPrint size={24} />}
              />
              <div className='mt-2 flex items-center justify-center gap-1.5 text-xs text-amber-800 font-medium'>
                <Info size={16} weight='bold' className='shrink-0' />
                <span>
                  Você está conectado como <strong>Abrigo</strong>. Apenas
                  perfis de adotante podem solicitar adoção.
                </span>
              </div>
            </div>
          )}

          {!isLoading && hasNoProfiles && (
            <div className='flex w-full flex-col items-center rounded-2xl bg-tertiary/20 p-4 text-center border border-tertiary/40'>
              <Button
                aria-label='Solicitar adoção'
                label='Solicitar adoção'
                className='w-full sm:w-72 cursor-not-allowed opacity-60'
                disabled
                icon={<PawPrint size={24} />}
              />
              <p className='mt-3 text-xs text-content-300'>
                Você ainda não possui um perfil.{' '}
                <Link
                  href='/profile/create'
                  className='font-semibold text-accent underline hover:text-accent/80'
                >
                  Crie seu perfil de adotante
                </Link>{' '}
                para poder solicitar a adoção.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
