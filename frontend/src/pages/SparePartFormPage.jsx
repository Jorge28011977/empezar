import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Grid,
    Alert,
    CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import apiSpareParts from '../services/apiSpareParts';

const SparePartFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        quantityInStock: '',
        minimumStock: ''
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditing) {
            loadSparePart();
        }
    }, [id]);

    const loadSparePart = async () => {
        try {
            setLoading(true);
            const response = await apiSpareParts.getById(id);
            const sparePart = response.data;
            setFormData({
                name: sparePart.name,
                category: sparePart.category,
                description: sparePart.description || '',
                price: sparePart.price,
                quantityInStock: sparePart.quantityInStock,
                minimumStock: sparePart.minimumStock
            });
        } catch (err) {
            setError('Error al cargar el repuesto');
            console.error('Error loading spare part:', err);
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
                price: parseFloat(formData.price),
                quantityInStock: parseInt(formData.quantityInStock),
                minimumStock: parseInt(formData.minimumStock)
            };

            if (isEditing) {
                await apiSpareParts.update(id, dataToSend);
            } else {
                await apiSpareParts.create(dataToSend);
            }

            navigate('/spare-parts');
        } catch (err) {
            setError('Error al guardar el repuesto');
            console.error('Error saving spare part:', err);
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
                        onClick={() => navigate('/spare-parts')}
                        sx={{ mr: 2 }}
                    >
                        Volver
                    </Button>
                    <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                        {isEditing ? 'Editar Repuesto' : 'Nuevo Repuesto'}
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
                                    label="Categoría"
                                    value={formData.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Precio"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => handleChange('price', e.target.value)}
                                    InputProps={{
                                        startAdornment: '$',
                                    }}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Stock Actual"
                                    type="number"
                                    value={formData.quantityInStock}
                                    onChange={(e) => handleChange('quantityInStock', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Stock Mínimo"
                                    type="number"
                                    value={formData.minimumStock}
                                    onChange={(e) => handleChange('minimumStock', e.target.value)}
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
                                    placeholder="Describe el repuesto..."
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/spare-parts')}
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

export default SparePartFormPage;