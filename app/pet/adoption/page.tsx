import HorizontalLayout from '@/app/_components/horizontal-layout';
import PetAdoptionForm from './_components/pet-adoption-form';

interface AdoptionPageProps {
  searchParams: {
    id: string;
    name: string;
    gender: string;
  };
}

export default function AdoptionPage({ searchParams }: AdoptionPageProps) {
  return (
    <HorizontalLayout>
      <h1 className='text-3xl font-bold text-accent sm:text-4xl'>{`Adote ${
        searchParams.gender === 'Macho' ? 'o' : 'a'
      } ${searchParams.name}`}</h1>
      <p className='mt-2 max-w-[467px] text-content-300 sm:text-lg'>
        Faça sua solicitação e entraremos em contato o mais rápido possível.
      </p>
      <PetAdoptionForm petId={searchParams.id} />
    </HorizontalLayout>
  );
}
