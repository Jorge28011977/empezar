import api from './api'

// Simulación de datos de estadísticas (reemplazar con llamadas reales cuando estén disponibles)
const mockStats = {
    machines: {
        total: 150,
        active: 120,
        maintenance: 20,
        inactive: 10
    },
    maintenances: {
        total: 45,
        pending: 12,
        completed: 33,
        overdue: 5
    },
    costs: {
        total: 125000,
        monthly: [
            { month: 'Ene', cost: 8500 },
            { month: 'Feb', cost: 9200 },
            { month: 'Mar', cost: 7800 },
            { month: 'Abr', cost: 10500 },
            { month: 'May', cost: 9800 },
            { month: 'Jun', cost: 11200 }
        ]
    },
    technicians: {
        total: 25,
        available: 18,
        busy: 7
    },
    alerts: [
        { id: 1, type: 'stock', message: 'Repuesto XYZ con stock bajo (5 unidades)', severity: 'warning' },
        { id: 2, type: 'maintenance', message: 'Mantenimiento pendiente para Máquina A', severity: 'error' },
        { id: 3, type: 'stock', message: 'Repuesto ABC agotado', severity: 'error' }
    ]
}

// Funciones para obtener estadísticas
export const getMachineStats = async () => {
    try {
        const response = await api.get('/stats/machines')
        return response.data
    } catch (error) {
        console.error('Error fetching machine stats:', error)
        // Fallback a datos mock si falla la API
        return mockStats.machines
    }
}

export const getMaintenanceStats = async () => {
    try {
        const response = await api.get('/stats/maintenances')
        return response.data
    } catch (error) {
        console.error('Error fetching maintenance stats:', error)
        return mockStats.maintenances
    }
}

export const getCostStats = async () => {
    try {
        const response = await api.get('/stats/costs')
        return response.data
    } catch (error) {
        console.error('Error fetching cost stats:', error)
        return mockStats.costs
    }
}

export const getTechnicianStats = async () => {
    try {
        const response = await api.get('/stats/technicians')
        return response.data
    } catch (error) {
        console.error('Error fetching technician stats:', error)
        return mockStats.technicians
    }
}

export const getAlerts = async () => {
    try {
        const response = await api.get('/stats/alerts')
        return response.data
    } catch (error) {
        console.error('Error fetching alerts:', error)
        return mockStats.alerts
    }
}