// API Technicians - Updated exports
import api from './api.js'

// Named exports para compatibilidad con imports
export const getAllTechnicians = (params = {}) => api.get('/technicians', { params })
export const getTechnicianById = (id) => api.get(`/technicians/${id}`)
export const createTechnician = (data) => api.post('/technicians', data)
export const updateTechnician = (id, data) => api.put(`/technicians/${id}`, data)
export const deleteTechnician = (id) => api.delete(`/technicians/${id}`)

// También exportar como objeto por compatibilidad
const apiTechnicians = {
    getAll: getAllTechnicians,
    getById: getTechnicianById,
    create: createTechnician,
    update: updateTechnician,
    delete: deleteTechnician
}

export default apiTechnicians