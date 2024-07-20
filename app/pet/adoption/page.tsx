import HorizontalLayout from '@/components/layouts/horizontal-layout';
import AdoptionForm from '@/components/forms/adoption-form';

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
      <h1 className='text-4xl font-bold text-accent'>{`Adote ${
        searchParams.gender === 'Macho' ? 'o' : 'a'
      } ${searchParams.name}`}</h1>
      <p className='mt-2 max-w-[467px] text-lg text-content-300'>
        Faça sua solicitação e entraremos em contato o mais rápido possível.
      </p>
      <AdoptionForm petId={searchParams.id} />
    </HorizontalLayout>
  );
}
