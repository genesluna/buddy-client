import { render, screen, fireEvent } from '@testing-library/react';
import { MainNav } from './main-nav';
import { ProfileResponse, ProfileType } from '../../_entities/auth/model';
import * as useAuthModule from '../../_entities/auth/use-auth';
import * as useLogoutModule from '../../_entities/auth/use-logout';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

jest.mock('../../_entities/auth/use-auth');
jest.mock('../../_entities/auth/use-logout');

const mockUseAuth = useAuthModule as jest.Mocked<typeof useAuthModule>;
const mockUseLogout = useLogoutModule as jest.Mocked<typeof useLogoutModule>;

const navLinks = [
  { name: 'home', href: '/' },
  { name: 'pets', href: '/pet' },
  { name: 'login', href: '/auth/login' },
];

describe('MainNav', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLogout.useLogout.mockReturnValue({
      mutate: mockLogout,
      isPending: false,
    } as unknown as ReturnType<typeof useLogoutModule.useLogout>);
  });

  function mockUserWithProfiles(profiles: ProfileResponse[]) {
    mockUseAuth.useAuth.mockReturnValue({
      user: { profiles },
      isAuthenticated: true,
      isLoading: false,
      storageError: null,
      setAuthUser: jest.fn(),
      clearAuthState: jest.fn(),
      clearStorageError: jest.fn(),
    });
  }

  it.each<[ProfileType, string]>([
    ['USER', '🐾 Adotante'],
    ['SHELTER', '🏠 Abrigo'],
    ['ADMIN', '🛡️ Admin'],
  ])('renders %s profile badge as %s', (profileType, expectedBadge) => {
    mockUserWithProfiles([
      { name: 'Conta Teste', description: 'Descrição', profileType },
    ]);

    render(<MainNav navLinks={navLinks} />);

    fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));

    expect(screen.getByText(expectedBadge)).toBeInTheDocument();
    if (profileType === 'ADMIN') {
      expect(screen.queryByText('🐾 Adotante')).not.toBeInTheDocument();
    }
  });

  it('shows informative notice without /profile/create link when profiles is empty and supports logout', () => {
    mockUserWithProfiles([]);

    render(<MainNav navLinks={navLinks} />);

    fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));

    expect(
      screen.getByText('Nenhum perfil cadastrado ainda')
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /perfil/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /sair/i }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
