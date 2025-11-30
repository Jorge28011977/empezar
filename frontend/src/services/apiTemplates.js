import api from './api';

const apiTemplates = {
    getAll: (params = {}) => api.get('/maintenance-templates', { params }),
    getById: (id) => api.get(`/maintenance-templates/${id}`),
    create: (data) => api.post('/maintenance-templates', data),
    update: (id, data) => api.put(`/maintenance-templates/${id}`, data),
    delete: (id) => api.delete(`/maintenance-templates/${id}`),
    getByMachineType: (machineType) => api.get(`/maintenance-templates/machine-type/${machineType}`)
};

export default apiTemplates;