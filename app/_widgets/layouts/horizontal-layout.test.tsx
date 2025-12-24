import React from 'react';
import { render, screen } from '@testing-library/react';
import HorizontalLayout from './horizontal-layout';

// Mock BackButton
jest.mock('../../_components/ui/back-button', () => {
  return function MockBackButton() {
    return <button data-testid="back-button">Back</button>;
  };
});

// Mock next/image - inline definition required due to Jest hoisting
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({
    alt,
    width,
    height,
    className,
    priority,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
  }) {
    return (
      <img
        src="/mock-image"
        alt={alt}
        width={width}
        height={height}
        className={className}
        data-priority={priority}
        data-testid="mock-image"
      />
    );
  },
}));

// Mock next/link - inline definition required due to Jest hoisting
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    className,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
    'aria-label'?: string;
  }) {
    return (
      <a href={href} className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  };
});

describe('HorizontalLayout', () => {
  it('renders children content', () => {
    render(
      <HorizontalLayout>
        <div data-testid="child-content">Child content</div>
      </HorizontalLayout>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders back button', () => {
    render(
      <HorizontalLayout>
        <div>Content</div>
      </HorizontalLayout>
    );

    expect(screen.getByTestId('back-button')).toBeInTheDocument();
  });

  it('renders logo with link to home', () => {
    render(
      <HorizontalLayout>
        <div>Content</div>
      </HorizontalLayout>
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders logo image with correct attributes', () => {
    render(
      <HorizontalLayout>
        <div>Content</div>
      </HorizontalLayout>
    );

    const logo = screen.getByTestId('mock-image');
    expect(logo).toHaveAttribute('alt', 'Logo');
    expect(logo).toHaveAttribute('width', '288');
    expect(logo).toHaveAttribute('height', '288');
    expect(logo).toHaveAttribute('data-priority', 'true');
  });

  it('applies correct layout structure classes', () => {
    const { container } = render(
      <HorizontalLayout>
        <div>Content</div>
      </HorizontalLayout>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'min-h-screen', 'w-full');
  });

  it('renders header with correct styling', () => {
    render(
      <HorizontalLayout>
        <div>Content</div>
      </HorizontalLayout>
    );

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-accent');
  });

  it('renders main element with children', () => {
    render(
      <HorizontalLayout>
        <form>Test form</form>
      </HorizontalLayout>
    );

    const main = screen.getByRole('main');
    expect(main).toContainElement(screen.getByText('Test form'));
  });
});
