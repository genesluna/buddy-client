import React from 'react';
import { render, screen } from '@testing-library/react';
import VerticalLayout from './vertical-layout';

// Mock PageHeader
jest.mock('../page-header', () => ({
  PageHeader: function MockPageHeader() {
    return <header data-testid="page-header">Header</header>;
  },
}));

// Mock PageFooter
jest.mock('../page-footer', () => ({
  PageFooter: function MockPageFooter() {
    return <footer data-testid="page-footer">Footer</footer>;
  },
}));

describe('VerticalLayout', () => {
  it('renders children content', () => {
    render(
      <VerticalLayout>
        <div data-testid="child-content">Child content</div>
      </VerticalLayout>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders page header', () => {
    render(
      <VerticalLayout>
        <div>Content</div>
      </VerticalLayout>
    );

    expect(screen.getByTestId('page-header')).toBeInTheDocument();
  });

  it('renders page footer', () => {
    render(
      <VerticalLayout>
        <div>Content</div>
      </VerticalLayout>
    );

    expect(screen.getByTestId('page-footer')).toBeInTheDocument();
  });

  it('renders main element containing children', () => {
    render(
      <VerticalLayout>
        <section>Test section</section>
      </VerticalLayout>
    );

    const main = screen.getByRole('main');
    expect(main).toContainElement(screen.getByText('Test section'));
  });

  it('applies correct main styling classes', () => {
    render(
      <VerticalLayout>
        <div>Content</div>
      </VerticalLayout>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveClass('flex', 'flex-1', 'flex-col');
  });

  it('renders elements in correct order: header, main, footer', () => {
    render(
      <VerticalLayout>
        <div>Content</div>
      </VerticalLayout>
    );

    const header = screen.getByTestId('page-header');
    const main = screen.getByRole('main');
    const footer = screen.getByTestId('page-footer');

    expect(header).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(footer).toBeInTheDocument();

    // Verify DOM order by checking sibling relationships
    expect(header.compareDocumentPosition(main)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(main.compareDocumentPosition(footer)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
});
