import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { getTokens, setTokens, clearTokens } from '@/services/api';
import type { User, LoginRequest, RegisterRequest, AuthTokens } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      /* ---------- state ---------- */
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /* ---------- actions ---------- */
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post<{ tokens: AuthTokens; user: User }>(
            '/auth/login/',
            credentials
          );
          setTokens(data.tokens);
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err: unknown) {
          const message =
            (err as { response?: { data?: { detail?: string } } })?.response
              ?.data?.detail || 'Login failed';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          const { data: res } = await api.post<{
            tokens: AuthTokens;
            user: User;
          }>('/auth/register/', data);
          setTokens(res.tokens);
          set({
            user: res.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err: unknown) {
          const message =
            (err as { response?: { data?: { detail?: string } } })?.response
              ?.data?.detail || 'Registration failed';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout/');
        } catch {
          // Ignore errors on logout -- clear local state regardless
        } finally {
          clearTokens();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      loadUser: async () => {
        if (!get().isAuthenticated) return;
        // Verify tokens actually exist before making API call
        const tokens = getTokens();
        if (!tokens?.access) {
          clearTokens();
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }
        set({ isLoading: true });
        try {
          const { data } = await api.get<User>('/auth/profile/');
          set({ user: data, isLoading: false });
        } catch {
          // Token is invalid -- clear everything
          clearTokens();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'villakurdu-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
