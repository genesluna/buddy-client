'use server';
import type { Pet } from '@lib/models/pet';
import axios from 'axios';

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export async function fetchPets(params?: string): Promise<{ pets: Pet[] }> {
  const response = await axios.get(`${process.env.API_URL}/pets${params}`);

  const pets = response.data._embedded.petParamsResponseList;

  return pets;
}

export async function fetchPetsInfinite(
  pageParam: number,
  searchParams: string,
  limit: number
): Promise<{
  data: Pet[];
  currentPage: number;
  nextPage: number | null;
}> {
  //const LIMIT = 8;

  console.log('Chamou');
  console.log(limit);

  const response = await axios.get(
    `${process.env.API_URL}/pets${searchParams}&page=${pageParam}&size=${limit}`
  );

  // await new Promise((resolve) => setTimeout(resolve, 5000));

  return {
    data: response.data._embedded.petParamsResponseList,
    currentPage: response.data.page.number,
    nextPage:
      response.data.page.number + 1 < response.data.page.totalPages
        ? response.data.page.number + 1
        : null,
  };
}
