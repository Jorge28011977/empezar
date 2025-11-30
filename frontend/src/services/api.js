import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Ajustar según el puerto del backend
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Interceptor para agregar token de autenticación si existe
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado, redirigir a login
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// Funciones de API para mantenimiento predictivo
export const predictiveAPI = {
    // Obtener predicción para una máquina
    getPrediction: (machineId) => api.get(`/predictive/machines/${machineId}/predict`),

    // Obtener tendencias de fallos
    getTrends: (machineId, days = 30) => api.get(`/predictive/machines/${machineId}/trends?days=${days}`),

    // Obtener recomendaciones de mantenimiento
    getRecommendations: (machineId) => api.get(`/predictive/machines/${machineId}/recommendations`)
}

export default api