export interface Shelter {
  nameShelter: string;
  avatar: string;
}

export interface ShelterFull extends Shelter {
  id: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  description?: string;
}
