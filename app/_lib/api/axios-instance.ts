import axios, { AxiosError, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';

function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') {
    return url || '';
  }
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    throw new Error(
      'NEXT_PUBLIC_API_URL environment variable is not configured. ' +
        'Please set it in your .env file.'
    );
  }
  return url;
}

const baseAxiosConfig: CreateAxiosDefaults = {
  baseURL: getApiUrl(),
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const api = axios.create(baseAxiosConfig);

/**
 * Separate axios instance for token refresh requests.
 * This instance does NOT have the 401 interceptor attached, which prevents
 * infinite refresh loops if the refresh endpoint itself returns 401.
 */
export const refreshApi = axios.create(baseAxiosConfig);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: Error | null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (!error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshApi.post('/auth/refresh');
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
