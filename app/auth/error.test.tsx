import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthError from './error';

// Mock error-reporting
jest.mock('../_lib/error-reporting', () => ({
  reportError: jest.fn(),
}));

// Mock next/link - inline definition required due to Jest hoisting
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

describe('AuthError', () => {
  const mockReset = jest.fn();
  const mockReportError = jest.requireMock('../_lib/error-reporting').reportError;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error message', () => {
    const error = new Error('Auth failed');
    render(<AuthError error={error} reset={mockReset} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Erro de autenticação')).toBeInTheDocument();
    expect(
      screen.getByText(/Ocorreu um erro durante o processo de autenticação/)
    ).toBeInTheDocument();
  });

  it('reports error on mount', () => {
    const error = new Error('Auth failed');
    render(<AuthError error={error} reset={mockReset} />);

    expect(mockReportError).toHaveBeenCalledWith(error, {
      source: 'AuthError',
      digest: undefined,
    });
  });

  it('reports error with digest when present', () => {
    const error = Object.assign(new Error('Auth failed'), { digest: 'abc123' });
    render(<AuthError error={error} reset={mockReset} />);

    expect(mockReportError).toHaveBeenCalledWith(error, {
      source: 'AuthError',
      digest: 'abc123',
    });
  });

  it('reports new error when error prop changes', () => {
    const error1 = new Error('First error');
    const error2 = new Error('Second error');
    const { rerender } = render(<AuthError error={error1} reset={mockReset} />);

    expect(mockReportError).toHaveBeenCalledTimes(1);

    rerender(<AuthError error={error2} reset={mockReset} />);

    expect(mockReportError).toHaveBeenCalledTimes(2);
    expect(mockReportError).toHaveBeenLastCalledWith(error2, {
      source: 'AuthError',
      digest: undefined,
    });
  });

  it('displays error digest when present', () => {
    const error = Object.assign(new Error('Auth failed'), { digest: 'xyz789' });
    render(<AuthError error={error} reset={mockReset} />);

    expect(screen.getByText('Código do erro: xyz789')).toBeInTheDocument();
  });

  it('does not display digest section when not present', () => {
    const error = new Error('Auth failed');
    render(<AuthError error={error} reset={mockReset} />);

    expect(screen.queryByText(/Código do erro/)).not.toBeInTheDocument();
  });

  it('calls reset when "Tentar novamente" button is clicked', async () => {
    const user = userEvent.setup();
    const error = new Error('Auth failed');
    render(<AuthError error={error} reset={mockReset} />);

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('renders home link button', () => {
    const error = new Error('Auth failed');
    render(<AuthError error={error} reset={mockReset} />);

    const homeLink = screen.getByRole('link', { name: 'Voltar para home' });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders lock icon', () => {
    const error = new Error('Auth failed');
    const { container } = render(<AuthError error={error} reset={mockReset} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
