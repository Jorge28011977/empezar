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

const SparePartList = ({ spareParts, loading, onRefresh }) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (spareParts.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No se encontraron repuestos
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
                        <TableCell>Categoría</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Precio</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {spareParts.map((part) => (
                        <TableRow key={part.id}>
                            <TableCell>{part.id}</TableCell>
                            <TableCell>{part.name}</TableCell>
                            <TableCell>{part.category}</TableCell>
                            <TableCell>
                                <Chip
                                    label={`${part.quantityInStock}/${part.minimumStock}`}
                                    color={part.quantityInStock <= part.minimumStock ? 'error' : 'success'}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>${part.price}</TableCell>
                            <TableCell>
                                <IconButton
                                    color="primary"
                                    onClick={() => navigate(`/spare-parts/${part.id}`)}
                                >
                                    <Visibility />
                                </IconButton>
                                <IconButton
                                    color="secondary"
                                    onClick={() => navigate(`/spare-parts/${part.id}/edit`)}
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

export default SparePartList;