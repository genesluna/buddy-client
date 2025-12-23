import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRegister } from './use-register';
import * as accountMutations from '../../../_entities/account/mutations';
import { AxiosError } from 'axios';
import { ReactNode } from 'react';

jest.mock('../../../_entities/account/mutations');

const mockAccountMutations = accountMutations as jest.Mocked<typeof accountMutations>;

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

describe('useRegister', () => {
  const validAccountData = {
    email: 'test@test.com',
    phoneNumber: '11999999999',
    password: 'password123',
    termsOfUseAndPrivacyConsent: true as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls registerAccount mutation on success', async () => {
    mockAccountMutations.registerAccount.mockResolvedValue(undefined);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useRegister({ onSuccess }), {
      wrapper: createWrapper(),
    });

    result.current.mutate(validAccountData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockAccountMutations.registerAccount).toHaveBeenCalledWith(validAccountData);
    expect(onSuccess).toHaveBeenCalledWith(validAccountData);
  });

  it('calls onError callback on failure', async () => {
    const axiosError = new AxiosError('Conflict');
    axiosError.response = { status: 409 } as AxiosError['response'];
    mockAccountMutations.registerAccount.mockRejectedValue(axiosError);

    const onError = jest.fn();
    const { result } = renderHook(() => useRegister({ onError }), {
      wrapper: createWrapper(),
    });

    result.current.mutate(validAccountData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(onError).toHaveBeenCalledWith(axiosError);
  });

  it('returns isPending true while mutation is in progress', async () => {
    let resolveRegister: (value: unknown) => void;
    mockAccountMutations.registerAccount.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRegister = resolve;
        })
    );

    const { result } = renderHook(() => useRegister(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(validAccountData);

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    resolveRegister!(undefined);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });

  it('handles network errors', async () => {
    mockAccountMutations.registerAccount.mockRejectedValue(new Error('Network error'));

    const onError = jest.fn();
    const { result } = renderHook(() => useRegister({ onError }), {
      wrapper: createWrapper(),
    });

    result.current.mutate(validAccountData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(onError).toHaveBeenCalled();
  });

  it('does not call onSuccess on failure', async () => {
    mockAccountMutations.registerAccount.mockRejectedValue(new Error('Error'));

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useRegister({ onSuccess }), {
      wrapper: createWrapper(),
    });

    result.current.mutate(validAccountData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(onSuccess).not.toHaveBeenCalled();
  });
});
