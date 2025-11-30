import React from 'react'
import { Grid, Container, Typography, Box } from '@mui/material'
import MachineStatsCard from './MachineStatsCard'
import MaintenanceStatsCard from './MaintenanceStatsCard'
import CostStatsCard from './CostStatsCard'
import TechnicianStatsCard from './TechnicianStatsCard'
import MachineStatusPieChart from './MachineStatusPieChart'
import MaintenanceTrendBarChart from './MaintenanceTrendBarChart'
import CostTrendLineChart from './CostTrendLineChart'
import AlertsPanel from './AlertsPanel'

const Dashboard = ({ stats, alerts, loading }) => {
    return (
        <Container maxWidth="xl">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard de Mantenimiento
                </Typography>

                {/* Métricas principales */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <MachineStatsCard stats={stats.machines} loading={loading} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <MaintenanceStatsCard stats={stats.maintenances} loading={loading} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <CostStatsCard stats={stats.costs} loading={loading} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TechnicianStatsCard stats={stats.technicians} loading={loading} />
                    </Grid>
                </Grid>

                {/* Gráficos */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <MachineStatusPieChart stats={stats.machines} loading={loading} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <MaintenanceTrendBarChart loading={loading} />
                    </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <CostTrendLineChart stats={stats.costs} loading={loading} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <AlertsPanel alerts={alerts} loading={loading} />
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default Dashboard