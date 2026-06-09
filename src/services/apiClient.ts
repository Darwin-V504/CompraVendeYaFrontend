import axios from 'axios';

// Esta URL ya no se usa porque el authService es mock
const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// No se usan interceptores porque no hay backend
export default apiClient;