import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, TOKEN_STORAGE_KEY } from '@/lib/constants';
import type { AuthTokens } from '@/types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ------------------------------------------------------------------ */
/*  Token helpers                                                      */
/* ------------------------------------------------------------------ */

export function getTokens(): AuthTokens | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setTokens(tokens: AuthTokens): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

/* ------------------------------------------------------------------ */
/*  Request interceptor: attach Bearer token                           */
/* ------------------------------------------------------------------ */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = getTokens();
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ------------------------------------------------------------------ */
/*  Response interceptor: 401 -> refresh -> retry (with mutex)         */
/* ------------------------------------------------------------------ */

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt refresh on 401 and if we haven't already retried
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't attempt refresh for auth endpoints themselves
    const url = originalRequest.url || '';
    if (url.includes('/auth/login') || url.includes('/auth/token/refresh')) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Another refresh is in progress -- queue this request
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const tokens = getTokens();
    if (!tokens?.refresh) {
      clearTokens();
      isRefreshing = false;
      processQueue(error, null);
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post<{ access: string; refresh?: string }>(
        `${API_BASE_URL}/auth/token/refresh/`,
        { refresh: tokens.refresh }
      );

      const newTokens: AuthTokens = {
        access: data.access,
        refresh: data.refresh || tokens.refresh,
      };
      setTokens(newTokens);

      originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
      processQueue(null, newTokens.access);

      return api(originalRequest);
    } catch (refreshError) {
      clearTokens();
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
