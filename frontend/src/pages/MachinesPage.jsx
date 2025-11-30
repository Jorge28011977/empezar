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
import MachineList from '../components/MachineList'
import { getAllMachines, deleteMachine } from '../services/apiMachines'

const MachinesPage = () => {
    const navigate = useNavigate()
    const [machines, setMachines] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filters, setFilters] = useState({
        location: '',
        status: '',
        model: ''
    })
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        machineId: null
    })

    const statusOptions = [
        { value: '', label: 'Todos' },
        { value: 'active', label: 'Activa' },
        { value: 'inactive', label: 'Inactiva' },
        { value: 'maintenance', label: 'En Mantenimiento' }
    ]

    const loadMachines = async () => {
        try {
            setLoading(true)
            setError(null)
            const params = {}
            if (filters.location) params.location = filters.location
            if (filters.status) params.status = filters.status
            if (filters.model) params.model = filters.model
            const data = await getAllMachines(params)
            setMachines(data)
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadMachines()
    }, [filters])

    const handleFilterChange = (field) => (event) => {
        setFilters(prev => ({
            ...prev,
            [field]: event.target.value
        }))
    }

    const handleView = (id) => {
        navigate(`/machines/${id}`)
    }

    const handleEdit = (machine) => {
        navigate(`/machines/${machine.id}/edit`)
    }

    const handleDelete = (id) => {
        setDeleteDialog({ open: true, machineId: id })
    }

    const confirmDelete = async () => {
        try {
            await deleteMachine(deleteDialog.machineId)
            setMachines(prev => prev.filter(m => m.id !== deleteDialog.machineId))
            setDeleteDialog({ open: false, machineId: null })
        } catch (err) {
            setError(err)
        }
    }

    const cancelDelete = () => {
        setDeleteDialog({ open: false, machineId: null })
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Gestión de Máquinas
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/machines/new')}
                >
                    Nueva Máquina
                </Button>
            </Box>

            {/* Filtros */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                    Filtros
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Ubicación (Sucursal)"
                            value={filters.location}
                            onChange={handleFilterChange('location')}
                            placeholder="Buscar por ubicación"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            select
                            label="Estado"
                            value={filters.status}
                            onChange={handleFilterChange('status')}
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Modelo (Tipo)"
                            value={filters.model}
                            onChange={handleFilterChange('model')}
                            placeholder="Buscar por modelo"
                        />
                    </Grid>
                </Grid>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error.message}
                </Alert>
            )}

            <MachineList
                machines={machines}
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
                        ¿Está seguro de que desea eliminar esta máquina? Esta acción no se puede deshacer.
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

export default MachinesPage