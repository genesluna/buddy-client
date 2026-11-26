export interface AuthRequest {
  email: string;
  password: string;
}

export type ProfileType = 'USER' | 'SHELTER' | 'ADMIN';

export const PROFILE_TYPE_LABELS: Record<ProfileType, string> = {
  USER: '🐾 Adotante',
  SHELTER: '🏠 Abrigo',
  ADMIN: '🛡️ Admin',
};

export interface ProfileResponse {
  name: string;
  description: string;
  profileType: ProfileType;
}

export interface AuthResponse {
  profiles: ProfileResponse[];
}
