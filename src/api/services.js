import api from './axios';

export const getServices = (params) => api.get('/services', { params });
export const getServiceById = (id) => api.get(`/services/${id}`);
// Jangan set Content-Type manual — biarkan browser/axios menambahkan boundary FormData
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);
