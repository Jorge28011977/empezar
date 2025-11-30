import api from './api.js'
import { getAllMachines } from './apiMachines.js'
import { getAllMaintenances } from './apiMaintenances.js'
import { getCostStats } from './apiStats.js'

// Función para obtener datos de máquinas para reportes
export const getMachinesReportData = async (params = {}) => {
    try {
        return await getAllMachines(params)
    } catch (error) {
        throw error
    }
}

// Función para obtener datos de mantenimientos para reportes
export const getMaintenanceReportData = async (params = {}) => {
    try {
        return await getAllMaintenances(params)
    } catch (error) {
        throw error
    }
}

// Función para obtener datos de costos para reportes
export const getCostReportData = async () => {
    try {
        return await getCostStats()
    } catch (error) {
        throw error
    }
}

// Función para obtener datos de inventario para reportes
export const getInventoryReportData = async (params = {}) => {
    try {
        const response = await api.get('/inventory', { params })
        return response.data
    } catch (error) {
        throw error
    }
}