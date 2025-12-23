import MockAdapter from 'axios-mock-adapter';
import api from '@/app/_lib/api/axios-instance';
import { login, logout } from './mutations';

describe('auth mutations', () => {
  let mockApi: MockAdapter;

  beforeAll(() => {
    mockApi = new MockAdapter(api);
  });

  afterAll(() => {
    mockApi.restore();
  });

  beforeEach(() => {
    mockApi.reset();
  });

  describe('login', () => {
    it('calls correct endpoint with credentials', async () => {
      const authResponse = {
        profiles: [{ name: 'Test', description: 'desc', profileType: 'SHELTER' }],
      };
      mockApi.onPost('/auth/login').reply(200, authResponse);

      const result = await login({ email: 'test@test.com', password: 'password123' });

      expect(result).toEqual(authResponse);
      expect(mockApi.history.post[0].url).toBe('/auth/login');
      expect(JSON.parse(mockApi.history.post[0].data)).toEqual({
        email: 'test@test.com',
        password: 'password123',
      });
    });

    it('throws error on failed login', async () => {
      mockApi.onPost('/auth/login').reply(401, { message: 'Invalid credentials' });

      await expect(login({ email: 'test@test.com', password: 'wrong' })).rejects.toMatchObject({
        response: { status: 401 },
      });
    });
  });

  describe('logout', () => {
    it('calls correct endpoint', async () => {
      mockApi.onPost('/auth/logout').reply(200);

      await logout();

      expect(mockApi.history.post[0].url).toBe('/auth/logout');
    });

    it('throws error on failed logout', async () => {
      mockApi.onPost('/auth/logout').reply(500, { message: 'Server error' });

      await expect(logout()).rejects.toMatchObject({
        response: { status: 500 },
      });
    });
  });
});
