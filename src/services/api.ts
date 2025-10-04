import axios from 'axios';
import { env } from '@/config/env';
import { toast } from 'react-hot-toast';

/**
 * Axios instance configured for LinkShield API
 * Base URL: https://api.linkshield.site/api/v1
 */
export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Automatically adds JWT token to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from auth store
    if (typeof window !== 'undefined') {
      const { useAuthStore } = require('@/stores/authStore');
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handles common error scenarios and extracts data
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return only the data, not the full Axios response
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    const errorCode = error.response?.data?.error_code;
    const message = error.response?.data?.message;

    // Handle 401 Unauthorized - Token expired or invalid
    if (status === 401) {
      // Clear auth state
      if (typeof window !== 'undefined') {
        const { useAuthStore } = require('@/stores/authStore');
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
      }
      toast.error('Session expired. Please log in again.');
      return Promise.reject(error);
    }

    // Handle 403 Forbidden - Insufficient permissions
    if (status === 403) {
      toast.error('You do not have permission to perform this action.');
      return Promise.reject(error);
    }

    // Handle 404 Not Found
    if (status === 404) {
      toast.error('Resource not found.');
      return Promise.reject(error);
    }

    // Handle 429 Rate Limit Exceeded
    if (status === 429) {
      const retryAfter = error.response?.headers['retry-after'];
      const retryMessage = retryAfter
        ? `Rate limit exceeded. Please try again in ${retryAfter} seconds.`
        : 'Rate limit exceeded. Please try again later.';
      toast.error(retryMessage);
      return Promise.reject(error);
    }

    // Handle 500 Internal Server Error
    if (status === 500) {
      toast.error('Server error. Please try again later.');
      return Promise.reject(error);
    }

    // Handle specific error codes from backend
    if (errorCode) {
      // Error messages will be mapped in utils/errorMessages.ts
      const userMessage = message || 'An error occurred';
      toast.error(userMessage);
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Error]', {
        status,
        errorCode,
        message,
        url: error.config?.url,
      });
    }

    return Promise.reject(error);
  }
);
