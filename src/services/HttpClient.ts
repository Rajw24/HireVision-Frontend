import axios from 'axios';
import { API_CONFIG } from '../config/api';
import TokenService from './TokenService';

const HttpClient = axios.create(API_CONFIG);

// Add request interceptor to handle auth token
HttpClient.interceptors.request.use(
  (config) => {
    const token = TokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default HttpClient;
