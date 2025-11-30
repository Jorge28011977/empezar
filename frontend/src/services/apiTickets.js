import api from './api';

const apiTickets = {
    getAll: (params = {}) => api.get('/tickets', { params }),
    getById: (id) => api.get(`/tickets/${id}`),
    create: (data) => api.post('/tickets', data),
    update: (id, data) => api.put(`/tickets/${id}`, data),
    delete: (id) => api.delete(`/tickets/${id}`),
    assignTechnician: (id, technicianId) => api.put(`/tickets/${id}/assign`, { technicianId }),
    changeStatus: (id, status) => api.put(`/tickets/${id}/status`, { status })
};

export default apiTickets;