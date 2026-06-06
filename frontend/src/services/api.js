import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

export const productAPI = {
  getAll: () => api.get('/products'),
  search: (query) => api.get(`/products/search?name=${query}`),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getHistory: (id) => api.get(`/products/${id}/history`),
  importCSV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/products/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  exportCSV: () => api.get('/products/export', { responseType: 'blob' })
};