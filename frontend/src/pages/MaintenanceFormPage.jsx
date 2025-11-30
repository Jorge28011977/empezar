import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Alert,
    CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import apiMaintenances from '../services/apiMaintenances';
import apiMachines from '../services/apiMachines';
import apiTechnicians from '../services/apiTechnicians';

const MaintenanceFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        type: 'preventive',
        status: 'pending',
        priority: 'medium',
        description: '',
        scheduledDate: '',
        machineId: '',
        technicianId: '',
        estimatedCost: '',
        notes: ''
    });

    const [machines, setMachines] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
        if (isEditing) {
            loadMaintenance();
        }
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [machinesRes, techniciansRes] = await Promise.all([
                apiMachines.getAll(),
                apiTechnicians.getAll()
            ]);
            setMachines(machinesRes.data);
            setTechnicians(techniciansRes.data);
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadMaintenance = async () => {
        try {
            setLoading(true);
            const response = await apiMaintenances.getById(id);
            const maintenance = response.data;
            setFormData({
                type: maintenance.type,
                status: maintenance.status,
                priority: maintenance.priority,
                description: maintenance.description || '',
                scheduledDate: maintenance.scheduledDate ? maintenance.scheduledDate.split('T')[0] : '',
                machineId: maintenance.machineId || '',
                technicianId: maintenance.technicianId || '',
                estimatedCost: maintenance.estimatedCost || '',
                notes: maintenance.notes || ''
            });
        } catch (err) {
            setError('Error al cargar el mantenimiento');
            console.error('Error loading maintenance:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);

            const dataToSend = {
                ...formData,
                scheduledDate: new Date(formData.scheduledDate).toISOString(),
                estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : null
            };

            if (isEditing) {
                await apiMaintenances.update(id, dataToSend);
            } else {
                await apiMaintenances.create(dataToSend);
            }

            navigate('/maintenances');
        } catch (err) {
            setError('Error al guardar el mantenimiento');
            console.error('Error saving maintenance:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/maintenances')}
                        sx={{ mr: 2 }}
                    >
                        Volver
                    </Button>
                    <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                        {isEditing ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Paper sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Tipo</InputLabel>
                                    <Select
                                        value={formData.type}
                                        label="Tipo"
                                        onChange={(e) => handleChange('type', e.target.value)}
                                    >
                                        <MenuItem value="preventive">Preventivo</MenuItem>
                                        <MenuItem value="corrective">Correctivo</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Prioridad</InputLabel>
                                    <Select
                                        value={formData.priority}
                                        label="Prioridad"
                                        onChange={(e) => handleChange('priority', e.target.value)}
                                    >
                                        <MenuItem value="low">Baja</MenuItem>
                                        <MenuItem value="medium">Media</MenuItem>
                                        <MenuItem value="high">Alta</MenuItem>
                                        <MenuItem value="critical">Crítica</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Fecha Programada"
                                    type="date"
                                    value={formData.scheduledDate}
                                    onChange={(e) => handleChange('scheduledDate', e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Costo Estimado"
                                    type="number"
                                    value={formData.estimatedCost}
                                    onChange={(e) => handleChange('estimatedCost', e.target.value)}
                                    InputProps={{
                                        startAdornment: '$',
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Máquina</InputLabel>
                                    <Select
                                        value={formData.machineId}
                                        label="Máquina"
                                        onChange={(e) => handleChange('machineId', e.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em>Seleccionar máquina</em>
                                        </MenuItem>
                                        {machines.map((machine) => (
                                            <MenuItem key={machine.id} value={machine.id}>
                                                {machine.name} - {machine.model}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Técnico</InputLabel>
                                    <Select
                                        value={formData.technicianId}
                                        label="Técnico"
                                        onChange={(e) => handleChange('technicianId', e.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em>Seleccionar técnico</em>
                                        </MenuItem>
                                        {technicians.map((technician) => (
                                            <MenuItem key={technician.id} value={technician.id}>
                                                {technician.User?.name} - {technician.specialization}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Descripción"
                                    multiline
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="Describe el mantenimiento a realizar..."
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Notas Adicionales"
                                    multiline
                                    rows={2}
                                    value={formData.notes}
                                    onChange={(e) => handleChange('notes', e.target.value)}
                                    placeholder="Notas adicionales..."
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/maintenances')}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        disabled={saving}
                                    >
                                        {saving ? 'Guardando...' : 'Guardar'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default MaintenanceFormPage;