import { Pet } from '../_types/pet';
import axios from 'axios';

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export async function fetchPets(params?: string): Promise<{ pets: Pet[] }> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/pets${params}`
  );

  const pets = response.data._embedded.petParamsResponseList;

  return pets;
}

export async function fetchPetsInfinite(
  pageParam: number,
  searchParams: string,
  pageLimit: number
): Promise<{
  data: Pet[];
  currentPage: number;
  nextPage: number | null;
}> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/pets${searchParams}&page=${pageParam}&size=${pageLimit}`
  );

  return {
    data: response.data._embedded?.petParamsResponseList || [],
    currentPage: response.data.page.number,
    nextPage:
      response.data.page.number + 1 < response.data.page.totalPages
        ? response.data.page.number + 1
        : null,
  };
}

export async function fetchPetById(id: string): Promise<Pet[]> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/pets?id=${id}`
  );

  const pet = response.data._embedded.petParamsResponseList;

  return pet;
}
