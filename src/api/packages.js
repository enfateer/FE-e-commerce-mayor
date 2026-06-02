import api from './axios';

export const getPackages = (serviceId) => api.get(`/services/${serviceId}/packages`);
export const createPackage = (serviceId, data) => api.post(`/services/${serviceId}/packages`, data);
export const updatePackage = (id, data) => api.put(`/packages/${id}`, data);
export const deletePackage = (id) => api.delete(`/packages/${id}`);
