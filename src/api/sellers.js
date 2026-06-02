import api from './axios';

export const getSellerDetails = (id) => api.get(`/sellers/${id}`);
export const getSellerDashboard = () => api.get('/seller/dashboard');
