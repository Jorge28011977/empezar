import React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import { People, CheckCircle, Schedule } from '@mui/icons-material'

const TechnicianStatsCard = ({ stats, loading }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6">Técnicos</Typography>
                    <Typography>Cargando...</Typography>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Técnicos
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                    <People color="primary" />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                        Total: {stats.total}
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                    <CheckCircle color="success" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        Disponibles: {stats.available}
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    <Schedule color="warning" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        Ocupados: {stats.busy}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

export default TechnicianStatsCard