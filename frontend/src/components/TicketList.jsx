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
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TicketList = ({ tickets, loading, onRefresh, onStatusFilter, onPriorityFilter }) => {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'error';
            case 'assigned': return 'warning';
            case 'in_progress': return 'info';
            case 'resolved': return 'success';
            case 'closed': return 'default';
            default: return 'default';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return 'error';
            case 'high': return 'warning';
            case 'medium': return 'info';
            case 'low': return 'success';
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

    if (tickets.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No se encontraron tickets
                </Typography>
            </Paper>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Estado</InputLabel>
                    <Select
                        value=""
                        label="Estado"
                        onChange={(e) => onStatusFilter(e.target.value)}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="open">Abierto</MenuItem>
                        <MenuItem value="assigned">Asignado</MenuItem>
                        <MenuItem value="in_progress">En Progreso</MenuItem>
                        <MenuItem value="resolved">Resuelto</MenuItem>
                        <MenuItem value="closed">Cerrado</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Prioridad</InputLabel>
                    <Select
                        value=""
                        label="Prioridad"
                        onChange={(e) => onPriorityFilter(e.target.value)}
                    >
                        <MenuItem value="">Todas</MenuItem>
                        <MenuItem value="low">Baja</MenuItem>
                        <MenuItem value="medium">Media</MenuItem>
                        <MenuItem value="high">Alta</MenuItem>
                        <MenuItem value="critical">Crítica</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Título</TableCell>
                            <TableCell>Máquina</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Prioridad</TableCell>
                            <TableCell>Técnico</TableCell>
                            <TableCell>Fecha Creación</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickets.map((ticket) => (
                            <TableRow key={ticket.id}>
                                <TableCell>{ticket.id}</TableCell>
                                <TableCell>{ticket.title}</TableCell>
                                <TableCell>
                                    {ticket.Machine ? `${ticket.Machine.name} (${ticket.Machine.model})` : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={ticket.status}
                                        color={getStatusColor(ticket.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={ticket.priority}
                                        color={getPriorityColor(ticket.priority)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {ticket.Technician ? ticket.Technician.User?.name : 'No asignado'}
                                </TableCell>
                                <TableCell>
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                                    >
                                        <Visibility />
                                    </IconButton>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
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
        </Box>
    );
};

export default TicketList;