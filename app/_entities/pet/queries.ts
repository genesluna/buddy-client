import api from '@/app/_lib/api/axios-instance';
import { Pet, PetInfiniteResponse } from './model';

interface HalEmbeddedPetsResponse {
  _embedded?: Record<string, Pet[] | undefined>;
}

function extractEmbeddedPets(
  embedded?: Record<string, Pet[] | undefined>
): Pet[] {
  if (!embedded) {
    return [];
  }
  const firstCollection = Object.values(embedded).find(Array.isArray);
  return firstCollection ?? [];
}

export async function fetchPets(params?: string): Promise<{ pets: Pet[] }> {
  const query = params ? (params.startsWith('?') ? params : `?${params}`) : '';
  const response = await api.get<HalEmbeddedPetsResponse>(`/pets${query}`);

  return { pets: extractEmbeddedPets(response.data._embedded) };
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

  const response = await api.get<
    HalEmbeddedPetsResponse & {
      page?: {
        number: number;
        totalPages: number;
        totalElements: number;
        size: number;
      };
    }
  >(url);

  const data = extractEmbeddedPets(response.data._embedded);
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
  const response = await api.get<HalEmbeddedPetsResponse>(`/pets?id=${id}`);

  return extractEmbeddedPets(response.data._embedded);
}
