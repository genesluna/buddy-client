export interface AuthRequest {
  email: string;
  password: string;
}

export type ProfileType = 'SHELTER' | 'ADOPTER' | 'ADMIN';

export interface ProfileResponse {
  name: string;
  description: string;
  profileType: ProfileType;
}

export interface AuthResponse {
  profiles: ProfileResponse[];
}
