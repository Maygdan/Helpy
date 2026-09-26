import axios from 'axios';

// Указываем URL нашего бэкенда (для локальной разработки)
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;