import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const TicketsPage = () => {
    return (
        <Container maxWidth="xl">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sistema de Tickets
                </Typography>
                <Typography variant="body1">
                    Página en desarrollo - Sistema de tickets para incidencias.
                </Typography>
            </Box>
        </Container>
    );
};

export default TicketsPage;