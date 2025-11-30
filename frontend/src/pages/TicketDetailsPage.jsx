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
import apiTickets from '../services/apiTickets';

const TicketDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTicket();
    }, [id]);

    const loadTicket = async () => {
        try {
            setLoading(true);
            const response = await apiTickets.getById(id);
            setTicket(response.data);
        } catch (err) {
            setError('Error al cargar el ticket');
            console.error('Error loading ticket:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'error';
            case 'assigned': return 'warning';
            case 'in_progress': return 'info';
            case 'resolved': return 'success';
            case 'closed': return 'default';
            default: return 'default';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return 'error';
            case 'high': return 'warning';
            case 'medium': return 'info';
            case 'low': return 'success';
            default: return 'default';
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

    if (error) {
        return (
            <Container maxWidth="md">
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!ticket) {
        return (
            <Container maxWidth="md">
                <Alert severity="warning" sx={{ mt: 2 }}>
                    Ticket no encontrado
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
                        onClick={() => navigate('/tickets')}
                        sx={{ mr: 2 }}
                    >
                        Volver
                    </Button>
                    <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                        Detalles del Ticket
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/tickets/${id}/edit`)}
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
                                        {ticket.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Título
                                    </Typography>
                                    <Typography variant="body1">
                                        {ticket.title}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Estado
                                    </Typography>
                                    <Chip
                                        label={ticket.status}
                                        color={getStatusColor(ticket.status)}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Prioridad
                                    </Typography>
                                    <Chip
                                        label={ticket.priority}
                                        color={getPriorityColor(ticket.priority)}
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Máquina
                            </Typography>
                            {ticket.Machine ? (
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        {ticket.Machine.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Modelo: {ticket.Machine.model}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Serie: {ticket.Machine.serialNumber}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ubicación: {ticket.Machine.location}
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
                            {ticket.Technician ? (
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        {ticket.Technician.User?.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Email: {ticket.Technician.User?.email}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Especialidad: {ticket.Technician.specialization}
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
                                Descripción
                            </Typography>
                            <Typography variant="body1">
                                {ticket.description || 'Sin descripción'}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default TicketDetailsPage;