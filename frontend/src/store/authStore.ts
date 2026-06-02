import { create } from 'zustand';
import { User } from '@/types';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isLoading: true,

  setUser: user => set({ user }),

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { user } = response.data;
    set({ user, isLoading: false });
  },

  register: async (email, password, username) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      username,
    });
    const { user } = response.data;
    set({ user, isLoading: false });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore errors on logout
      console.error('Logout error:', error);
    } finally {
      set({ user: null });
    }
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data, isLoading: false });
    } catch (error) {
      // Not authenticated or session expired
      set({ user: null, isLoading: false });
    }
  },
}));
