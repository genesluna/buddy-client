import axiosMockAdapter from 'axios-mock-adapter';
import api from '@/app/_lib/api/axios-instance';
import { fetchPets, fetchPetsInfinite, fetchPetById } from './queries';
import { Pet } from './model';

describe('pet queries', () => {
  let mock: axiosMockAdapter;

  const mockPet: Pet = {
    id: 'pet-uuid-1',
    shelterId: 'shelter-uuid-1',
    name: 'Rex',
    avatar: 'https://example.com/avatar.jpg',
    specie: 'DOG',
    gender: 'MALE',
    birthDate: '2022-01-01',
    location: 'São Paulo, SP',
    weight: 12.5,
    description: 'Cachorro dócil e carinhoso',
    shelterResponseCompact: {
      id: 'shelter-uuid-1',
      name: 'Abrigo Esperança',
      avatar: 'https://example.com/shelter.jpg',
      email: 'abrigo@email.com',
      phoneNumber: '11999999999',
      location: 'São Paulo, SP',
    },
    images: [],
  };

  beforeEach(() => {
    mock = new axiosMockAdapter(api);
  });

  afterEach(() => {
    mock.restore();
  });

  describe('fetchPets', () => {
    it('returns pets list when API returns embedded list', async () => {
      mock.onGet(/\/pets.*/).reply(200, {
        _embedded: {
          petParamsResponseList: [mockPet],
        },
      });

      const result = await fetchPets();
      expect(result.pets).toEqual([mockPet]);
    });

    it('returns empty array when _embedded is missing', async () => {
      mock.onGet(/\/pets.*/).reply(200, {});

      const result = await fetchPets();
      expect(result.pets).toEqual([]);
    });
  });

  describe('fetchPetsInfinite', () => {
    it('returns paginated data with nextPage when more pages exist', async () => {
      mock.onGet(/\/pets.*/).reply(200, {
        _embedded: {
          petParamsResponseList: [mockPet],
        },
        page: {
          number: 0,
          totalPages: 3,
          totalElements: 30,
          size: 10,
        },
      });

      const result = await fetchPetsInfinite(0, '', 10);
      expect(result.data).toEqual([mockPet]);
      expect(result.currentPage).toBe(0);
      expect(result.nextPage).toBe(1);
    });

    it('returns null nextPage on last page', async () => {
      mock.onGet(/\/pets.*/).reply(200, {
        _embedded: {
          petParamsResponseList: [mockPet],
        },
        page: {
          number: 2,
          totalPages: 3,
          totalElements: 30,
          size: 10,
        },
      });

      const result = await fetchPetsInfinite(2, '', 10);
      expect(result.nextPage).toBeNull();
    });

    it('returns empty array when database is empty and _embedded is not present', async () => {
      mock.onGet(/\/pets.*/).reply(200, {
        page: {
          number: 0,
          totalPages: 0,
          totalElements: 0,
          size: 10,
        },
      });

      const result = await fetchPetsInfinite(0, '', 10);
      expect(result.data).toEqual([]);
      expect(result.nextPage).toBeNull();
    });
  });

  describe('fetchPetById', () => {
    it('returns pet details when found', async () => {
      mock.onGet('/pets?id=pet-uuid-1').reply(200, {
        _embedded: {
          petParamsResponseList: [mockPet],
        },
      });

      const result = await fetchPetById('pet-uuid-1');
      expect(result).toEqual([mockPet]);
    });
  });
});
