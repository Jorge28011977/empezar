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
        // Intentar llamada real
        // const response = await api.get('/stats/machines')
        // return response.data

        // Simulación
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockStats.machines), 500)
        })
    } catch (error) {
        console.error('Error fetching machine stats:', error)
        throw error
    }
}

export const getMaintenanceStats = async () => {
    try {
        // const response = await api.get('/stats/maintenances')
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockStats.maintenances), 500)
        })
    } catch (error) {
        console.error('Error fetching maintenance stats:', error)
        throw error
    }
}

export const getCostStats = async () => {
    try {
        // const response = await api.get('/stats/costs')
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockStats.costs), 500)
        })
    } catch (error) {
        console.error('Error fetching cost stats:', error)
        throw error
    }
}

export const getTechnicianStats = async () => {
    try {
        // const response = await api.get('/stats/technicians')
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockStats.technicians), 500)
        })
    } catch (error) {
        console.error('Error fetching technician stats:', error)
        throw error
    }
}

export const getAlerts = async () => {
    try {
        // const response = await api.get('/alerts')
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockStats.alerts), 500)
        })
    } catch (error) {
        console.error('Error fetching alerts:', error)
        throw error
    }
}