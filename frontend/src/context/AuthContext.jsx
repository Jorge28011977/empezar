import { createContext, useContext, useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const decoded = jwtDecode(token)
                setUser(decoded)
            } catch (error) {
                localStorage.removeItem('token')
            }
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password })
            const { token } = response.data
            localStorage.setItem('token', token)
            const decoded = jwtDecode(token)
            setUser(decoded)
            return { success: true }
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Login failed' }
        }
    }

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData)
            const { token } = response.data
            localStorage.setItem('token', token)
            const decoded = jwtDecode(token)
            setUser(decoded)
            return { success: true }
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Registration failed' }
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}