import PetCardSkeleton from './pet-list-card-skeleton';

export default function PetListSkeleton({
  numberOfItems,
}: {
  numberOfItems: number;
}) {
  return (
    <section className='mb-14 mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      {Array.from({ length: numberOfItems }).map((_, index) => (
        <PetCardSkeleton key={index} />
      ))}
    </section>
  );
}
