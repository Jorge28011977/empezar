import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import apiTickets from '../services/apiTickets';
import apiMachines from '../services/apiMachines';
import apiTechnicians from '../services/apiTechnicians';

const TicketFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        machineId: '',
        technicianId: ''
    });

    const [machines, setMachines] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
        if (isEditing) {
            loadTicket();
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

    const loadTicket = async () => {
        try {
            setLoading(true);
            const response = await apiTickets.getById(id);
            const ticket = response.data;
            setFormData({
                title: ticket.title,
                description: ticket.description || '',
                priority: ticket.priority,
                machineId: ticket.machineId || '',
                technicianId: ticket.technicianId || ''
            });
        } catch (err) {
            setError('Error al cargar el ticket');
            console.error('Error loading ticket:', err);
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

            if (isEditing) {
                await apiTickets.update(id, formData);
            } else {
                await apiTickets.create(formData);
            }

            navigate('/tickets');
        } catch (err) {
            setError('Error al guardar el ticket');
            console.error('Error saving ticket:', err);
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
                        onClick={() => navigate('/tickets')}
                        sx={{ mr: 2 }}
                    >
                        Volver
                    </Button>
                    <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                        {isEditing ? 'Editar Ticket' : 'Nuevo Ticket'}
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
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Título"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    required
                                />
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

                            <Grid item xs={12}>
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
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="Describe la incidencia..."
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/tickets')}
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

export default TicketFormPage;