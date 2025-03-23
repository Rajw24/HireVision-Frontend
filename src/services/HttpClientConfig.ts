import axios from 'axios';

const HttpClientConfig = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor for debugging
HttpClientConfig.interceptors.request.use(
  (config) => {
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default HttpClientConfig;
