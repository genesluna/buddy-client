import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axiosMockAdapter from 'axios-mock-adapter';
import api from '@/app/_lib/api/axios-instance';
import TermsModal from './terms-modal';

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
        {children}
      </QueryClientProvider>
    );
  };
}

describe('TermsModal', () => {
  let mock: axiosMockAdapter;

  beforeEach(() => {
    mock = new axiosMockAdapter(api);
    jest.clearAllMocks();
  });

  afterEach(() => {
    mock.restore();
  });

  it('renders nothing when isOpen is false', () => {
    render(<TermsModal isOpen={false} onClose={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal and displays terms content when open', async () => {
    mock.onGet('/v1/terms/active').reply(200, {
      termsVersionId: '123-uuid',
      versionTag: 'v1.0.0',
      content: 'Estes sao os termos oficiais de adocao responsavel.',
      isActive: true,
      publicationDate: '2026-08-26',
    });

    render(<TermsModal isOpen={true} onClose={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Termos de Uso')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Versão: v1.0.0')).toBeInTheDocument();
      expect(
        screen.getByText('Estes sao os termos oficiais de adocao responsavel.')
      ).toBeInTheDocument();
    });
  });

  it('calls onClose when close button or Esc is pressed', async () => {
    const handleClose = jest.fn();
    mock.onGet('/v1/terms/active').reply(200, {
      termsVersionId: '123-uuid',
      versionTag: 'v1.0.0',
      content: 'Conteudo',
      isActive: true,
    });

    render(<TermsModal isOpen={true} onClose={handleClose} />, {
      wrapper: createWrapper(),
    });

    const closeButton = screen.getByRole('button', { name: 'Fechar' });
    await userEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);

    await userEvent.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it('renders and triggers onAccept callback when enabled', async () => {
    const handleAccept = jest.fn();
    mock.onGet('/v1/terms/active').reply(200, {
      termsVersionId: '123-uuid',
      versionTag: 'v1.0.0',
      content: 'Conteudo',
      isActive: true,
    });

    render(
      <TermsModal
        isOpen={true}
        onClose={jest.fn()}
        showAcceptButton={true}
        onAccept={handleAccept}
      />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText('Conteudo')).toBeInTheDocument();
    });

    const acceptButton = screen.getByRole('button', {
      name: 'Aceitar e Continuar',
    });
    await userEvent.click(acceptButton);

    expect(handleAccept).toHaveBeenCalledTimes(1);
  });
});
