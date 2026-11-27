import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { requestForgotPassword } from '@/app/_entities/account';
import { ForgotPasswordData } from '../_config/forgot-password-schema';

export function useForgotPassword(
  options?: UseMutationOptions<void, Error, ForgotPasswordData>
) {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => requestForgotPassword(data),
    ...options,
  });
}
