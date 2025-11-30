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
import apiTemplates from '../services/apiTemplates';

const TemplateDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTemplate();
    }, [id]);

    const loadTemplate = async () => {
        try {
            setLoading(true);
            const response = await apiTemplates.getById(id);
            setTemplate(response.data);
        } catch (err) {
            setError('Error al cargar la plantilla');
            console.error('Error loading template:', err);
        } finally {
            setLoading(false);
        }
    };

    const getFrequencyColor = (frequency) => {
        switch (frequency) {
            case 'daily': return 'error';
            case 'weekly': return 'warning';
            case 'monthly': return 'info';
            case 'quarterly': return 'success';
            case 'yearly': return 'default';
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

    if (!template) {
        return (
            <Container maxWidth="md">
                <Alert severity="warning" sx={{ mt: 2 }}>
                    Plantilla no encontrada
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
                        onClick={() => navigate('/templates')}
                        sx={{ mr: 2 }}
                    >
                        Volver
                    </Button>
                    <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                        Detalles de Plantilla
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/templates/${id}/edit`)}
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
                                        {template.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Nombre
                                    </Typography>
                                    <Typography variant="body1">
                                        {template.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Tipo de Máquina
                                    </Typography>
                                    <Typography variant="body1">
                                        {template.machineType}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Frecuencia
                                    </Typography>
                                    <Chip
                                        label={template.frequency}
                                        color={getFrequencyColor(template.frequency)}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Duración Estimada (horas)
                                    </Typography>
                                    <Typography variant="body1">
                                        {template.estimatedDuration}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Descripción
                            </Typography>
                            <Typography variant="body1">
                                {template.description || 'Sin descripción'}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Instrucciones
                            </Typography>
                            <Typography variant="body1">
                                {template.instructions || 'Sin instrucciones específicas'}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default TemplateDetailsPage;