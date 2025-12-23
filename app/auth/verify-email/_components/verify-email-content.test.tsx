import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VerifyEmailContent from './verify-email-content';
import * as accountMutations from '../../../_entities/account/mutations';
import { AxiosError } from 'axios';

jest.mock('../../../_entities/account/mutations');

const mockPush = jest.fn();
const mockGet = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

const mockAccountMutations = accountMutations as jest.Mocked<typeof accountMutations>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('VerifyEmailContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReturnValue(null);
  });

  it('shows error when token is missing', async () => {
    mockGet.mockReturnValue(null);

    render(<VerifyEmailContent />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Erro na verificação')).toBeInTheDocument();
      expect(screen.getByText('Token de verificação não encontrado.')).toBeInTheDocument();
    });
  });

  it('shows error when token format is invalid', async () => {
    mockGet.mockReturnValue('<script>alert("xss")</script>');

    render(<VerifyEmailContent />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Erro na verificação')).toBeInTheDocument();
      expect(screen.getByText('Formato de token inválido.')).toBeInTheDocument();
    });
  });

  it('shows loading state while verifying', async () => {
    mockGet.mockReturnValue('valid-token-123');
    mockAccountMutations.confirmEmailVerification.mockImplementation(
      () => new Promise(() => {})
    );

    render(<VerifyEmailContent />, { wrapper: createWrapper() });

    expect(screen.getByText('Verificando seu email...')).toBeInTheDocument();
  });

  it('shows success state after verification', async () => {
    mockGet.mockReturnValue('valid-token-123');
    mockAccountMutations.confirmEmailVerification.mockResolvedValue(undefined);

    render(<VerifyEmailContent />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Email verificado!')).toBeInTheDocument();
      expect(screen.getByText('Sua conta foi verificada com sucesso. Você já pode fazer login.')).toBeInTheDocument();
    });
  });

  it('shows error state on invalid token (400)', async () => {
    mockGet.mockReturnValue('expired-token');
    const axiosError = new AxiosError('Bad Request');
    axiosError.response = { status: 400 } as AxiosError['response'];
    mockAccountMutations.confirmEmailVerification.mockRejectedValue(axiosError);

    render(<VerifyEmailContent />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Erro na verificação')).toBeInTheDocument();
      expect(screen.getByText('Token inválido ou expirado.')).toBeInTheDocument();
    });
  });

  it('shows error state on verification not found (404)', async () => {
    mockGet.mockReturnValue('unknown-token');
    const axiosError = new AxiosError('Not Found');
    axiosError.response = { status: 404 } as AxiosError['response'];
    mockAccountMutations.confirmEmailVerification.mockRejectedValue(axiosError);

    render(<VerifyEmailContent />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Erro na verificação')).toBeInTheDocument();
      expect(screen.getByText('Verificação não encontrada.')).toBeInTheDocument();
    });
  });

  it('navigates to login when clicking button after success', async () => {
    mockGet.mockReturnValue('valid-token-123');
    mockAccountMutations.confirmEmailVerification.mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<VerifyEmailContent />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Email verificado!')).toBeInTheDocument();
    });

    const loginButton = screen.getByRole('button', { name: 'Ir para login' });
    await user.click(loginButton);

    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });

  it('navigates to login when clicking button after error', async () => {
    mockGet.mockReturnValue(null);

    const user = userEvent.setup();
    render(<VerifyEmailContent />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Erro na verificação')).toBeInTheDocument();
    });

    const loginButton = screen.getByRole('button', { name: 'Ir para login' });
    await user.click(loginButton);

    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });

  it('calls confirmEmailVerification with correct token', async () => {
    mockGet.mockReturnValue('my-valid-token');
    mockAccountMutations.confirmEmailVerification.mockResolvedValue(undefined);

    render(<VerifyEmailContent />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockAccountMutations.confirmEmailVerification).toHaveBeenCalledWith({
        token: 'my-valid-token',
      });
    });
  });
});
