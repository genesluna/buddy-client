import {
  getStoredUser,
  saveUser,
  clearStoredUser,
  StoredUser,
  UserStorageError,
} from './user-storage';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get store() {
      return store;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('user-storage', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  describe('getStoredUser', () => {
    it('returns null when no user is stored', () => {
      const result = getStoredUser();
      expect(result.data).toBeNull();
      expect(result.error).toBeUndefined();
    });

    it('returns stored user when valid data exists', () => {
      const user: StoredUser = {
        profiles: [
          { name: 'Test', description: 'Test desc', profileType: 'SHELTER' },
        ],
      };
      mockLocalStorage.setItem('buddy_user', JSON.stringify(user));

      const result = getStoredUser();
      expect(result.data).toEqual(user);
      expect(result.error).toBeUndefined();
    });

    it('returns error and clears storage when data is invalid JSON', () => {
      mockLocalStorage.setItem('buddy_user', 'invalid json');

      const result = getStoredUser();
      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(UserStorageError);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('buddy_user');
    });

    it('returns error and clears storage when profiles is missing', () => {
      mockLocalStorage.setItem('buddy_user', JSON.stringify({ foo: 'bar' }));

      const result = getStoredUser();
      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(UserStorageError);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('buddy_user');
    });

    it('returns error and clears storage when profiles is not an array', () => {
      mockLocalStorage.setItem(
        'buddy_user',
        JSON.stringify({ profiles: 'not-array' })
      );

      const result = getStoredUser();
      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(UserStorageError);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('buddy_user');
    });

    it('returns error when profile has wrong property types', () => {
      mockLocalStorage.setItem(
        'buddy_user',
        JSON.stringify({
          profiles: [{ name: 123, description: 'test', profileType: 'SHELTER' }],
        })
      );

      const result = getStoredUser();
      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(UserStorageError);
    });

    it('returns error when profile is missing required properties', () => {
      mockLocalStorage.setItem(
        'buddy_user',
        JSON.stringify({
          profiles: [{ name: 'Test' }],
        })
      );

      const result = getStoredUser();
      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(UserStorageError);
    });

    it('returns error and clears storage when profileType is invalid', () => {
      mockLocalStorage.setItem(
        'buddy_user',
        JSON.stringify({
          profiles: [{ name: 'Test', description: 'desc', profileType: 'INVALID_TYPE' }],
        })
      );

      const result = getStoredUser();
      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(UserStorageError);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('buddy_user');
    });
  });

  describe('saveUser', () => {
    it('saves user successfully', () => {
      const user: StoredUser = {
        profiles: [
          { name: 'Test', description: 'Test desc', profileType: 'SHELTER' },
        ],
      };

      const result = saveUser(user);
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'buddy_user',
        JSON.stringify(user)
      );
    });

    it('returns error when localStorage throws', () => {
      const user: StoredUser = {
        profiles: [
          { name: 'Test', description: 'Test desc', profileType: 'SHELTER' },
        ],
      };

      mockLocalStorage.setItem.mockImplementationOnce(() => {
        throw new Error('Storage full');
      });

      const result = saveUser(user);
      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(UserStorageError);
    });
  });

  describe('clearStoredUser', () => {
    it('removes user from storage', () => {
      mockLocalStorage.setItem('buddy_user', JSON.stringify({ profiles: [] }));

      clearStoredUser();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('buddy_user');
    });

    it('does not throw when removeItem fails', () => {
      mockLocalStorage.removeItem.mockImplementationOnce(() => {
        throw new Error('Remove failed');
      });

      expect(() => clearStoredUser()).not.toThrow();
    });
  });

  describe('SSR behavior', () => {
    const originalWindow = global.window;

    beforeEach(() => {
      // @ts-expect-error - simulating SSR environment
      delete global.window;
    });

    afterEach(() => {
      global.window = originalWindow;
    });

    it('getStoredUser returns null without error in SSR environment', () => {
      const result = getStoredUser();
      expect(result.data).toBeNull();
      expect(result.error).toBeUndefined();
    });

    it('saveUser returns error in SSR environment', () => {
      const result = saveUser({
        profiles: [{ name: 'Test', description: 'desc', profileType: 'SHELTER' }],
      });
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Not in browser environment');
    });

    it('clearStoredUser does not throw in SSR environment', () => {
      expect(() => clearStoredUser()).not.toThrow();
    });
  });
});
