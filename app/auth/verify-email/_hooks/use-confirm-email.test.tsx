import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useConfirmEmail } from './use-confirm-email';
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

describe('useConfirmEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls confirmEmailVerification mutation on success', async () => {
    mockAccountMutations.confirmEmailVerification.mockResolvedValue(undefined);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useConfirmEmail({ onSuccess }), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ token: 'valid-token' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockAccountMutations.confirmEmailVerification).toHaveBeenCalledWith({
      token: 'valid-token',
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it('calls onError callback on failure', async () => {
    const axiosError = new AxiosError('Bad Request');
    axiosError.response = { status: 400 } as AxiosError['response'];
    mockAccountMutations.confirmEmailVerification.mockRejectedValue(axiosError);

    const onError = jest.fn();
    const { result } = renderHook(() => useConfirmEmail({ onError }), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ token: 'invalid-token' });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(onError).toHaveBeenCalledWith(axiosError);
  });

  it('returns isPending true while mutation is in progress', async () => {
    let resolveConfirm: (value: unknown) => void;
    mockAccountMutations.confirmEmailVerification.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveConfirm = resolve;
        })
    );

    const { result } = renderHook(() => useConfirmEmail(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ token: 'test-token' });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    resolveConfirm!(undefined);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });

  it('does not call onSuccess on failure', async () => {
    mockAccountMutations.confirmEmailVerification.mockRejectedValue(new Error('Error'));

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useConfirmEmail({ onSuccess }), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ token: 'test-token' });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(onSuccess).not.toHaveBeenCalled();
  });
});
