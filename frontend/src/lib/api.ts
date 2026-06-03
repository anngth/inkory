import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Handle response errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const currentPath = window.location.pathname;

      // Don't redirect if this is a login request or already on login page
      const isLoginRequest = requestUrl.includes('/auth/login');
      const isRegisterRequest = requestUrl.includes('/auth/register');
      const isMeRequest = requestUrl.includes('/auth/me');
      const isOnLoginPage = currentPath === '/login';
      const isOnRegisterPage = currentPath === '/register';

      if (
        !isLoginRequest &&
        !isRegisterRequest &&
        !isMeRequest &&
        !isOnLoginPage &&
        !isOnRegisterPage
      ) {
        // Clear auth state before redirecting
        useAuthStore.getState().setUser(null);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
