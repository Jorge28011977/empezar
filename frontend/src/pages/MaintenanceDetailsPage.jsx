import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Chip,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit as EditIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import apiMaintenances from '../services/apiMaintenances';

const MaintenanceDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [maintenance, setMaintenance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadMaintenance();
    }, [id]);

    const loadMaintenance = async () => {
        try {
            setLoading(true);
            const response = await apiMaintenances.getById(id);
            setMaintenance(response.data);
        } catch (err) {
            setError('Error al cargar el mantenimiento');
            console.error('Error loading maintenance:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'in_progress': return 'info';
            case 'completed': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getTypeColor = (type) => {
        return type === 'preventive' ? 'primary' : 'secondary';
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

    if (error) {
        return (
            <Container maxWidth="md">
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!maintenance) {
        return (
            <Container maxWidth="md">
                <Alert severity="warning" sx={{ mt: 2 }}>
                    Mantenimiento no encontrado
                </Alert>
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
                        Detalles del Mantenimiento
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/maintenances/${id}/edit`)}
                    >
                        Editar
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Información General
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        ID
                                    </Typography>
                                    <Typography variant="body1">
                                        {maintenance.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Tipo
                                    </Typography>
                                    <Chip
                                        label={maintenance.type === 'preventive' ? 'Preventivo' : 'Correctivo'}
                                        color={getTypeColor(maintenance.type)}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Estado
                                    </Typography>
                                    <Chip
                                        label={maintenance.status}
                                        color={getStatusColor(maintenance.status)}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Prioridad
                                    </Typography>
                                    <Typography variant="body1">
                                        {maintenance.priority}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Máquina
                            </Typography>
                            {maintenance.Machine ? (
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        {maintenance.Machine.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Modelo: {maintenance.Machine.model}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Serie: {maintenance.Machine.serialNumber}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ubicación: {maintenance.Machine.location}
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No asignada
                                </Typography>
                            )}
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Técnico Asignado
                            </Typography>
                            {maintenance.Technician ? (
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        {maintenance.Technician.User?.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Email: {maintenance.Technician.User?.email}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Especialidad: {maintenance.Technician.specialization}
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No asignado
                                </Typography>
                            )}
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Fechas
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Fecha Programada
                                    </Typography>
                                    <Typography variant="body1">
                                        {new Date(maintenance.scheduledDate).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                {maintenance.actualStartDate && (
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Fecha Inicio Real
                                        </Typography>
                                        <Typography variant="body1">
                                            {new Date(maintenance.actualStartDate).toLocaleDateString()}
                                        </Typography>
                                    </Grid>
                                )}
                                {maintenance.actualEndDate && (
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Fecha Fin Real
                                        </Typography>
                                        <Typography variant="body1">
                                            {new Date(maintenance.actualEndDate).toLocaleDateString()}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Descripción y Notas
                            </Typography>
                            <Typography variant="body1">
                                {maintenance.description || 'Sin descripción'}
                            </Typography>
                            {maintenance.notes && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Notas:
                                    </Typography>
                                    <Typography variant="body1">
                                        {maintenance.notes}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default MaintenanceDetailsPage;