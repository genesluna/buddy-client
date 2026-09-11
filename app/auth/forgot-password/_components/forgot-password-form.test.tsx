import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ForgotPasswordForm from './forgot-password-form';
import * as accountModule from '../../../_entities/account';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('../../../_entities/account');

const mockAccount = accountModule as jest.Mocked<typeof accountModule>;

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

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email input and buttons', () => {
    render(<ForgotPasswordForm />, { wrapper: createWrapper() });

    expect(screen.getByPlaceholderText('Email cadastrado')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Enviar link de recuperação' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Voltar ao login' })
    ).toBeInTheDocument();
  });

  it('submit button is disabled initially', () => {
    render(<ForgotPasswordForm />, { wrapper: createWrapper() });

    const submitButton = screen.getByRole('button', {
      name: 'Enviar link de recuperação',
    });
    expect(submitButton).toBeDisabled();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />, { wrapper: createWrapper() });

    const emailInput = screen.getByPlaceholderText('Email cadastrado');
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Insira um email válido')).toBeInTheDocument();
    });
  });

  it('submits email and displays success card', async () => {
    mockAccount.requestForgotPassword.mockResolvedValue();

    const user = userEvent.setup();
    render(<ForgotPasswordForm />, { wrapper: createWrapper() });

    const emailInput = screen.getByPlaceholderText('Email cadastrado');
    await user.type(emailInput, 'user@test.com');
    await user.tab();

    const submitButton = screen.getByRole('button', {
      name: 'Enviar link de recuperação',
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Verifique seu email')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Voltar ao login' })
      ).toBeInTheDocument();
    });
  });

  it('navigates to login when clicking voltar ao login', async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />, { wrapper: createWrapper() });

    const backButton = screen.getByRole('button', { name: 'Voltar ao login' });
    await user.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });
});
