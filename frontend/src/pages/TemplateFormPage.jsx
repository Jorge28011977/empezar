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
import apiTemplates from '../services/apiTemplates';

const TemplateFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        machineType: '',
        frequency: 'monthly',
        estimatedDuration: '',
        description: '',
        instructions: ''
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditing) {
            loadTemplate();
        }
    }, [id]);

    const loadTemplate = async () => {
        try {
            setLoading(true);
            const response = await apiTemplates.getById(id);
            const template = response.data;
            setFormData({
                name: template.name,
                machineType: template.machineType,
                frequency: template.frequency,
                estimatedDuration: template.estimatedDuration,
                description: template.description || '',
                instructions: template.instructions || ''
            });
        } catch (err) {
            setError('Error al cargar la plantilla');
            console.error('Error loading template:', err);
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
                estimatedDuration: parseFloat(formData.estimatedDuration)
            };

            if (isEditing) {
                await apiTemplates.update(id, dataToSend);
            } else {
                await apiTemplates.create(dataToSend);
            }

            navigate('/templates');
        } catch (err) {
            setError('Error al guardar la plantilla');
            console.error('Error saving template:', err);
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
                        onClick={() => navigate('/templates')}
                        sx={{ mr: 2 }}
                    >
                        Volver
                    </Button>
                    <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                        {isEditing ? 'Editar Plantilla' : 'Nueva Plantilla'}
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
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Tipo de Máquina"
                                    value={formData.machineType}
                                    onChange={(e) => handleChange('machineType', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Frecuencia</InputLabel>
                                    <Select
                                        value={formData.frequency}
                                        label="Frecuencia"
                                        onChange={(e) => handleChange('frequency', e.target.value)}
                                    >
                                        <MenuItem value="daily">Diaria</MenuItem>
                                        <MenuItem value="weekly">Semanal</MenuItem>
                                        <MenuItem value="monthly">Mensual</MenuItem>
                                        <MenuItem value="quarterly">Trimestral</MenuItem>
                                        <MenuItem value="yearly">Anual</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Duración Estimada (horas)"
                                    type="number"
                                    value={formData.estimatedDuration}
                                    onChange={(e) => handleChange('estimatedDuration', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Descripción"
                                    multiline
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="Describe la plantilla..."
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Instrucciones"
                                    multiline
                                    rows={4}
                                    value={formData.instructions}
                                    onChange={(e) => handleChange('instructions', e.target.value)}
                                    placeholder="Instrucciones detalladas para el mantenimiento..."
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/templates')}
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

export default TemplateFormPage;