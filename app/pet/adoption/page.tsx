import { HorizontalLayout } from '@/app/_widgets/layouts';
import PetAdoptionForm from './_components/pet-adoption-form';

interface AdoptionPageProps {
  searchParams: Promise<{
    id: string;
    name: string;
    gender: string;
  }>;
}

export default async function AdoptionPage({ searchParams }: AdoptionPageProps) {
  const { id, name, gender } = await searchParams;
  return (
    <HorizontalLayout>
      <h1 className='text-3xl font-bold text-accent sm:text-4xl'>{`Adote ${
        gender === 'Macho' ? 'o' : 'a'
      } ${name}`}</h1>
      <p className='mt-2 max-w-[467px] text-content-300 sm:text-lg'>
        Faça sua solicitação e entraremos em contato o mais rápido possível.
      </p>
      <PetAdoptionForm petId={id} />
    </HorizontalLayout>
  );
}
