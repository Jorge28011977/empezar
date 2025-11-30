import React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import { Build, CheckCircle, Error, Warning } from '@mui/icons-material'

const MachineStatsCard = ({ stats, loading }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6">Máquinas</Typography>
                    <Typography>Cargando...</Typography>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Máquinas
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                    <Build color="primary" />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                        Total: {stats.total}
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                    <CheckCircle color="success" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        Activas: {stats.active}
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                    <Warning color="warning" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        En Mantenimiento: {stats.maintenance}
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    <Error color="error" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        Inactivas: {stats.inactive}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

export default MachineStatsCard