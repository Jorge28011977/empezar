import api from './api.js'

const apiMachines = {
    getAll: (params = {}) => api.get('/machines', { params }),
    getById: (id) => api.get(`/machines/${id}`),
    create: (data) => api.post('/machines', data),
    update: (id, data) => api.put(`/machines/${id}`, data),
    delete: (id) => api.delete(`/machines/${id}`)
};

export default apiMachines;