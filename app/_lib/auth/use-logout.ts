'use client';

import { useMutation } from '@tanstack/react-query';
import { logout } from '@/app/_entities/auth/mutations';
import { useAuth } from './use-auth';
import { useRouter } from 'next/navigation';

interface UseLogoutOptions {
  redirectTo?: string;
  onError?: (error: Error) => void;
}

export function useLogout(options?: UseLogoutOptions) {
  const { logout: clearAuthState } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuthState();
      if (options?.redirectTo) {
        router.push(options.redirectTo);
      }
    },
    onError: (error: Error) => {
      console.error('Logout API call failed:', error);
      clearAuthState();
      if (options?.redirectTo) {
        router.push(options.redirectTo);
      }
      options?.onError?.(error);
    },
  });
}
