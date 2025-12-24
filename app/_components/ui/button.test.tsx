import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './button';

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

describe('Button', () => {
  describe('as button element', () => {
    it('renders with label', () => {
      render(<Button label="Click me" />);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('renders with icon', () => {
      const MockIcon = () => <span data-testid="mock-icon">icon</span>;
      render(<Button icon={<MockIcon />} />);
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('renders with both label and icon', () => {
      const MockIcon = () => <span data-testid="mock-icon">icon</span>;
      render(<Button label="Submit" icon={<MockIcon />} />);
      expect(screen.getByRole('button', { name: /Submit/ })).toBeInTheDocument();
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('handles click events', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button label="Click" onClick={handleClick} />);

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button label="Disabled" disabled onClick={handleClick} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies outline styles when outline prop is true', () => {
      render(<Button label="Outline" outline />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-accent');
      expect(button).toHaveClass('bg-transparent');
    });

    it('applies solid styles when outline prop is false', () => {
      render(<Button label="Solid" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-accent');
    });

    it('applies custom className', () => {
      render(<Button label="Custom" className="custom-class" />);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('supports different button types', () => {
      render(<Button label="Submit" type="submit" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('renders icon-only button', () => {
      const MockIcon = () => <span data-testid="mock-icon" aria-label="Settings">icon</span>;
      render(<Button icon={<MockIcon />} aria-label="Settings" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('shows loading spinner when isLoading is true', () => {
      render(<Button label="Loading" isLoading />);
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('hides icon when loading', () => {
      const MockIcon = () => <span data-testid="mock-icon">icon</span>;
      render(<Button label="Loading" icon={<MockIcon />} isLoading />);
      expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
    });

    it('applies outline spinner styles when outline and loading', () => {
      render(<Button label="Loading" outline isLoading />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('text-accent');
    });

    it('applies solid spinner styles when not outline and loading', () => {
      render(<Button label="Loading" isLoading />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('text-white');
    });
  });

  describe('as link element', () => {
    it('renders as a link when href is provided', () => {
      render(<Button label="Go Home" href="/" />);
      const link = screen.getByRole('link', { name: 'Go Home' });
      expect(link).toHaveAttribute('href', '/');
    });

    it('applies button styling to link', () => {
      render(<Button label="Link" href="/test" />);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('bg-accent');
    });

    it('applies outline styling to link', () => {
      render(<Button label="Link" href="/test" outline />);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('border-accent');
    });

    it('applies custom className to link', () => {
      render(<Button label="Link" href="/test" className="custom-class" />);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('custom-class');
    });

    it('shows loading spinner in link mode', () => {
      render(<Button label="Link" href="/test" isLoading />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders icon in link mode', () => {
      const MockIcon = () => <span data-testid="mock-icon">icon</span>;
      render(<Button label="Link" href="/test" icon={<MockIcon />} />);
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('disables link interaction when loading', () => {
      render(<Button label="Link" href="/test" isLoading />);

      // Should render as span (not a real link) to prevent navigation
      const element = screen.getByRole('link', { name: /Link/ });
      expect(element.tagName).toBe('SPAN');
      expect(element).not.toHaveAttribute('href');
    });

    it('applies disabled accessibility attributes when loading', () => {
      render(<Button label="Link" href="/test" isLoading />);

      const element = screen.getByRole('link', { name: /Link/ });
      expect(element).toHaveAttribute('aria-disabled', 'true');
      expect(element).toHaveAttribute('tabIndex', '-1');
    });

    it('applies disabled visual styles when loading', () => {
      render(<Button label="Link" href="/test" isLoading />);

      const element = screen.getByRole('link', { name: /Link/ });
      expect(element).toHaveClass('cursor-not-allowed');
      expect(element).toHaveClass('opacity-70');
    });
  });
});
