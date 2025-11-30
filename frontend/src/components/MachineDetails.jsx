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

const MachineDetails = ({ machine, loading, error, onEdit, onBack }) => {
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
                Error al cargar los detalles de la máquina: {error.message}
            </Alert>
        )
    }

    if (!machine) {
        return (
            <Alert severity="warning">
                Máquina no encontrada
            </Alert>
        )
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'success'
            case 'inactive':
                return 'error'
            case 'maintenance':
                return 'warning'
            default:
                return 'default'
        }
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active':
                return 'Activa'
            case 'inactive':
                return 'Inactiva'
            case 'maintenance':
                return 'En Mantenimiento'
            default:
                return status
        }
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
                    Detalles de la Máquina
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
                        onClick={() => onEdit(machine)}
                    >
                        Editar
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <DetailItem label="Nombre" value={machine.name} />
                    <DetailItem label="Modelo" value={machine.model} />
                    <DetailItem label="Número de Serie" value={machine.serial_number} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <DetailItem label="Ubicación" value={machine.location} />
                    <DetailItem
                        label="Fecha de Instalación"
                        value={machine.installation_date
                            ? new Date(machine.installation_date).toLocaleDateString()
                            : null}
                    />
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Estado
                        </Typography>
                        <Chip
                            label={getStatusLabel(machine.status)}
                            color={getStatusColor(machine.status)}
                        />
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                    Creado: {new Date(machine.created_at).toLocaleString()}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                    Actualizado: {new Date(machine.updated_at).toLocaleString()}
                </Typography>
            </Box>
        </Paper>
    )
}

export default MachineDetails