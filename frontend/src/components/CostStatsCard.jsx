import React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import { AttachMoney } from '@mui/icons-material'

const CostStatsCard = ({ stats, loading }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6">Costos</Typography>
                    <Typography>Cargando...</Typography>
                </CardContent>
            </Card>
        )
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount)
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Costos
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                    <AttachMoney color="primary" />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                        Total: {formatCurrency(stats.total)}
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    Costo promedio mensual: {formatCurrency(stats.total / 12)}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default CostStatsCard