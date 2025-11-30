import React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import { Assignment, Pending, CheckCircle, Error } from '@mui/icons-material'

const MaintenanceStatsCard = ({ stats, loading }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6">Mantenimientos</Typography>
                    <Typography>Cargando...</Typography>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Mantenimientos
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                    <Assignment color="primary" />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                        Total: {stats.total}
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                    <Pending color="warning" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        Pendientes: {stats.pending}
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                    <CheckCircle color="success" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        Completados: {stats.completed}
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    <Error color="error" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        Vencidos: {stats.overdue}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

export default MaintenanceStatsCard