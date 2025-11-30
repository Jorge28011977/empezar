import React from 'react'
import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material'
import { Warning, Error, Info } from '@mui/icons-material'

const AlertsPanel = ({ alerts, loading }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6">Alertas</Typography>
                    <Typography>Cargando alertas...</Typography>
                </CardContent>
            </Card>
        )
    }

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'error':
                return <Error color="error" />
            case 'warning':
                return <Warning color="warning" />
            default:
                return <Info color="info" />
        }
    }

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'error':
                return 'error'
            case 'warning':
                return 'warning'
            default:
                return 'info'
        }
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Alertas
                </Typography>
                {alerts.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No hay alertas activas
                    </Typography>
                ) : (
                    <List dense>
                        {alerts.map((alert) => (
                            <ListItem key={alert.id}>
                                <ListItemIcon>
                                    {getSeverityIcon(alert.severity)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={alert.message}
                                    secondary={
                                        <Chip
                                            label={alert.type === 'stock' ? 'Stock Bajo' : 'Mantenimiento'}
                                            size="small"
                                            color={getSeverityColor(alert.severity)}
                                            variant="outlined"
                                        />
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    )
}

export default AlertsPanel