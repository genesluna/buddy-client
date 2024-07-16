'use server';

import type { Pet } from '@/models/pet';
import axios from 'axios';

export async function fetchPets(params?: string): Promise<Pet[]> {
  const response = await axios.get(`${process.env.API_URL}/pets/all${params}`);

  return response.data as Pet[];
}
