import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RegisterForm from './register-form';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
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
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<RegisterForm />, { wrapper: createWrapper() });

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Telefone (apenas números)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha (6-16 caracteres)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirme a senha')).toBeInTheDocument();
    expect(screen.getByLabelText(/Li e aceito os/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Criar conta' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Já tenho uma conta' })).toBeInTheDocument();
  });

  it('submit button is disabled initially', () => {
    render(<RegisterForm />, { wrapper: createWrapper() });

    const submitButton = screen.getByRole('button', { name: 'Criar conta' });
    expect(submitButton).toBeDisabled();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />, { wrapper: createWrapper() });

    const emailInput = screen.getByPlaceholderText('Email');
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Insira um email válido')).toBeInTheDocument();
    });
  });

  it('shows validation error for short phone number', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />, { wrapper: createWrapper() });

    const phoneInput = screen.getByPlaceholderText('Telefone (apenas números)');
    await user.type(phoneInput, '12');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('O telefone deve ter pelo menos 4 dígitos')).toBeInTheDocument();
    });
  });

  it('shows validation error for short password', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />, { wrapper: createWrapper() });

    const passwordInput = screen.getByPlaceholderText('Senha (6-16 caracteres)');
    await user.type(passwordInput, '12345');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('A senha deve ter pelo menos 6 caracteres')).toBeInTheDocument();
    });
  });

  it('shows validation error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />, { wrapper: createWrapper() });

    const passwordInput = screen.getByPlaceholderText('Senha (6-16 caracteres)');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirme a senha');

    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'different123');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('As senhas devem ser iguais')).toBeInTheDocument();
    });
  });

  it('renders terms of service and privacy policy links', () => {
    render(<RegisterForm />, { wrapper: createWrapper() });

    const termsLink = screen.getByRole('link', { name: 'Termos de Uso' });
    const privacyLink = screen.getByRole('link', { name: 'Política de Privacidade' });

    expect(termsLink).toHaveAttribute('href', '/terms-of-service');
    expect(termsLink).toHaveAttribute('target', '_blank');
    expect(termsLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(privacyLink).toHaveAttribute('href', '/privacy-policy');
    expect(privacyLink).toHaveAttribute('target', '_blank');
    expect(privacyLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('navigates to login page when clicking "Já tenho uma conta"', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />, { wrapper: createWrapper() });

    const loginButton = screen.getByRole('button', { name: 'Já tenho uma conta' });
    await user.click(loginButton);

    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });

  it('checkbox can be toggled', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />, { wrapper: createWrapper() });

    const termsCheckbox = screen.getByRole('checkbox');
    expect(termsCheckbox).not.toBeChecked();

    await user.click(termsCheckbox);
    expect(termsCheckbox).toBeChecked();

    await user.click(termsCheckbox);
    expect(termsCheckbox).not.toBeChecked();
  });

  it('form has noValidate attribute', () => {
    render(<RegisterForm />, { wrapper: createWrapper() });

    const form = document.querySelector('form');
    expect(form).toHaveAttribute('novalidate');
  });

  it('all inputs have correct types', () => {
    render(<RegisterForm />, { wrapper: createWrapper() });

    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email');
    expect(screen.getByPlaceholderText('Telefone (apenas números)')).toHaveAttribute('type', 'tel');
    expect(screen.getByPlaceholderText('Senha (6-16 caracteres)')).toHaveAttribute('type', 'password');
    expect(screen.getByPlaceholderText('Confirme a senha')).toHaveAttribute('type', 'password');
  });

  it('all inputs have correct autocomplete attributes', () => {
    render(<RegisterForm />, { wrapper: createWrapper() });

    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByPlaceholderText('Telefone (apenas números)')).toHaveAttribute('autocomplete', 'tel');
    expect(screen.getByPlaceholderText('Senha (6-16 caracteres)')).toHaveAttribute('autocomplete', 'new-password');
    expect(screen.getByPlaceholderText('Confirme a senha')).toHaveAttribute('autocomplete', 'new-password');
  });
});
