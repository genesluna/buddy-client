import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ResetPasswordForm from './reset-password-form';
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

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders token input when initialToken is not provided', () => {
    render(<ResetPasswordForm />, { wrapper: createWrapper() });

    expect(
      screen.getByPlaceholderText('Código ou Token de redefinição')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nova senha')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Confirme a nova senha')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Redefinir senha' })
    ).toBeInTheDocument();
  });

  it('hides token input when initialToken is provided', () => {
    render(<ResetPasswordForm initialToken='prefilled-token-123' />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.queryByPlaceholderText('Código ou Token de redefinição')
    ).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nova senha')).toBeInTheDocument();
  });

  it('validates mismatched passwords', async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm initialToken='token-123' />, {
      wrapper: createWrapper(),
    });

    const passwordInput = screen.getByPlaceholderText('Nova senha');
    const confirmInput = screen.getByPlaceholderText('Confirme a nova senha');

    await user.type(passwordInput, 'NewPassword123!');
    await user.type(confirmInput, 'DifferentPassword123!');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument();
    });
  });

  it('submits valid form and navigates to login on success', async () => {
    mockAccount.resetPassword.mockResolvedValue();

    const user = userEvent.setup();
    render(<ResetPasswordForm initialToken='token-123' />, {
      wrapper: createWrapper(),
    });

    const passwordInput = screen.getByPlaceholderText('Nova senha');
    const confirmInput = screen.getByPlaceholderText('Confirme a nova senha');

    await user.type(passwordInput, 'NewPassword123!');
    await user.type(confirmInput, 'NewPassword123!');
    await user.tab();

    const submitButton = screen.getByRole('button', {
      name: 'Redefinir senha',
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAccount.resetPassword).toHaveBeenCalledWith({
        token: 'token-123',
        newPassword: 'NewPassword123!',
      });
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('navigates to login on clicking voltar ao login', async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />, { wrapper: createWrapper() });

    const backButton = screen.getByRole('button', { name: 'Voltar ao login' });
    await user.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });
});
