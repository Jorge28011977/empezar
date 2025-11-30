import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Container,
    Typography,
    Button,
    Box,
    Grid,
    TextField,
    MenuItem,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material'
import { Add } from '@mui/icons-material'
import TechnicianList from '../components/TechnicianList'
import { getAllTechnicians, deleteTechnician } from '../services/apiTechnicians'

const TechniciansPage = () => {
    const navigate = useNavigate()
    const [technicians, setTechnicians] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filters, setFilters] = useState({
        availability: '',
        specialization: ''
    })
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        technicianId: null
    })

    const availabilityOptions = [
        { value: '', label: 'Todos' },
        { value: 'true', label: 'Disponible' },
        { value: 'false', label: 'No Disponible' }
    ]

    const loadTechnicians = async () => {
        try {
            setLoading(true)
            setError(null)
            const params = {}
            if (filters.availability !== '') params.availability = filters.availability
            if (filters.specialization) params.specialization = filters.specialization
            const data = await getAllTechnicians(params)
            setTechnicians(data)
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTechnicians()
    }, [filters])

    const handleFilterChange = (field) => (event) => {
        setFilters(prev => ({
            ...prev,
            [field]: event.target.value
        }))
    }

    const handleView = (id) => {
        navigate(`/technicians/${id}`)
    }

    const handleEdit = (technician) => {
        navigate(`/technicians/${technician.id}/edit`)
    }

    const handleDelete = (id) => {
        setDeleteDialog({ open: true, technicianId: id })
    }

    const confirmDelete = async () => {
        try {
            await deleteTechnician(deleteDialog.technicianId)
            setTechnicians(prev => prev.filter(t => t.id !== deleteDialog.technicianId))
            setDeleteDialog({ open: false, technicianId: null })
        } catch (err) {
            setError(err)
        }
    }

    const cancelDelete = () => {
        setDeleteDialog({ open: false, technicianId: null })
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Gestión de Técnicos
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/technicians/new')}
                >
                    Nuevo Técnico
                </Button>
            </Box>

            {/* Filtros */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                    Filtros
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Disponibilidad"
                            value={filters.availability}
                            onChange={handleFilterChange('availability')}
                        >
                            {availabilityOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Especialidad"
                            value={filters.specialization}
                            onChange={handleFilterChange('specialization')}
                            placeholder="Buscar por especialidad"
                        />
                    </Grid>
                </Grid>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error.message}
                </Alert>
            )}

            <TechnicianList
                technicians={technicians}
                loading={loading}
                error={error}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Dialog de confirmación para eliminar */}
            <Dialog
                open={deleteDialog.open}
                onClose={cancelDelete}
            >
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Está seguro de que desea eliminar este técnico? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete}>Cancelar</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default TechniciansPage