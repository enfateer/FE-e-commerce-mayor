import api from './axios';

export const exportOrderPdf = (id) => api.get(`/export/orders/${id}/pdf`, { responseType: 'blob' });
export const exportOrderHistoryPdf = () => api.get('/export/orders/history/pdf', { responseType: 'blob' });
export const exportSellerOrdersExcel = () => api.get('/export/seller/orders/excel', { responseType: 'blob' });
