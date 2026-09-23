import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { resetPassword, ResetPasswordRequest } from '@/app/_entities/account';

export function useResetPassword(
  options?: UseMutationOptions<void, Error, ResetPasswordRequest>
) {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
    ...options,
  });
}
