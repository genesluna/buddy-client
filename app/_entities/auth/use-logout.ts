'use client';

import { useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { logout } from './mutations';
import { useAuth } from './use-auth';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { reportError } from '@/app/_lib/error-reporting';

interface UseLogoutOptions {
  redirectTo?: string;
  /** Called when the logout API fails. Note: local auth state is still cleared (fail-safe logout). */
  onError?: (error: AxiosError) => void;
}

/**
 * Logout hook with fail-safe behavior.
 *
 * DESIGN DECISION: Fail-safe logout
 * - Local auth state is ALWAYS cleared, even if the server logout fails
 * - This ensures users can log out even when the server is unreachable
 * - Server sessions will expire naturally via token TTL
 * - This prioritizes user experience (never "stuck" logged in) over
 *   perfect client-server consistency
 *
 * If strict server-client consistency is required in the future,
 * consider adding a retry mechanism before clearing local state.
 */
export function useLogout(options?: UseLogoutOptions) {
  const { clearAuthState } = useAuth();
  const router = useRouter();

  // Use ref to avoid stale closures in mutation callbacks
  // Dependencies use individual properties to avoid re-runs when inline objects are passed
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.redirectTo, options?.onError]);

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuthState();
      if (optionsRef.current?.redirectTo) {
        router.push(optionsRef.current.redirectTo);
      }
    },
    onError: (error: AxiosError) => {
      // Report error for monitoring but proceed with local logout (fail-safe)
      reportError(error, {
        source: 'useLogout',
        message: 'Logout API failed, proceeding with local logout (fail-safe)',
        status: error.response?.status,
      });

      // Fail-safe: clear local auth state even if server logout failed
      // User intent to log out takes priority over server confirmation
      clearAuthState();

      if (optionsRef.current?.redirectTo) {
        router.push(optionsRef.current.redirectTo);
      }

      // Notify caller of the error (they can show a toast if needed)
      optionsRef.current?.onError?.(error);
    },
  });
}
