import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import MaintenanceCalendar from '../components/MaintenanceCalendar'

const CalendarPage = () => {
    const handleSelectEvent = (maintenance) => {
        // Por ahora, mostrar detalles en alert. En el futuro, navegar a página de detalles.
        alert(`Mantenimiento: ${maintenance.type} - ${maintenance.machine?.name}\nFecha: ${new Date(maintenance.scheduled_date).toLocaleDateString()}\nDescripción: ${maintenance.description || 'Sin descripción'}`)
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Calendario de Mantenimientos
                </Typography>
            </Box>
            <MaintenanceCalendar onSelectEvent={handleSelectEvent} />
        </Container>
    )
}

export default CalendarPage