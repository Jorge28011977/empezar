import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const TemplatesPage = () => {
    return (
        <Container maxWidth="xl">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Plantillas de Mantenimiento
                </Typography>
                <Typography variant="body1">
                    Página en desarrollo - Plantillas reutilizables para mantenimientos.
                </Typography>
            </Box>
        </Container>
    );
};

export default TemplatesPage;