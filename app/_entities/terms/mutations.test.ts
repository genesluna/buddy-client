import axiosMockAdapter from 'axios-mock-adapter';
import api from '@/app/_lib/api/axios-instance';
import { acceptTerms } from './mutations';

describe('terms mutations', () => {
  let mock: axiosMockAdapter;

  beforeEach(() => {
    mock = new axiosMockAdapter(api);
  });

  afterEach(() => {
    mock.restore();
  });

  describe('acceptTerms', () => {
    it('should call accept terms endpoint successfully', async () => {
      mock.onPost('/terms/accept').reply(200);

      await expect(acceptTerms()).resolves.toBeUndefined();
    });

    it('should throw error when accept fails', async () => {
      mock.onPost('/terms/accept').reply(401);

      await expect(acceptTerms()).rejects.toThrow();
    });
  });
});
