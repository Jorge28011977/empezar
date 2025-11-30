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
import apiSpareParts from '../services/apiSpareParts';

const SparePartDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sparePart, setSparePart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSparePart();
    }, [id]);

    const loadSparePart = async () => {
        try {
            setLoading(true);
            const response = await apiSpareParts.getById(id);
            setSparePart(response.data);
        } catch (err) {
            setError('Error al cargar el repuesto');
            console.error('Error loading spare part:', err);
        } finally {
            setLoading(false);
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

    if (!sparePart) {
        return (
            <Container maxWidth="md">
                <Alert severity="warning" sx={{ mt: 2 }}>
                    Repuesto no encontrado
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
                        onClick={() => navigate('/spare-parts')}
                        sx={{ mr: 2 }}
                    >
                        Volver
                    </Button>
                    <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                        Detalles del Repuesto
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/spare-parts/${id}/edit`)}
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
                                        {sparePart.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Nombre
                                    </Typography>
                                    <Typography variant="body1">
                                        {sparePart.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Categoría
                                    </Typography>
                                    <Typography variant="body1">
                                        {sparePart.category}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Precio
                                    </Typography>
                                    <Typography variant="body1">
                                        ${sparePart.price}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Inventario
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="body2" color="text.secondary">
                                        Stock Actual
                                    </Typography>
                                    <Typography variant="h4">
                                        {sparePart.quantityInStock}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="body2" color="text.secondary">
                                        Stock Mínimo
                                    </Typography>
                                    <Typography variant="h4">
                                        {sparePart.minimumStock}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="body2" color="text.secondary">
                                        Estado
                                    </Typography>
                                    <Chip
                                        label={sparePart.quantityInStock <= sparePart.minimumStock ? 'Stock Bajo' : 'Stock Normal'}
                                        color={sparePart.quantityInStock <= sparePart.minimumStock ? 'error' : 'success'}
                                        size="large"
                                    />
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
                                {sparePart.description || 'Sin descripción'}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default SparePartDetailsPage;