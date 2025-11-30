import api from './api.js'

export const getAllMachines = async (params = {}) => {
    try {
        const response = await api.get('/machines', { params })
        return response.data
    } catch (error) {
        throw error
    }
}

export const getMachineById = async (id) => {
    try {
        const response = await api.get(`/machines/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const createMachine = async (machineData) => {
    try {
        const response = await api.post('/machines', machineData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateMachine = async (id, machineData) => {
    try {
        const response = await api.put(`/machines/${id}`, machineData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const deleteMachine = async (id) => {
    try {
        const response = await api.delete(`/machines/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}