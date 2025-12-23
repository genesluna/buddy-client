import api from '@/app/_lib/api/axios-instance';
import { AuthRequest, AuthResponse } from './model';

export async function login(credentials: AuthRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
}

export async function refreshToken(): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/refresh');
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}
