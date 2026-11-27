import api from '@/app/_lib/api/axios-instance';
import {
  AccountRequest,
  ConfirmEmailRequest,
  ForgotPasswordRequest,
  ResendVerificationRequest,
  ResetPasswordRequest,
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

export async function requestForgotPassword(
  data: ForgotPasswordRequest
): Promise<void> {
  await api.post('/accounts/password/forgot', data);
}

export async function resetPassword(
  data: ResetPasswordRequest
): Promise<void> {
  await api.post('/accounts/password/reset', data);
}
