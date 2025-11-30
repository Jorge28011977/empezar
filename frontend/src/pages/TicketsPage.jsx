import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TicketList from '../components/TicketList';
import apiTickets from '../services/apiTickets';

const TicketsPage = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async (statusFilter = '', priorityFilter = '') => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter) params.status = statusFilter;
            if (priorityFilter) params.priority = priorityFilter;

            const response = await apiTickets.getAll(params);
            setTickets(response.data);
        } catch (err) {
            setError('Error al cargar los tickets');
            console.error('Error loading tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusFilter = (status) => {
        loadTickets(status, '');
    };

    const handlePriorityFilter = (priority) => {
        loadTickets('', priority);
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Sistema de Tickets
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/tickets/new')}
                    >
                        Nuevo Ticket
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <TicketList
                    tickets={tickets}
                    loading={loading}
                    onRefresh={loadTickets}
                    onStatusFilter={handleStatusFilter}
                    onPriorityFilter={handlePriorityFilter}
                />
            </Box>
        </Container>
    );
};

export default TicketsPage;