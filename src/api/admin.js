import api from './axios';

export const getAdminUsers = () => api.get('/admin/users');
export const getAdminSellers = () => api.get('/admin/sellers');
export const getAdminReports = () => api.get('/admin/reports');
export const getAdminNotifications = () => api.get('/admin/notifications');
export const warnUser = (id) => api.post(`/admin/users/${id}/warn`);
export const banUser = (id) => api.post(`/admin/users/${id}/ban`);
export const unbanUser = (id) => api.post(`/admin/users/${id}/unban`);
export const adminDeleteService = (id) => api.delete(`/admin/services/${id}`);
