import MockAdapter from 'axios-mock-adapter';

const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: 'http://localhost:3000' };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('axios-instance', () => {
  describe('configuration', () => {
    it('creates axios instance with correct config', async () => {
      const { default: api } = await import('./axios-instance');

      expect(api.defaults.baseURL).toBe('http://localhost:3000');
      expect(api.defaults.withCredentials).toBe(true);
      expect(api.defaults.timeout).toBe(30000);
      expect(api.defaults.headers['Content-Type']).toBe('application/json');
    });

    it('throws error when NEXT_PUBLIC_API_URL is not set', async () => {
      process.env.NEXT_PUBLIC_API_URL = '';

      await expect(import('./axios-instance')).rejects.toThrow(
        'NEXT_PUBLIC_API_URL environment variable is not configured'
      );
    });

    it('creates separate refreshApi instance', async () => {
      const { default: api, refreshApi } = await import('./axios-instance');

      expect(api).not.toBe(refreshApi);
      expect(refreshApi.defaults.baseURL).toBe('http://localhost:3000');
      expect(refreshApi.defaults.withCredentials).toBe(true);
    });
  });

  describe('response interceptor', () => {
    let api: typeof import('./axios-instance').default;
    let refreshApi: typeof import('./axios-instance').refreshApi;
    let mockApi: MockAdapter;
    let mockRefreshApi: MockAdapter;
    let dispatchEventSpy: jest.SpyInstance;

    beforeEach(async () => {
      jest.resetModules();
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';

      const axiosModule = await import('./axios-instance');
      api = axiosModule.default;
      refreshApi = axiosModule.refreshApi;

      mockApi = new MockAdapter(api);
      mockRefreshApi = new MockAdapter(refreshApi);

      dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
    });

    afterEach(() => {
      mockApi.restore();
      mockRefreshApi.restore();
      dispatchEventSpy.mockRestore();
    });

    it('passes through successful responses', async () => {
      mockApi.onGet('/test').reply(200, { data: 'success' });

      const response = await api.get('/test');
      expect(response.data).toEqual({ data: 'success' });
    });

    it('passes through non-401 errors', async () => {
      mockApi.onGet('/test').reply(500, { error: 'Server error' });

      await expect(api.get('/test')).rejects.toMatchObject({
        response: { status: 500 },
      });
    });

    it('attempts token refresh on 401 error', async () => {
      mockApi.onGet('/protected').replyOnce(401);
      mockApi.onGet('/protected').reply(200, { data: 'success' });
      mockRefreshApi.onPost('/auth/refresh').reply(200, {});

      const response = await api.get('/protected');
      expect(response.data).toEqual({ data: 'success' });
    });

    it('dispatches auth:logout event when refresh fails', async () => {
      mockApi.onGet('/protected').reply(401);
      mockRefreshApi.onPost('/auth/refresh').reply(401);

      await expect(api.get('/protected')).rejects.toMatchObject({
        response: { status: 401 },
      });

      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'auth:logout' })
      );
    });

    it('queues requests while refresh is in progress', async () => {
      let refreshResolve: () => void;
      const refreshPromise = new Promise<void>((resolve) => {
        refreshResolve = resolve;
      });

      mockApi.onGet('/protected1').replyOnce(401);
      mockApi.onGet('/protected2').replyOnce(401);
      mockApi.onGet('/protected1').reply(200, { data: 'result1' });
      mockApi.onGet('/protected2').reply(200, { data: 'result2' });

      mockRefreshApi.onPost('/auth/refresh').reply(async () => {
        await refreshPromise;
        return [200, {}];
      });

      const request1 = api.get('/protected1');
      const request2 = api.get('/protected2');

      await new Promise((resolve) => setTimeout(resolve, 50));
      refreshResolve!();

      const [response1, response2] = await Promise.all([request1, request2]);

      expect(response1.data).toEqual({ data: 'result1' });
      expect(response2.data).toEqual({ data: 'result2' });
    });

    it('does not retry already retried requests', async () => {
      mockApi.onGet('/protected').reply(401);
      mockRefreshApi.onPost('/auth/refresh').reply(200, {});

      await expect(api.get('/protected')).rejects.toMatchObject({
        response: { status: 401 },
      });
    });

    it('rejects queued requests when refresh fails', async () => {
      mockApi.onGet('/protected1').reply(401);
      mockApi.onGet('/protected2').reply(401);
      mockRefreshApi.onPost('/auth/refresh').reply(401);

      const request1 = api.get('/protected1');
      const request2 = api.get('/protected2');

      await expect(request1).rejects.toBeDefined();
      await expect(request2).rejects.toBeDefined();
    });
  });
});
