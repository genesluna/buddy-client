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
  images: { imageUrl: string }[];
  shelterResponseCompact: { nameShelter: string; avatar: string };
}
