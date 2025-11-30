import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    TextField,
    MenuItem,
    Grid,
    Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MaintenanceList from '../components/MaintenanceList';
import apiMaintenances from '../services/apiMaintenances';

const MaintenancesPage = () => {
    const [maintenances, setMaintenances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: '',
        status: '',
        machineId: '',
        technicianId: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        loadMaintenances();
    }, [filters]);

    const loadMaintenances = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.type) params.type = filters.type;
            if (filters.status) params.status = filters.status;
            if (filters.machineId) params.machineId = filters.machineId;
            if (filters.technicianId) params.technicianId = filters.technicianId;

            const response = await apiMaintenances.getAll(params);
            setMaintenances(response.data);
        } catch (error) {
            console.error('Error loading maintenances:', error);
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
                    Gestión de Mantenimientos
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/maintenances/new')}
                        sx={{ mb: 2 }}
                    >
                        Nuevo Mantenimiento
                    </Button>
                </Box>

                <Paper sx={{ p: 2, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Filtros
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                select
                                fullWidth
                                label="Tipo"
                                value={filters.type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value="preventive">Preventivo</MenuItem>
                                <MenuItem value="corrective">Correctivo</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                select
                                fullWidth
                                label="Estado"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value="pending">Pendiente</MenuItem>
                                <MenuItem value="in_progress">En Progreso</MenuItem>
                                <MenuItem value="completed">Completado</MenuItem>
                                <MenuItem value="cancelled">Cancelado</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                label="ID Máquina"
                                value={filters.machineId}
                                onChange={(e) => handleFilterChange('machineId', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                label="ID Técnico"
                                value={filters.technicianId}
                                onChange={(e) => handleFilterChange('technicianId', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                <MaintenanceList
                    maintenances={maintenances}
                    loading={loading}
                    onRefresh={loadMaintenances}
                />
            </Box>
        </Container>
    );
};

export default MaintenancesPage;