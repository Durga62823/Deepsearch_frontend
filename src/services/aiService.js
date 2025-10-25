import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: `${API_URL}/documents`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const askQuestion = async (question) => {
  const response = await apiClient.post('/ask', { question });
  return response.data;
};

export default {
  askQuestion,
};
