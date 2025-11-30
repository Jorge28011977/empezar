import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    TextField,
    Grid,
    Paper,
    MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SparePartList from '../components/SparePartList';
import apiSpareParts from '../services/apiSpareParts';

const SparePartsPage = () => {
    const [spareParts, setSpareParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        lowStock: false
    });
    const navigate = useNavigate();

    useEffect(() => {
        loadSpareParts();
    }, [filters]);

    const loadSpareParts = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.category) params.category = filters.category;
            if (filters.lowStock) params.lowStock = true;

            const response = await apiSpareParts.getAll(params);
            setSpareParts(response.data);
        } catch (error) {
            console.error('Error loading spare parts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Gestión de Repuestos
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/spare-parts/new')}
                        sx={{ mb: 2 }}
                    >
                        Nuevo Repuesto
                    </Button>
                </Box>

                <Paper sx={{ p: 2, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Filtros
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Categoría"
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                select
                                fullWidth
                                label="Stock Bajo"
                                value={filters.lowStock}
                                onChange={(e) => handleFilterChange('lowStock', e.target.value === 'true')}
                            >
                                <MenuItem value={false}>Todos</MenuItem>
                                <MenuItem value={true}>Solo Stock Bajo</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </Paper>

                <SparePartList
                    spareParts={spareParts}
                    loading={loading}
                    onRefresh={loadSpareParts}
                />
            </Box>
        </Container>
    );
};

export default SparePartsPage;