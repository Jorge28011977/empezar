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

const TemplateList = ({ templates, loading, onRefresh }) => {
    const navigate = useNavigate();

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
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (templates.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No se encontraron plantillas
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
                        <TableCell>Nombre</TableCell>
                        <TableCell>Tipo de Máquina</TableCell>
                        <TableCell>Frecuencia</TableCell>
                        <TableCell>Tiempo Estimado (horas)</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {templates.map((template) => (
                        <TableRow key={template.id}>
                            <TableCell>{template.id}</TableCell>
                            <TableCell>{template.name}</TableCell>
                            <TableCell>{template.machineType}</TableCell>
                            <TableCell>
                                <Chip
                                    label={template.frequency}
                                    color={getFrequencyColor(template.frequency)}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>{template.estimatedDuration}</TableCell>
                            <TableCell>
                                <IconButton
                                    color="primary"
                                    onClick={() => navigate(`/templates/${template.id}`)}
                                >
                                    <Visibility />
                                </IconButton>
                                <IconButton
                                    color="secondary"
                                    onClick={() => navigate(`/templates/${template.id}/edit`)}
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

export default TemplateList;