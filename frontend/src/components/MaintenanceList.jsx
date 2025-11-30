import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    CircularProgress,
    Box,
    Typography
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MaintenanceList = ({ maintenances, loading, onRefresh }) => {
    const navigate = useNavigate();

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
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (maintenances.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No se encontraron mantenimientos
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Máquina</TableCell>
                        <TableCell>Técnico</TableCell>
                        <TableCell>Fecha Programada</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {maintenances.map((maintenance) => (
                        <TableRow key={maintenance.id}>
                            <TableCell>{maintenance.id}</TableCell>
                            <TableCell>
                                <Chip
                                    label={maintenance.type === 'preventive' ? 'Preventivo' : 'Correctivo'}
                                    color={getTypeColor(maintenance.type)}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={maintenance.status}
                                    color={getStatusColor(maintenance.status)}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                {maintenance.Machine ? maintenance.Machine.name : 'N/A'}
                            </TableCell>
                            <TableCell>
                                {maintenance.Technician ? maintenance.Technician.User?.name : 'N/A'}
                            </TableCell>
                            <TableCell>
                                {new Date(maintenance.scheduledDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    color="primary"
                                    onClick={() => navigate(`/maintenances/${maintenance.id}`)}
                                >
                                    <Visibility />
                                </IconButton>
                                <IconButton
                                    color="secondary"
                                    onClick={() => navigate(`/maintenances/${maintenance.id}/edit`)}
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton color="error">
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MaintenanceList;