import { ProfileResponse } from '@/app/_entities/auth/model';

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

  return obj.profiles.every(
    (profile) =>
      typeof profile === 'object' &&
      profile !== null &&
      'name' in profile &&
      'description' in profile &&
      'profileType' in profile
  );
}

export function getStoredUser(): StoredUser | null {
  if (!isClient()) return null;

  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) return null;

    const parsed: unknown = JSON.parse(stored);

    if (!isValidStoredUser(parsed)) {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
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
