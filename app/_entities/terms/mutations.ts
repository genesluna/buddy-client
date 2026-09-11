import api from '@/app/_lib/api/axios-instance';

export async function acceptTerms(): Promise<void> {
  await api.post('/terms/accept');
}
