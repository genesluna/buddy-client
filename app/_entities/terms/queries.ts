import api from '@/app/_lib/api/axios-instance';
import { TermsVersionResponse } from './model';

export async function fetchActiveTerms(): Promise<TermsVersionResponse> {
  const response = await api.get<TermsVersionResponse>('/v1/terms/active');
  return response.data;
}
