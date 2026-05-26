import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE}/bfhl`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTasks = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'all') {
    params.append('status', filters.status);
  }
  if (filters.minImportance && filters.minImportance > 1) {
    params.append('minImportance', filters.minImportance);
  }

  const response = await api.get(`/tasks?${params.toString()}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await api.patch(`/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/tasks/stats');
  return response.data;
};

export default api;
