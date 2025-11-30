import React, { useState, useEffect } from 'react'
import { Alert, Snackbar } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Dashboard from '../components/Dashboard'
import VoiceControl from '../components/VoiceControl'
import {
    getMachineStats,
    getMaintenanceStats,
    getCostStats,
    getTechnicianStats,
    getAlerts
} from '../services/apiStats'

const DashboardPage = () => {
    const navigate = useNavigate()
    const [stats, setStats] = useState({
        machines: {},
        maintenances: {},
        costs: {},
        technicians: {}
    })
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)

            const [machines, maintenances, costs, technicians, alertsData] = await Promise.all([
                getMachineStats(),
                getMaintenanceStats(),
                getCostStats(),
                getTechnicianStats(),
                getAlerts()
            ])

            setStats({
                machines,
                maintenances,
                costs,
                technicians
            })
            setAlerts(alertsData)
        } catch (err) {
            console.error('Error fetching dashboard data:', err)
            setError('Error al cargar los datos del dashboard')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()

        // Refresh automático cada 5 minutos
        const interval = setInterval(fetchData, 300000)

        return () => clearInterval(interval)
    }, [])

    const handleCloseError = () => {
        setError(null)
    }

    const handleVoiceCommand = (command) => {
        switch (command.type) {
            case 'SHOW_MAINTENANCES_TODAY':
                navigate('/calendar')
                break
            case 'SHOW_DASHBOARD':
                // Ya estamos en dashboard
                break
            case 'SHOW_MACHINES':
                navigate('/machines')
                break
            case 'SHOW_TECHNICIANS':
                navigate('/technicians')
                break
            case 'SHOW_CALENDAR':
                navigate('/calendar')
                break
            case 'SHOW_REPORTS':
                navigate('/reports')
                break
            default:
                console.log('Comando no reconocido:', command)
        }
    }

    return (
        <>
            <Dashboard stats={stats} alerts={alerts} loading={loading} />
            <VoiceControl onCommand={handleVoiceCommand} />
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    )
}

export default DashboardPage