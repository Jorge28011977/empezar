import api from './api';

const apiMaintenances = {
    // Get all maintenances with optional filters
    getAll: (params = {}) => {
        return api.get('/maintenances', { params });
    },

    // Get maintenance by ID
    getById: (id) => {
        return api.get(`/maintenances/${id}`);
    },

    // Create new maintenance
    create: (data) => {
        return api.post('/maintenances', data);
    },

    // Update maintenance
    update: (id, data) => {
        return api.put(`/maintenances/${id}`, data);
    },

    // Delete maintenance
    delete: (id) => {
        return api.delete(`/maintenances/${id}`);
    },

    // Assign technician to maintenance
    assignTechnician: (id, technicianId) => {
        return api.put(`/maintenances/${id}/assign`, { technicianId });
    },

    // Complete maintenance
    complete: (id, data = {}) => {
        return api.put(`/maintenances/${id}/complete`, data);
    }
};

export default apiMaintenances;