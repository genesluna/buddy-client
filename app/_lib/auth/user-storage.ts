'use client';

import { ProfileResponse, ProfileType } from '@/app/_entities/auth/model';

const VALID_PROFILE_TYPES: ProfileType[] = ['SHELTER', 'ADOPTER', 'ADMIN'];

const USER_STORAGE_KEY = 'buddy_user';

export interface StoredUser {
  profiles: ProfileResponse[];
}

export class UserStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserStorageError';
  }
}

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function isValidStoredUser(data: unknown): data is StoredUser {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  if (!('profiles' in obj) || !Array.isArray(obj.profiles)) {
    return false;
  }

  return obj.profiles.every((profile) => {
    if (typeof profile !== 'object' || profile === null) {
      return false;
    }
    const p = profile as Record<string, unknown>;
    return (
      typeof p.name === 'string' &&
      typeof p.description === 'string' &&
      typeof p.profileType === 'string' &&
      VALID_PROFILE_TYPES.includes(p.profileType as ProfileType)
    );
  });
}

export interface GetStoredUserResult {
  data: StoredUser | null;
  error?: UserStorageError;
}

export function getStoredUser(): GetStoredUserResult {
  if (!isClient()) {
    return { data: null };
  }

  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) {
      return { data: null };
    }

    const parsed: unknown = JSON.parse(stored);

    if (!isValidStoredUser(parsed)) {
      localStorage.removeItem(USER_STORAGE_KEY);
      return {
        data: null,
        error: new UserStorageError('Invalid stored user data. Data has been cleared.'),
      };
    }

    return { data: parsed };
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return {
      data: null,
      error: new UserStorageError('Failed to read stored user data. Data has been cleared.'),
    };
  }
}

export function saveUser(
  user: StoredUser
): { success: boolean; error?: UserStorageError } {
  if (!isClient()) {
    return {
      success: false,
      error: new UserStorageError('Not in browser environment'),
    };
  }

  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return { success: true };
  } catch {
    return {
      success: false,
      error: new UserStorageError(
        'Failed to save user data. Storage may be full or disabled.'
      ),
    };
  }
}

export function clearStoredUser(): void {
  if (!isClient()) return;

  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    // Silently fail on removal
  }
}
