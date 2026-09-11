import { render, screen } from '@testing-library/react';
import PetDetailsCard from './pet-details-card';
import { Pet } from '@/app/_entities/pet/model';
import * as useAuthModule from '../../../_entities/auth/use-auth';

jest.mock('../../../_entities/auth/use-auth');
const mockUseAuth = useAuthModule as jest.Mocked<typeof useAuthModule>;

const mockPet: Pet = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Rex',
  birthDate: '2023-01-01',
  location: 'São Paulo, SP',
  weight: 15,
  description: 'Um cãozinho muito alegre e carinhoso.',
  gender: 'Macho',
  avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
  images: [],
  castrated: true,
  vaccinated: true,
  wormed: true,
  specialNeeds: false,
  ageRange: 'ADULT',
  size: 'MEDIUM',
  shelterResponseCompact: {
    id: 'shelter-1',
    nameShelter: 'Abrigo Esperança',
    avatar: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
  },
};

describe('PetDetailsCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pet details correctly', () => {
    mockUseAuth.useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      storageError: null,
      setAuthUser: jest.fn(),
      clearAuthState: jest.fn(),
      clearStorageError: jest.fn(),
    });

    render(<PetDetailsCard pet={mockPet} />);

    expect(screen.getByText('Rex')).toBeInTheDocument();
    expect(screen.getByText('São Paulo, SP')).toBeInTheDocument();
    expect(screen.getByText('15 kg')).toBeInTheDocument();
    expect(
      screen.getByText('Um cãozinho muito alegre e carinhoso.')
    ).toBeInTheDocument();
  });

  it('shows login prompt when user is not authenticated', () => {
    mockUseAuth.useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      storageError: null,
      setAuthUser: jest.fn(),
      clearAuthState: jest.fn(),
      clearStorageError: jest.fn(),
    });

    render(<PetDetailsCard pet={mockPet} />);

    const button = screen.getByRole('button', { name: 'Solicitar adoção' });
    expect(button).toBeDisabled();
    expect(
      screen.getByText(/com perfil de adotante para solicitar a adoção/i)
    ).toBeInTheDocument();
  });

  it('shows shelter notice when user is only a shelter', () => {
    mockUseAuth.useAuth.mockReturnValue({
      user: {
        profiles: [
          {
            name: 'Abrigo Amigo',
            description: 'ONG de Resgate',
            profileType: 'SHELTER',
          },
        ],
      },
      isAuthenticated: true,
      isLoading: false,
      storageError: null,
      setAuthUser: jest.fn(),
      clearAuthState: jest.fn(),
      clearStorageError: jest.fn(),
    });

    render(<PetDetailsCard pet={mockPet} />);

    const button = screen.getByRole('button', { name: 'Solicitar adoção' });
    expect(button).toBeDisabled();
    expect(
      screen.getByText(/Apenas perfis de adotante podem solicitar adoção/i)
    ).toBeInTheDocument();
  });

  it('shows create profile prompt when authenticated user has no profiles', () => {
    mockUseAuth.useAuth.mockReturnValue({
      user: {
        profiles: [],
      },
      isAuthenticated: true,
      isLoading: false,
      storageError: null,
      setAuthUser: jest.fn(),
      clearAuthState: jest.fn(),
      clearStorageError: jest.fn(),
    });

    render(<PetDetailsCard pet={mockPet} />);

    const button = screen.getByRole('button', { name: 'Solicitar adoção' });
    expect(button).toBeDisabled();
    expect(
      screen.getByText(/Você ainda não possui um perfil/i)
    ).toBeInTheDocument();
  });

  it('enables adoption button and renders link when user is an adopter', () => {
    mockUseAuth.useAuth.mockReturnValue({
      user: {
        profiles: [
          {
            name: 'João Silva',
            description: 'Amante de animais',
            profileType: 'ADOPTER',
          },
        ],
      },
      isAuthenticated: true,
      isLoading: false,
      storageError: null,
      setAuthUser: jest.fn(),
      clearAuthState: jest.fn(),
      clearStorageError: jest.fn(),
    });

    render(<PetDetailsCard pet={mockPet} />);

    const button = screen.getByRole('button', { name: 'Solicitar adoção' });
    expect(button).not.toBeDisabled();
    const link = screen.getByRole('link', { name: /solicitar adoção/i });
    expect(link).toHaveAttribute(
      'href',
      `/pet/adoption?id=${mockPet.id}&name=${mockPet.name}&gender=${mockPet.gender}`
    );
  });
});
