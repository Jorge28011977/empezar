import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Ajustar según el puerto del backend
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

export default api