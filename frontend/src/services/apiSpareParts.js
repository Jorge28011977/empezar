import api from './api';

const apiSpareParts = {
    getAll: (params = {}) => api.get('/spare-parts', { params }),
    getById: (id) => api.get(`/spare-parts/${id}`),
    create: (data) => api.post('/spare-parts', data),
    update: (id, data) => api.put(`/spare-parts/${id}`, data),
    delete: (id) => api.delete(`/spare-parts/${id}`)
};

export default apiSpareParts;