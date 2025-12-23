'use client';

import { useMutation } from '@tanstack/react-query';
import { confirmEmailVerification } from '@/app/_entities/account/mutations';
import { ConfirmEmailRequest } from '@/app/_entities/account/model';

interface UseConfirmEmailOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useConfirmEmail(options?: UseConfirmEmailOptions) {
  return useMutation({
    mutationFn: (data: ConfirmEmailRequest) => confirmEmailVerification(data),
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}
