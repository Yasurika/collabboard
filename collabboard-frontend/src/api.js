import axios from 'axios';

// Express Backend Base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});


API.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;