import MockAdapter from 'axios-mock-adapter';
import { AccountRequest } from './model';

jest.mock('../../_lib/api/axios-instance', () => {
  const axios = jest.requireActual('axios');
  return {
    __esModule: true,
    default: axios.create(),
  };
});

import api from '../../_lib/api/axios-instance';
import {
  registerAccount,
  requestEmailVerification,
  confirmEmailVerification,
} from './mutations';

describe('account mutations', () => {
  let mockApi: MockAdapter;

  const validAccountData: AccountRequest = {
    email: 'test@test.com',
    phoneNumber: '11999999999',
    password: 'password123',
    termsOfUseAndPrivacyConsent: true,
  };

  beforeEach(() => {
    mockApi = new MockAdapter(api);
  });

  afterEach(() => {
    mockApi.restore();
  });

  async function expectHttpError(
    promise: Promise<unknown>,
    expectedStatus: number
  ) {
    await expect(promise).rejects.toMatchObject({
      response: { status: expectedStatus },
    });
  }

  describe('registerAccount', () => {
    const endpoint = '/accounts/register';

    it('calls correct endpoint with account data', async () => {
      mockApi.onPost(endpoint).reply(201);

      await registerAccount(validAccountData);

      expect(mockApi.history.post[0].url).toBe(endpoint);
      expect(JSON.parse(mockApi.history.post[0].data)).toEqual(validAccountData);
    });

    it('throws error on duplicate email (409)', async () => {
      mockApi.onPost(endpoint).reply(409, { message: 'Email already exists' });
      await expectHttpError(registerAccount(validAccountData), 409);
    });

    it('throws error on invalid data (400)', async () => {
      mockApi.onPost(endpoint).reply(400, { message: 'Invalid data' });
      await expectHttpError(
        registerAccount({ ...validAccountData, email: 'invalid' }),
        400
      );
    });
  });

  describe('requestEmailVerification', () => {
    const endpoint = '/accounts/verifications/request';
    const testEmail = { email: 'test@test.com' };

    it('calls correct endpoint with email', async () => {
      mockApi.onPost(endpoint).reply(200);

      await requestEmailVerification(testEmail);

      expect(mockApi.history.post[0].url).toBe(endpoint);
      expect(JSON.parse(mockApi.history.post[0].data)).toEqual(testEmail);
    });

    it('throws error on email not found (404)', async () => {
      mockApi.onPost(endpoint).reply(404, { message: 'Email not found' });
      await expectHttpError(requestEmailVerification(testEmail), 404);
    });

    it('throws error on rate limit (429)', async () => {
      mockApi.onPost(endpoint).reply(429, { message: 'Too many requests' });
      await expectHttpError(requestEmailVerification(testEmail), 429);
    });
  });

  describe('confirmEmailVerification', () => {
    const endpoint = '/accounts/verifications/confirm';
    const testToken = { token: 'valid-token-123' };

    it('calls correct endpoint with token', async () => {
      mockApi.onPost(endpoint).reply(200);

      await confirmEmailVerification(testToken);

      expect(mockApi.history.post[0].url).toBe(endpoint);
      expect(JSON.parse(mockApi.history.post[0].data)).toEqual(testToken);
    });

    it('throws error on invalid token (400)', async () => {
      mockApi.onPost(endpoint).reply(400, { message: 'Invalid or expired token' });
      await expectHttpError(confirmEmailVerification({ token: 'expired-token' }), 400);
    });

    it('throws error on verification not found (404)', async () => {
      mockApi.onPost(endpoint).reply(404, { message: 'Verification not found' });
      await expectHttpError(confirmEmailVerification({ token: 'unknown-token' }), 404);
    });
  });
});
