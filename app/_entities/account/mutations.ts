import api from '@/app/_lib/api/axios-instance';
import {
  AccountRequest,
  ConfirmEmailRequest,
  ResendVerificationRequest,
} from './model';

export async function registerAccount(data: AccountRequest): Promise<void> {
  await api.post('/accounts/register', data);
}

export async function requestEmailVerification(
  data: ResendVerificationRequest
): Promise<void> {
  await api.post('/accounts/verifications/request', data);
}

export async function confirmEmailVerification(
  data: ConfirmEmailRequest
): Promise<void> {
  await api.post('/accounts/verifications/confirm', data);
}
