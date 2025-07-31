import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/documents',
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
