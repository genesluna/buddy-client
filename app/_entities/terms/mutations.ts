import api from '@/app/_lib/api/axios-instance';

export async function acceptTerms(): Promise<void> {
  await api.post('/v1/terms/accept');
}
