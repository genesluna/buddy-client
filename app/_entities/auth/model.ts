export interface AuthRequest {
  email: string;
  password: string;
}

export interface ProfileResponse {
  name: string;
  description: string;
  profileType: string;
}

export interface AuthResponse {
  profiles: ProfileResponse[];
  accessToken: string;
  refreshToken: string;
}
