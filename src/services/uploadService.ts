import axios from 'axios';
import TokenService from './TokenService';

const API_URL = 'http://localhost:8000';

export const uploadService = {
  async uploadResume(file: File) {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const accessToken = TokenService.getAccessToken();
      const response = await axios.post(
        `${API_URL}/aiinterview/start-interview/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to upload resume');
    }
  }
};
