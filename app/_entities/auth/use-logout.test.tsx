import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogout } from './use-logout';
import * as authMutations from './mutations';
import * as useAuthModule from './use-auth';
import { AxiosError } from 'axios';
import { ReactNode } from 'react';

jest.mock('./mutations');
jest.mock('./use-auth');
jest.mock('../../_lib/error-reporting', () => ({
  reportError: jest.fn(),
}));

const mockAuthMutations = authMutations as jest.Mocked<typeof authMutations>;
const mockUseAuth = useAuthModule as jest.Mocked<typeof useAuthModule>;

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

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

describe('useLogout', () => {
  const mockClearAuthState = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.useAuth.mockReturnValue({
      user: { profiles: [{ name: 'Test', description: 'desc', profileType: 'SHELTER' }] },
      isAuthenticated: true,
      isLoading: false,
      storageError: null,
      setAuthUser: jest.fn(),
      clearAuthState: mockClearAuthState,
      clearStorageError: jest.fn(),
    });
  });

  it('calls logout mutation and clears auth state on success', async () => {
    mockAuthMutations.logout.mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockAuthMutations.logout).toHaveBeenCalled();
    expect(mockClearAuthState).toHaveBeenCalled();
  });

  it('redirects on success when redirectTo is provided', async () => {
    mockAuthMutations.logout.mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogout({ redirectTo: '/auth/login' }), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });

  it('clears auth state even on API failure (fail-safe logout)', async () => {
    const axiosError = new AxiosError('Server error');
    axiosError.response = { status: 500 } as AxiosError['response'];
    mockAuthMutations.logout.mockRejectedValue(axiosError);

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Fail-safe: auth state is cleared even when server logout fails
    expect(mockClearAuthState).toHaveBeenCalled();
  });

  it('calls onError callback on failure', async () => {
    const axiosError = new AxiosError('Server error');
    mockAuthMutations.logout.mockRejectedValue(axiosError);

    const onError = jest.fn();

    const { result } = renderHook(() => useLogout({ onError }), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(onError).toHaveBeenCalledWith(axiosError);
  });

  it('redirects on error when redirectTo is provided (fail-safe logout)', async () => {
    mockAuthMutations.logout.mockRejectedValue(new AxiosError('Error'));

    const { result } = renderHook(() => useLogout({ redirectTo: '/auth/login' }), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });
});
