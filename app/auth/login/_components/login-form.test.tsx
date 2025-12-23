import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/app/_lib/auth/auth-context';
import LoginForm from './login-form';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    );
  };
}

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<LoginForm />, { wrapper: createWrapper() });

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resetar a senha' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrar novo abrigo' })).toBeInTheDocument();
  });

  it('submit button is disabled initially', () => {
    render(<LoginForm />, { wrapper: createWrapper() });

    const submitButton = screen.getByRole('button', { name: 'Entrar' });
    expect(submitButton).toBeDisabled();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginForm />, { wrapper: createWrapper() });

    const emailInput = screen.getByPlaceholderText('Email');
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Insira um email válido')).toBeInTheDocument();
    });
  });

  it('shows validation error for short password', async () => {
    const user = userEvent.setup();
    render(<LoginForm />, { wrapper: createWrapper() });

    const passwordInput = screen.getByPlaceholderText('Senha');
    await user.type(passwordInput, '1234567');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('A senha deve ter pelo menos 8 caracteres')).toBeInTheDocument();
    });
  });

  it('navigates to reset-password when clicking "Resetar a senha"', async () => {
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush,
    });

    const user = userEvent.setup();
    render(<LoginForm />, { wrapper: createWrapper() });

    const resetButton = screen.getByRole('button', { name: 'Resetar a senha' });
    await user.click(resetButton);

    expect(mockPush).toHaveBeenCalledWith('/auth/reset-password');
  });

  it('navigates to register when clicking "Registrar novo abrigo"', async () => {
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush,
    });

    const user = userEvent.setup();
    render(<LoginForm />, { wrapper: createWrapper() });

    const registerButton = screen.getByRole('button', { name: 'Registrar novo abrigo' });
    await user.click(registerButton);

    expect(mockPush).toHaveBeenCalledWith('/auth/register');
  });

  it('all inputs have correct types', () => {
    render(<LoginForm />, { wrapper: createWrapper() });

    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email');
    expect(screen.getByPlaceholderText('Senha')).toHaveAttribute('type', 'password');
  });

  it('all inputs have correct autocomplete attributes', () => {
    render(<LoginForm />, { wrapper: createWrapper() });

    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByPlaceholderText('Senha')).toHaveAttribute('autocomplete', 'current-password');
  });
});
