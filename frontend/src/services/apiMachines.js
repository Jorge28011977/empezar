import api from './api.js'

// Named exports
export const getAllMachines = (params = {}) => api.get('/machines', { params })
export const getMachineById = (id) => api.get(`/machines/${id}`)
export const createMachine = (data) => api.post('/machines', data)
export const updateMachine = (id, data) => api.put(`/machines/${id}`, data)
export const deleteMachine = (id) => api.delete(`/machines/${id}`)

// Alias for compatibility
export const getMachines = getAllMachines

// Default export
const apiMachines = {
    getAll: getAllMachines,
    getById: getMachineById,
    create: createMachine,
    update: updateMachine,
    delete: deleteMachine
}

export default apiMachines