import api from './api.js'

const apiTechnicians = {
    getAll: (params = {}) => api.get('/technicians', { params }),
    getById: (id) => api.get(`/technicians/${id}`),
    create: (data) => api.post('/technicians', data),
    update: (id, data) => api.put(`/technicians/${id}`, data),
    delete: (id) => api.delete(`/technicians/${id}`)
};

export default apiTechnicians;