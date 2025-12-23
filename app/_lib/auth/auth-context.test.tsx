import { render, screen, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, AuthContext } from './auth-context';
import { useContext } from 'react';
import { UserStorageError } from './user-storage';

const mockGetStoredUser = jest.fn();
const mockSaveUser = jest.fn();
const mockClearStoredUser = jest.fn();

jest.mock('./user-storage', () => ({
  ...jest.requireActual('./user-storage'),
  getStoredUser: () => mockGetStoredUser(),
  saveUser: (user: unknown) => mockSaveUser(user),
  clearStoredUser: () => mockClearStoredUser(),
}));

jest.mock('../../_entities/pet/query-keys', () => ({
  PUBLIC_QUERY_KEYS: ['pets', 'pet'],
}));

function TestConsumer() {
  const auth = useContext(AuthContext);
  if (!auth) return <div>No context</div>;

  return (
    <div>
      <div data-testid="user">{auth.user ? JSON.stringify(auth.user) : 'null'}</div>
      <div data-testid="isAuthenticated">{String(auth.isAuthenticated)}</div>
      <div data-testid="isLoading">{String(auth.isLoading)}</div>
      <div data-testid="storageError">{auth.storageError?.message || 'null'}</div>
      <button onClick={() => auth.login({ profiles: [{ name: 'Test', description: 'desc', profileType: 'SHELTER' }] })}>
        Login
      </button>
      <button onClick={() => auth.clearAuthState()}>Clear</button>
    </div>
  );
}

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredUser.mockReturnValue({ data: null });
    mockSaveUser.mockReturnValue({ success: true });
    mockClearStoredUser.mockImplementation(() => {});
  });

  describe('AuthProvider', () => {
    it('initializes with no user when storage is empty', async () => {
      renderWithProviders(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
    });

    it('initializes with user when storage has valid data', async () => {
      const storedUser = {
        profiles: [{ name: 'Test', description: 'desc', profileType: 'SHELTER' }],
      };
      mockGetStoredUser.mockReturnValue({ data: storedUser });

      renderWithProviders(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(storedUser));
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
    });

    it('sets storage error when getStoredUser returns error', async () => {
      const error = new UserStorageError('Test error');
      mockGetStoredUser.mockReturnValue({ data: null, error });

      renderWithProviders(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('storageError')).toHaveTextContent('Test error');
      });
    });

    it('login sets user and saves to storage', async () => {
      renderWithProviders(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });

      act(() => {
        screen.getByText('Login').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      });

      expect(mockSaveUser).toHaveBeenCalled();
    });

    it('login sets storage error when save fails', async () => {
      const error = new UserStorageError('Save failed');
      mockSaveUser.mockReturnValue({ success: false, error });

      renderWithProviders(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });

      act(() => {
        screen.getByText('Login').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('storageError')).toHaveTextContent('Save failed');
      });

      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
    });

    it('clearAuthState clears user and storage', async () => {
      const storedUser = {
        profiles: [{ name: 'Test', description: 'desc', profileType: 'SHELTER' }],
      };
      mockGetStoredUser.mockReturnValue({ data: storedUser });

      renderWithProviders(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      });

      act(() => {
        screen.getByText('Clear').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      });

      expect(mockClearStoredUser).toHaveBeenCalled();
    });

    it('responds to auth:logout custom event', async () => {
      const storedUser = {
        profiles: [{ name: 'Test', description: 'desc', profileType: 'SHELTER' }],
      };
      mockGetStoredUser.mockReturnValue({ data: storedUser });

      renderWithProviders(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      });

      act(() => {
        window.dispatchEvent(new CustomEvent('auth:logout'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      });
    });
  });
});
