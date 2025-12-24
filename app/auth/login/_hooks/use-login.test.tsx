import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin } from './use-login';
import * as authMutations from '../../../_entities/auth/mutations';
import * as useAuthModule from '../../../_entities/auth/use-auth';
import { AxiosError } from 'axios';
import { ReactNode } from 'react';

jest.mock('../../../_entities/auth/mutations');
jest.mock('../../../_entities/auth/use-auth');

const mockAuthMutations = authMutations as jest.Mocked<typeof authMutations>;
const mockUseAuth = useAuthModule as jest.Mocked<typeof useAuthModule>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useLogin', () => {
  const mockSetAuthUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      storageError: null,
      setAuthUser: mockSetAuthUser,
      clearAuthState: jest.fn(),
      clearStorageError: jest.fn(),
    });
  });

  it('calls login mutation and sets auth state on success', async () => {
    const authResponse = {
      profiles: [{ name: 'Test', description: 'desc', profileType: 'SHELTER' }],
    };
    mockAuthMutations.login.mockResolvedValue(authResponse);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useLogin({ onSuccess }), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ email: 'test@test.com', password: 'password123' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockAuthMutations.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123',
    });
    expect(mockSetAuthUser).toHaveBeenCalledWith(authResponse);
    expect(onSuccess).toHaveBeenCalled();
  });

  it('calls onError callback on failure', async () => {
    const axiosError = new AxiosError('Unauthorized');
    axiosError.response = { status: 401 } as AxiosError['response'];
    mockAuthMutations.login.mockRejectedValue(axiosError);

    const onError = jest.fn();
    const { result } = renderHook(() => useLogin({ onError }), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ email: 'test@test.com', password: 'wrongpassword' });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(onError).toHaveBeenCalledWith(axiosError);
    expect(mockSetAuthUser).not.toHaveBeenCalled();
  });

  it('does not call setAuthUser on failure', async () => {
    mockAuthMutations.login.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ email: 'test@test.com', password: 'password123' });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockSetAuthUser).not.toHaveBeenCalled();
  });

  it('returns isPending true while mutation is in progress', async () => {
    let resolveLogin: (value: unknown) => void;
    mockAuthMutations.login.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLogin = resolve;
        })
    );

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ email: 'test@test.com', password: 'password123' });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    resolveLogin!({ profiles: [] });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });
});
