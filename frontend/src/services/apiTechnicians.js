import api from './api.js'

export const getAllTechnicians = async (params = {}) => {
    try {
        const response = await api.get('/technicians', { params })
        return response.data
    } catch (error) {
        throw error
    }
}

export const getTechnicianById = async (id) => {
    try {
        const response = await api.get(`/technicians/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const createTechnician = async (technicianData) => {
    try {
        const response = await api.post('/technicians', technicianData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateTechnician = async (id, technicianData) => {
    try {
        const response = await api.put(`/technicians/${id}`, technicianData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const deleteTechnician = async (id) => {
    try {
        const response = await api.delete(`/technicians/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}