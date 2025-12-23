import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useResendVerification } from './use-resend-verification';
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

describe('useResendVerification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls requestEmailVerification mutation on success', async () => {
    mockAccountMutations.requestEmailVerification.mockResolvedValue(undefined);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useResendVerification({ onSuccess }), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ email: 'test@test.com' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockAccountMutations.requestEmailVerification).toHaveBeenCalledWith({
      email: 'test@test.com',
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it('calls onError callback on failure', async () => {
    const axiosError = new AxiosError('Not Found');
    axiosError.response = { status: 404 } as AxiosError['response'];
    mockAccountMutations.requestEmailVerification.mockRejectedValue(axiosError);

    const onError = jest.fn();
    const { result } = renderHook(() => useResendVerification({ onError }), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ email: 'notfound@test.com' });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(onError).toHaveBeenCalledWith(axiosError);
  });

  it('returns isPending true while mutation is in progress', async () => {
    let resolveResend: (value: unknown) => void;
    mockAccountMutations.requestEmailVerification.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveResend = resolve;
        })
    );

    const { result } = renderHook(() => useResendVerification(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ email: 'test@test.com' });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    resolveResend!(undefined);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });

  it('does not call onSuccess on failure', async () => {
    mockAccountMutations.requestEmailVerification.mockRejectedValue(new Error('Error'));

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useResendVerification({ onSuccess }), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ email: 'test@test.com' });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(onSuccess).not.toHaveBeenCalled();
  });
});
