'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PUBLIC_QUERY_KEYS } from '@/app/_lib/query-keys';
import { AuthResponse } from '@/app/_entities/auth/model';
import {
  clearStoredUser,
  getStoredUser,
  saveUser,
  StoredUser,
  UserStorageError,
} from './user-storage';

export type AuthUser = StoredUser;

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  storageError: UserStorageError | null;
  setAuthUser: (authResponse: AuthResponse) => void;
  clearAuthState: () => Promise<void>;
  clearStorageError: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState<UserStorageError | null>(
    null
  );

  const clearAuthState = useCallback(async () => {
    clearStoredUser();
    setUser(null);
    setStorageError(null);
    await queryClient.cancelQueries();
    queryClient.removeQueries({
      predicate: (query) => {
        const key = query.queryKey[0];
        return (
          typeof key === 'string' &&
          !PUBLIC_QUERY_KEYS.includes(key as (typeof PUBLIC_QUERY_KEYS)[number])
        );
      },
    });
  }, [queryClient]);

  useEffect(() => {
    try {
      const result = getStoredUser();
      if (result.data) {
        setUser(result.data);
      }
      if (result.error) {
        setStorageError(result.error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleLogoutEvent = () => {
      clearAuthState();
    };

    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, [clearAuthState]);

  const setAuthUser = useCallback((authResponse: AuthResponse) => {
    const authUser: AuthUser = { profiles: authResponse.profiles };

    setUser(authUser);

    const result = saveUser(authUser);
    if (!result.success) {
      setStorageError(result.error ?? null);
    } else {
      setStorageError(null);
    }
  }, []);

  const clearStorageError = useCallback(() => {
    setStorageError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      storageError,
      setAuthUser,
      clearAuthState,
      clearStorageError,
    }),
    [user, isLoading, storageError, setAuthUser, clearAuthState, clearStorageError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
