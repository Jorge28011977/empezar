import React, { useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { es } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import {
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material'
import { getAllMaintenances, updateMaintenance } from '../services/apiMaintenances'

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales: { es }
})

const DnDCalendar = withDragAndDrop(Calendar)

const MaintenanceCalendar = ({ onSelectEvent }) => {
    const [maintenances, setMaintenances] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filters, setFilters] = useState({
        type: '',
        technicianId: ''
    })

    useEffect(() => {
        loadMaintenances()
    }, [])

    const loadMaintenances = async () => {
        try {
            setLoading(true)
            const data = await getAllMaintenances()
            setMaintenances(data)
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    const filteredMaintenances = maintenances.filter(m => {
        if (filters.type && m.type !== filters.type) return false
        if (filters.technicianId && m.technician_id !== filters.technicianId) return false
        return true
    })

    const events = filteredMaintenances.map(m => ({
        id: m.id,
        title: `${m.type} - ${m.machine?.name || 'Máquina'}`,
        start: new Date(m.scheduled_date),
        end: new Date(m.scheduled_date),
        resource: m
    }))

    const eventStyleGetter = (event) => {
        let backgroundColor = '#3174ad' // default
        if (event.resource.type === 'preventivo') {
            backgroundColor = '#4caf50' // verde
        } else if (event.resource.type === 'correctivo') {
            backgroundColor = '#f44336' // rojo
        }
        return {
            style: {
                backgroundColor,
                borderRadius: '0px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        }
    }

    const handleEventDrop = async ({ event, start, end }) => {
        try {
            await updateMaintenance(event.id, { scheduled_date: start })
            loadMaintenances()
        } catch (err) {
            setError(err)
        }
    }

    const handleSelectEvent = (event) => {
        if (onSelectEvent) {
            onSelectEvent(event.resource)
        }
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                Error al cargar mantenimientos: {error.message}
            </Alert>
        )
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Calendario de Mantenimientos
            </Typography>
            <Box display="flex" gap={2} mb={2}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                        value={filters.type}
                        label="Tipo"
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="preventivo">Preventivo</MenuItem>
                        <MenuItem value="correctivo">Correctivo</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Técnico</InputLabel>
                    <Select
                        value={filters.technicianId}
                        label="Técnico"
                        onChange={(e) => setFilters({ ...filters, technicianId: e.target.value })}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        {/* Aquí se podrían mapear técnicos, pero por simplicidad, dejar vacío */}
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ height: 600 }}>
                <DnDCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    defaultView="month"
                    views={['month', 'week', 'day']}
                    eventPropGetter={eventStyleGetter}
                    onEventDrop={handleEventDrop}
                    onSelectEvent={handleSelectEvent}
                    messages={{
                        next: 'Siguiente',
                        previous: 'Anterior',
                        today: 'Hoy',
                        month: 'Mes',
                        week: 'Semana',
                        day: 'Día'
                    }}
                />
            </Box>
        </Box>
    )
}

export default MaintenanceCalendar