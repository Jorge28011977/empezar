import React, { useState, useEffect } from 'react'
import {
    TextField,
    Button,
    Box,
    Grid,
    MenuItem,
    CircularProgress,
    Alert,
    Paper,
    Typography
} from '@mui/material'

const MachineForm = ({ machine, onSubmit, onCancel, loading, error }) => {
    const [formData, setFormData] = useState({
        name: '',
        model: '',
        serial_number: '',
        location: '',
        installation_date: '',
        status: 'active'
    })

    useEffect(() => {
        if (machine) {
            setFormData({
                name: machine.name || '',
                model: machine.model || '',
                serial_number: machine.serial_number || '',
                location: machine.location || '',
                installation_date: machine.installation_date
                    ? new Date(machine.installation_date).toISOString().split('T')[0]
                    : '',
                status: machine.status || 'active'
            })
        }
    }, [machine])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const statusOptions = [
        { value: 'active', label: 'Activa' },
        { value: 'inactive', label: 'Inactiva' },
        { value: 'maintenance', label: 'En Mantenimiento' }
    ]

    return (
        <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                {machine ? 'Editar Máquina' : 'Crear Nueva Máquina'}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error.message}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Modelo"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Número de Serie"
                            name="serial_number"
                            value={formData.serial_number}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Ubicación"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Fecha de Instalación"
                            name="installation_date"
                            type="date"
                            value={formData.installation_date}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            disabled={loading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Estado"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </Box>
            </Box>
        </Paper>
    )
}

export default MachineForm