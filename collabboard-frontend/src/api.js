import axios from 'axios';

// Express Backend Base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Front-end eken yawa hama request ekakatama JWT Token eka auto attach karanna
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;