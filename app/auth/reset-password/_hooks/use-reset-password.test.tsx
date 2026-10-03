import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useResetPassword } from './use-reset-password';
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

describe('useResetPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls resetPassword and succeeds', async () => {
    mockAccount.resetPassword.mockResolvedValue();

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useResetPassword({ onSuccess }), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      token: 'jwt-token',
      newPassword: 'NewPassword123!',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockAccount.resetPassword).toHaveBeenCalledWith({
      token: 'jwt-token',
      newPassword: 'NewPassword123!',
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it('calls onError on failure', async () => {
    const error = new AxiosError('Bad Request');
    error.response = { status: 400 } as AxiosError['response'];
    mockAccount.resetPassword.mockRejectedValue(error);

    const onError = jest.fn();
    const { result } = renderHook(() => useResetPassword({ onError }), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      token: 'invalid-token',
      newPassword: 'NewPassword123!',
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(onError).toHaveBeenCalledWith(
      error,
      { token: 'invalid-token', newPassword: 'NewPassword123!' },
      undefined,
      expect.anything()
    );
  });
});
