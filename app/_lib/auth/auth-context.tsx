'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthResponse } from '@/app/_entities/auth/model';
import { logout as logoutApi } from '@/app/_entities/auth/mutations';
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
  login: (authResponse: AuthResponse) => void;
  logout: () => Promise<void>;
  clearStorageError: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState<UserStorageError | null>(
    null
  );

  const clearAuthState = useCallback(() => {
    clearStoredUser();
    setUser(null);
    setStorageError(null);
  }, []);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
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

  const login = useCallback((authResponse: AuthResponse) => {
    const authUser: AuthUser = { profiles: authResponse.profiles };

    setUser(authUser);

    const result = saveUser(authUser);
    if (!result.success) {
      setStorageError(result.error ?? null);
    } else {
      setStorageError(null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      clearAuthState();
    }
  }, [clearAuthState]);

  const clearStorageError = useCallback(() => {
    setStorageError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      storageError,
      login,
      logout,
      clearStorageError,
    }),
    [user, isLoading, storageError, login, logout, clearStorageError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
