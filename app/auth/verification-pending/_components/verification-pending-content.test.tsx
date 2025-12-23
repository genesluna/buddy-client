import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VerificationPendingContent from './verification-pending-content';
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

describe('VerificationPendingContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReturnValue(null);
  });

  it('renders the verification pending message', () => {
    render(<VerificationPendingContent />, { wrapper: createWrapper() });

    expect(screen.getByText('Verifique seu email')).toBeInTheDocument();
    expect(screen.getByText(/Enviamos um link de verificação/)).toBeInTheDocument();
  });

  it('renders email input and resend button', () => {
    render(<VerificationPendingContent />, { wrapper: createWrapper() });

    expect(screen.getByPlaceholderText('Seu email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reenviar email de verificação' })).toBeInTheDocument();
  });

  it('pre-fills email from query parameter', () => {
    mockGet.mockReturnValue('test@example.com');

    render(<VerificationPendingContent />, { wrapper: createWrapper() });

    const emailInput = screen.getByPlaceholderText('Seu email') as HTMLInputElement;
    expect(emailInput.value).toBe('test@example.com');
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<VerificationPendingContent />, { wrapper: createWrapper() });

    const emailInput = screen.getByPlaceholderText('Seu email');
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Insira um email válido')).toBeInTheDocument();
    });
  });

  it('calls requestEmailVerification on valid form submission', async () => {
    mockAccountMutations.requestEmailVerification.mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<VerificationPendingContent />, { wrapper: createWrapper() });

    const emailInput = screen.getByPlaceholderText('Seu email');

    await user.type(emailInput, 'test@test.com');
    await user.tab();

    const submitButton = screen.getByRole('button', { name: 'Reenviar email de verificação' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAccountMutations.requestEmailVerification).toHaveBeenCalledWith({
        email: 'test@test.com',
      });
    });
  });

  it('shows success message after resending email', async () => {
    mockAccountMutations.requestEmailVerification.mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<VerificationPendingContent />, { wrapper: createWrapper() });

    const emailInput = screen.getByPlaceholderText('Seu email');

    await user.type(emailInput, 'test@test.com');
    await user.tab();

    const submitButton = screen.getByRole('button', { name: 'Reenviar email de verificação' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email de verificação reenviado com sucesso!')).toBeInTheDocument();
    });
  });

  it('shows error message on email not found (404)', async () => {
    const axiosError = new AxiosError('Not Found');
    axiosError.response = { status: 404 } as AxiosError['response'];
    mockAccountMutations.requestEmailVerification.mockRejectedValue(axiosError);

    const user = userEvent.setup();
    render(<VerificationPendingContent />, { wrapper: createWrapper() });

    const emailInput = screen.getByPlaceholderText('Seu email');

    await user.type(emailInput, 'notfound@test.com');
    await user.tab();

    const submitButton = screen.getByRole('button', { name: 'Reenviar email de verificação' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email não encontrado. Verifique se digitou corretamente.')).toBeInTheDocument();
    });
  });

  it('shows error message on rate limit (429)', async () => {
    const axiosError = new AxiosError('Too Many Requests');
    axiosError.response = { status: 429 } as AxiosError['response'];
    mockAccountMutations.requestEmailVerification.mockRejectedValue(axiosError);

    const user = userEvent.setup();
    render(<VerificationPendingContent />, { wrapper: createWrapper() });

    const emailInput = screen.getByPlaceholderText('Seu email');

    await user.type(emailInput, 'test@test.com');
    await user.tab();

    const submitButton = screen.getByRole('button', { name: 'Reenviar email de verificação' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Muitas tentativas. Aguarde antes de tentar novamente.')).toBeInTheDocument();
    });
  });

  it('navigates to login when clicking "Ir para login"', async () => {
    const user = userEvent.setup();
    render(<VerificationPendingContent />, { wrapper: createWrapper() });

    const loginButton = screen.getByRole('button', { name: 'Ir para login' });
    await user.click(loginButton);

    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });

  it('disables submit button while submitting', async () => {
    let resolveResend: (value: unknown) => void;
    mockAccountMutations.requestEmailVerification.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveResend = resolve;
        })
    );

    const user = userEvent.setup();
    render(<VerificationPendingContent />, { wrapper: createWrapper() });

    const emailInput = screen.getByPlaceholderText('Seu email');

    await user.type(emailInput, 'test@test.com');
    await user.tab();

    const submitButton = screen.getByRole('button', { name: 'Reenviar email de verificação' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    resolveResend!(undefined);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
