'use client';

import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';
import { useForm } from 'react-hook-form';
import { string, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Combobox from '@components/ui/combobox';
import Button from '@components/ui/button';
import { buildSearchParamsPath } from '@lib/utils';
import { navigate } from '@server/actions';

const filterSchema = z.object({
  species: string(),
  gender: string(),
  ageRange: string(),
  weightRange: string(),
});

const filterOptions = [
  {
    label: 'Espécie',
    placeHolder: '---',
    name: 'species',
    options: ['Cão', 'Gato', 'Réptil', 'Peixe'],
  },
  {
    label: 'Sexo',
    placeHolder: '---',
    name: 'gender',
    options: ['Macho', 'Fêmea'],
  },
  {
    label: 'Idade',
    placeHolder: '---',
    name: 'ageRange',
    options: [
      '0-1 anos',
      '1-2 anos',
      '2-3 anos',
      '3-5 anos',
      '5-10 anos',
      '10+ anos',
    ],
  },
  {
    label: 'Peso',
    placeHolder: '---',
    name: 'weightRange',
    options: ['0-5 kg', '5-10 kg', '10-20 kg', '20-30 kg', '30+ kg'],
  },
];

export function PetFilter() {
  const { register, handleSubmit } = useForm<FilterData>({
    mode: 'onChange',
    criteriaMode: 'all',
    resolver: zodResolver(filterSchema),
  });

  type FilterData = z.infer<typeof filterSchema>;

  function handleFilter(filterData: FilterData) {
    const searchParamsPath = buildSearchParamsPath('/', filterData);

    navigate(searchParamsPath);
  }

  return (
    <div className='mt-[-4.3125rem] flex items-center justify-between rounded-[1.875rem] bg-white px-[2.5rem] py-[1.875rem]'>
      <form
        onSubmit={handleSubmit(handleFilter)}
        className='flex h-full w-full items-center gap-8'
      >
        <div className='2xl-gap-6 flex h-full w-full flex-col items-end justify-between gap-3 md:gap-3 lg:gap-4 xl:gap-5 2xl:flex-row'>
          <div className='2xl-gap-6 flex w-full gap-3 md:gap-3 lg:gap-4 xl:gap-5'>
            {filterOptions.slice(0, 2).map((filter, index) => (
              <Combobox
                key={index}
                className='w-full'
                placeholderClassName=' text-sm sm:text-base'
                id={filter.name}
                label={filter.label}
                placeHolder={filter.placeHolder}
                options={filter.options}
                {...register(filter.name as keyof FilterData)}
              />
            ))}
          </div>
          <div className='2xl-gap-6 flex w-full gap-3 md:gap-3 lg:gap-4 xl:gap-5'>
            {filterOptions.slice(2, 4).map((filter, index) => (
              <Combobox
                key={index}
                className='w-full'
                placeholderClassName='text-sm sm:text-base'
                id={filter.name}
                label={filter.label}
                placeHolder={filter.placeHolder}
                options={filter.options}
                {...register(filter.name as keyof FilterData)}
              />
            ))}
          </div>
          <Button
            type='submit'
            className='w-full 2xl:min-w-40 2xl:max-w-40'
            label='Pesquisar'
            icon={<MagnifyingGlass size={24} />}
          />
        </div>
      </form>
    </div>
  );
}
