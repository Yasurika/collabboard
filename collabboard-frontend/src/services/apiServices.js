import API from '../api';

// Auth Endpoints
export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (credentials) => API.post('/auth/login', credentials);

// Task CRUD Endpoints
export const fetchTasks = () => API.get('/tasks');
export const createNewTask = (taskData) => API.post('/tasks', taskData);
export const updateTaskStatus = (id, updatedData) => API.put(`/tasks/${id}`, updatedData);
export const removeTask = (id) => API.delete(`/tasks/${id}`);