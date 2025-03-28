import axios from 'axios';
import TokenService from './TokenService';

const BASE_URL = 'http://127.0.0.1:8000/aiinterview';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Update auth token interceptor
api.interceptors.request.use((config) => {
  const token = TokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is unauthorized and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if we're already refreshing
      if (TokenService.isRefreshing()) {
        // Wait for the refresh to complete
        return new Promise((resolve) => {
          TokenService.enqueueRequest(() => {
            originalRequest.headers.Authorization = `Bearer ${TokenService.getAccessToken()}`;
            resolve(api(originalRequest));
          });
        });
      }

      try {
        TokenService.setRefreshing(true);
        // TODO: Add your refresh token logic here
        // const response = await refreshTokenApi();
        // TokenService.setTokens(response.access, response.refresh);

        // Process queued requests
        TokenService.resolveQueue();
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${TokenService.getAccessToken()}`;
        return api(originalRequest);
      } catch (refreshError) {
        TokenService.clear();
        TokenService.clearQueue();
        throw refreshError;
      } finally {
        TokenService.setRefreshing(false);
      }
    }

    return Promise.reject(error);
  }
);

export const interviewService = {
  startInterview: async (interview_id?: number) => {
    const response = await api.post('/start-interview/', { interview_id });
    return response.data;
  },

  submitAnswer: async (interviewId: number, answer: string) => {
    const response = await api.post('/next-question/', {
      interview_id: interviewId,
      answer: answer,
    });
    return response.data;
  },

  getResults: async (interviewId: number) => {
    const response = await api.get(`/interview-results/${interviewId}/`);
    return response.data;
  },
};
