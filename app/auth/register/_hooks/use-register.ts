'use client';

import { useMutation } from '@tanstack/react-query';
import { registerAccount } from '@/app/_entities/account/mutations';
import { AccountRequest } from '@/app/_entities/account/model';

interface UseRegisterOptions {
  onSuccess?: (data: AccountRequest) => void;
  onError?: (error: Error) => void;
}

export function useRegister(options?: UseRegisterOptions) {
  return useMutation({
    mutationFn: (data: AccountRequest) => registerAccount(data),
    onSuccess: (_data, variables) => {
      options?.onSuccess?.(variables);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}
