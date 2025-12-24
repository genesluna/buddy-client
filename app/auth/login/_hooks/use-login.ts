'use client';

import { useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login, AuthRequest, useAuth } from '@/app/_entities/auth';

interface UseLoginOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useLogin(options?: UseLoginOptions) {
  const { setAuthUser } = useAuth();

  // Use ref to avoid stale closures in mutation callbacks
  // Dependencies use individual properties to avoid re-runs when inline objects are passed
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.onSuccess, options?.onError]);

  return useMutation({
    mutationFn: (credentials: AuthRequest) => login(credentials),
    onSuccess: (data) => {
      setAuthUser(data);
      optionsRef.current?.onSuccess?.();
    },
    onError: (error: Error) => {
      optionsRef.current?.onError?.(error);
    },
  });
}
