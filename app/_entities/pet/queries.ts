import api from '@/app/_lib/api/axios-instance';
import { Pet, PetInfiniteResponse } from './model';

export async function fetchPets(params?: string): Promise<{ pets: Pet[] }> {
  const query = params ? (params.startsWith('?') ? params : `?${params}`) : '';
  const response = await api.get<{ _embedded?: { petParamsResponseList?: Pet[] } }>(
    `/pets${query}`
  );

  return { pets: response.data._embedded?.petParamsResponseList || [] };
}

export async function fetchPetsInfinite(
  pageParam: number,
  searchParams: string,
  pageLimit: number
): Promise<PetInfiniteResponse> {
  const cleanParams = searchParams?.startsWith('?')
    ? searchParams.slice(1)
    : (searchParams || '');
  const prefix = cleanParams ? `${cleanParams}&` : '';
  const url = `/pets?${prefix}page=${pageParam}&size=${pageLimit}&sort=createDate,desc`;

  const response = await api.get<{
    _embedded?: { petParamsResponseList?: Pet[] };
    page?: {
      number: number;
      totalPages: number;
      totalElements: number;
      size: number;
    };
  }>(url);

  const data = response.data._embedded?.petParamsResponseList || [];
  const page = response.data.page;

  return {
    data,
    currentPage: page?.number ?? 0,
    nextPage:
      page && page.number + 1 < page.totalPages
        ? page.number + 1
        : null,
  };
}

export async function fetchPetById(id: string): Promise<Pet[]> {
  const response = await api.get<{ _embedded?: { petParamsResponseList?: Pet[] } }>(
    `/pets?id=${id}`
  );

  return response.data._embedded?.petParamsResponseList || [];
}
