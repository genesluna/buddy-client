import axiosMockAdapter from 'axios-mock-adapter';
import api from '@/app/_lib/api/axios-instance';
import { fetchActiveTerms } from './queries';
import { TermsVersionResponse } from './model';

describe('terms queries', () => {
  let mock: axiosMockAdapter;

  beforeEach(() => {
    mock = new axiosMockAdapter(api);
  });

  afterEach(() => {
    mock.restore();
  });

  describe('fetchActiveTerms', () => {
    it('should return active terms data successfully', async () => {
      const mockResponse: TermsVersionResponse = {
        termsVersionId: '123e4567-e89b-12d3-a456-426614174000',
        versionTag: 'v1.0.0',
        content: '# Termos de Uso\n\nConteúdo dos termos...',
        isActive: true,
        publicationDate: '2026-08-26',
      };

      mock.onGet('/v1/terms/active').reply(200, mockResponse);

      const result = await fetchActiveTerms();
      expect(result).toEqual(mockResponse);
      expect(result.versionTag).toBe('v1.0.0');
    });

    it('should throw error when api returns error', async () => {
      mock.onGet('/v1/terms/active').reply(500);

      await expect(fetchActiveTerms()).rejects.toThrow();
    });
  });
});
