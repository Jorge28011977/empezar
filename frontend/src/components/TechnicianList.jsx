import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    CircularProgress,
    Alert,
    Box
} from '@mui/material'
import { Visibility, Edit, Delete } from '@mui/icons-material'

const TechnicianList = ({ technicians, loading, error, onView, onEdit, onDelete }) => {
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                Error al cargar los técnicos: {error.message}
            </Alert>
        )
    }

    const getAvailabilityColor = (availability) => {
        return availability ? 'success' : 'error'
    }

    const getAvailabilityLabel = (availability) => {
        return availability ? 'Disponible' : 'No Disponible'
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre de Usuario</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Especialidad</TableCell>
                        <TableCell>Disponibilidad</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {technicians.map((technician) => (
                        <TableRow key={technician.id}>
                            <TableCell>{technician.User?.username || '-'}</TableCell>
                            <TableCell>{technician.User?.email || '-'}</TableCell>
                            <TableCell>{technician.specialization || '-'}</TableCell>
                            <TableCell>
                                <Chip
                                    label={getAvailabilityLabel(technician.availability)}
                                    color={getAvailabilityColor(technician.availability)}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    color="primary"
                                    onClick={() => onView(technician.id)}
                                    title="Ver detalles"
                                >
                                    <Visibility />
                                </IconButton>
                                <IconButton
                                    color="secondary"
                                    onClick={() => onEdit(technician)}
                                    title="Editar"
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => onDelete(technician.id)}
                                    title="Eliminar"
                                >
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TechnicianList