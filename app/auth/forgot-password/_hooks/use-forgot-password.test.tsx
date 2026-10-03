import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useForgotPassword } from './use-forgot-password';
import * as accountModule from '../../../_entities/account';
import { AxiosError } from 'axios';
import { ReactNode } from 'react';

jest.mock('../../../_entities/account');

const mockAccount = accountModule as jest.Mocked<typeof accountModule>;

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

describe('useForgotPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls requestForgotPassword and succeeds', async () => {
    mockAccount.requestForgotPassword.mockResolvedValue();

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useForgotPassword({ onSuccess }), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ email: 'user@test.com' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockAccount.requestForgotPassword).toHaveBeenCalledWith({
      email: 'user@test.com',
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it('calls onError on failure', async () => {
    const error = new AxiosError('Too Many Requests');
    error.response = { status: 429 } as AxiosError['response'];
    mockAccount.requestForgotPassword.mockRejectedValue(error);

    const onError = jest.fn();
    const { result } = renderHook(() => useForgotPassword({ onError }), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ email: 'user@test.com' });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(onError).toHaveBeenCalledWith(
      error,
      { email: 'user@test.com' },
      undefined,
      expect.anything()
    );
  });
});
