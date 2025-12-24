'use client';

/**
 * User Storage Module
 *
 * SECURITY NOTES:
 * - Only non-sensitive profile display data is stored (name, description, profileType)
 * - Auth tokens are managed via httpOnly cookies by the backend (not accessible to JS)
 * - No PII, passwords, or sensitive credentials are persisted in localStorage
 * - localStorage is vulnerable to XSS attacks - ensure CSP headers are configured
 *   to mitigate script injection (see next.config.js security headers)
 * - If sensitive data storage becomes necessary, consider:
 *   1. Server-managed httpOnly cookies (preferred for tokens)
 *   2. sessionStorage for non-persistent sensitive data
 *   3. Encryption before persisting (with secure key management)
 */

import { ProfileResponse, ProfileType } from './model';

const VALID_PROFILE_TYPES: ProfileType[] = ['SHELTER', 'ADOPTER', 'ADMIN'];

const USER_STORAGE_KEY = 'buddy_user';

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Stored user data - intentionally limited to non-sensitive profile display info.
 * Auth tokens and credentials are never stored here.
 */
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

/**
 * Type guard for ProfileResponse.
 * Validates all required fields match the ProfileResponse interface from model.ts.
 * Update this guard if ProfileResponse changes to include additional fields
 * (e.g., id, userId, createdAt).
 */
function isProfileResponse(value: unknown): value is ProfileResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  // Validate all required ProfileResponse fields and their types
  const hasValidName = typeof obj.name === 'string' && obj.name.length > 0;
  const hasValidDescription = typeof obj.description === 'string';
  const hasValidProfileType =
    typeof obj.profileType === 'string' &&
    VALID_PROFILE_TYPES.includes(obj.profileType as ProfileType);

  return hasValidName && hasValidDescription && hasValidProfileType;
}

/**
 * Type guard for StoredUser.
 * Validates the structure matches what we expect from localStorage.
 */
function isValidStoredUser(data: unknown): data is StoredUser {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  if (!('profiles' in obj) || !Array.isArray(obj.profiles)) {
    return false;
  }

  // Validate each profile using the ProfileResponse type guard
  return obj.profiles.every(isProfileResponse);
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
  } catch (err) {
    if (isDevelopment) {
      console.error('[user-storage] Failed to read stored user:', err);
    }
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
  } catch (err) {
    if (isDevelopment) {
      console.error('[user-storage] Failed to save user:', err);
    }
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
  } catch (err) {
    // Log in development for debugging, silently fail in production
    if (isDevelopment) {
      console.error('[user-storage] Failed to clear stored user:', err);
    }
  }
}
