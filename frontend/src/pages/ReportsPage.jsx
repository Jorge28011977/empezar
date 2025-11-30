import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import ReportGenerator from '../components/ReportGenerator'

const ReportsPage = () => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Reportes
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Genera reportes en PDF o Excel de máquinas, mantenimientos, costos e inventario.
                </Typography>
                <ReportGenerator />
            </Box>
        </Container>
    )
}

export default ReportsPage