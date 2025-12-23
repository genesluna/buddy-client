'use client';

import { useMutation } from '@tanstack/react-query';
import { requestEmailVerification } from '@/app/_entities/account/mutations';
import { ResendVerificationRequest } from '@/app/_entities/account/model';

interface UseResendVerificationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useResendVerification(options?: UseResendVerificationOptions) {
  return useMutation({
    mutationFn: (data: ResendVerificationRequest) => requestEmailVerification(data),
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}
