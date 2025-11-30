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

const MachineList = ({ machines, loading, error, onView, onEdit, onDelete }) => {
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
                Error al cargar las máquinas: {error.message}
            </Alert>
        )
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'success'
            case 'inactive':
                return 'error'
            case 'maintenance':
                return 'warning'
            default:
                return 'default'
        }
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active':
                return 'Activa'
            case 'inactive':
                return 'Inactiva'
            case 'maintenance':
                return 'En Mantenimiento'
            default:
                return status
        }
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Modelo</TableCell>
                        <TableCell>Número de Serie</TableCell>
                        <TableCell>Ubicación</TableCell>
                        <TableCell>Fecha de Instalación</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {machines.map((machine) => (
                        <TableRow key={machine.id}>
                            <TableCell>{machine.name}</TableCell>
                            <TableCell>{machine.model || '-'}</TableCell>
                            <TableCell>{machine.serial_number}</TableCell>
                            <TableCell>{machine.location || '-'}</TableCell>
                            <TableCell>
                                {machine.installation_date
                                    ? new Date(machine.installation_date).toLocaleDateString()
                                    : '-'}
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={getStatusLabel(machine.status)}
                                    color={getStatusColor(machine.status)}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    color="primary"
                                    onClick={() => onView(machine.id)}
                                    title="Ver detalles"
                                >
                                    <Visibility />
                                </IconButton>
                                <IconButton
                                    color="secondary"
                                    onClick={() => onEdit(machine)}
                                    title="Editar"
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => onDelete(machine.id)}
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

export default MachineList