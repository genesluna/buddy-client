'use client';

import { useMutation } from '@tanstack/react-query';
import { login } from '@/app/_entities/auth/mutations';
import { AuthRequest } from '@/app/_entities/auth/model';
import { useAuth } from '@/app/_lib/auth/use-auth';
import { AxiosError } from 'axios';

interface UseLoginOptions {
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
}

export function useLogin(options?: UseLoginOptions) {
  const { login: setAuthState } = useAuth();

  return useMutation({
    mutationFn: (credentials: AuthRequest) => login(credentials),
    onSuccess: (data) => {
      setAuthState(data);
      options?.onSuccess?.();
    },
    onError: (error: AxiosError) => {
      options?.onError?.(error);
    },
  });
}
