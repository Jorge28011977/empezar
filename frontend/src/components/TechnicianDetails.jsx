import React from 'react'
import {
    Paper,
    Typography,
    Box,
    Grid,
    Chip,
    Button,
    CircularProgress,
    Alert
} from '@mui/material'
import { Edit, ArrowBack } from '@mui/icons-material'

const TechnicianDetails = ({ technician, loading, error, onEdit, onBack }) => {
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
                Error al cargar los detalles del técnico: {error.message}
            </Alert>
        )
    }

    if (!technician) {
        return (
            <Alert severity="warning">
                Técnico no encontrado
            </Alert>
        )
    }

    const getAvailabilityColor = (availability) => {
        return availability ? 'success' : 'error'
    }

    const getAvailabilityLabel = (availability) => {
        return availability ? 'Disponible' : 'No Disponible'
    }

    const DetailItem = ({ label, value }) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {label}
            </Typography>
            <Typography variant="body1">
                {value || '-'}
            </Typography>
        </Box>
    )

    return (
        <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Detalles del Técnico
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={onBack}
                    >
                        Volver
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => onEdit(technician)}
                    >
                        Editar
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <DetailItem label="Nombre de Usuario" value={technician.User?.username} />
                    <DetailItem label="Email" value={technician.User?.email} />
                    <DetailItem label="Rol" value={technician.User?.role} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <DetailItem label="Especialidad" value={technician.specialization} />
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Disponibilidad
                        </Typography>
                        <Chip
                            label={getAvailabilityLabel(technician.availability)}
                            color={getAvailabilityColor(technician.availability)}
                        />
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                    Creado: {technician.User?.created_at ? new Date(technician.User.created_at).toLocaleString() : '-'}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                    Actualizado: {technician.User?.updated_at ? new Date(technician.User.updated_at).toLocaleString() : '-'}
                </Typography>
            </Box>
        </Paper>
    )
}

export default TechnicianDetails