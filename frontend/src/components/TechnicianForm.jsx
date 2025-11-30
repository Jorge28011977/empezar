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

const TechnicianForm = ({ technician, onSubmit, onCancel, loading, error }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        specialization: '',
        availability: true
    })

    useEffect(() => {
        if (technician) {
            setFormData({
                username: technician.User?.username || '',
                email: technician.User?.email || '',
                password: '', // No mostrar password en edición
                specialization: technician.specialization || '',
                availability: technician.availability ?? true
            })
        }
    }, [technician])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Para edición, no enviar password si está vacío
        const dataToSubmit = { ...formData }
        if (!dataToSubmit.password) {
            delete dataToSubmit.password
        }
        onSubmit(dataToSubmit)
    }

    const availabilityOptions = [
        { value: true, label: 'Disponible' },
        { value: false, label: 'No Disponible' }
    ]

    return (
        <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                {technician ? 'Editar Técnico' : 'Crear Nuevo Técnico'}
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
                            label="Nombre de Usuario"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </Grid>
                    {!technician && (
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Contraseña"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={!technician}
                                disabled={loading}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Especialidad"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="Ej: Electricista, Mecánico, etc."
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            select
                            label="Disponibilidad"
                            name="availability"
                            value={formData.availability}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            {availabilityOptions.map((option) => (
                                <MenuItem key={option.value.toString()} value={option.value}>
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

export default TechnicianForm