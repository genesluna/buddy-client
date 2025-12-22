import { Shelter } from '../shelter/model';

export interface Pet {
  id: string;
  name: string;
  birthDate: string;
  specie: string;
  gender: string;
  weight: number;
  description: string;
  location: string;
  avatar: string;
  images: PetImage[];
  shelterResponseCompact: Shelter;
}

export interface PetImage {
  imageUrl: string;
}

export interface PetPage {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface PetInfiniteResponse {
  data: Pet[];
  currentPage: number;
  nextPage: number | null;
}
