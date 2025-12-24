'use client';

import { useMutation } from '@tanstack/react-query';
import { login, AuthRequest, useAuth } from '@/app/_entities/auth';

interface UseLoginOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useLogin(options?: UseLoginOptions) {
  const { setAuthUser } = useAuth();

  return useMutation({
    mutationFn: (credentials: AuthRequest) => login(credentials),
    onSuccess: (data) => {
      setAuthUser(data);
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}
