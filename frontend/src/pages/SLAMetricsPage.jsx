import React, { useState, useEffect } from 'react'
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
    Chip,
    LinearProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import api from '../services/api'

const SLAMetricsPage = () => {
    const [slaData, setSlaData] = useState(null)
    const [contractMetrics, setContractMetrics] = useState([])
    const [performanceData, setPerformanceData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [openDialog, setOpenDialog] = useState(false)

    useEffect(() => {
        fetchSLAMetrics()
    }, [])

    const fetchSLAMetrics = async () => {
        try {
            setLoading(true)
            setError(null)

            // Simular datos SLA (en producción vendrían de la API)
            const mockSLAData = {
                overallCompliance: 94.2,
                criticalSLAs: 98.5,
                standardSLAs: 92.1,
                emergencyResponse: 99.8,
                avgResolutionTime: '1.8 horas',
                maxResolutionTime: '4.2 horas',
                uptime: 99.95,
                mttr: '45 minutos',
                mtbf: '28 días'
            }

            const mockContractMetrics = [
                { client: 'Banco Santander', slaCompliance: 96.8, incidents: 2, resolution: '1.5h' },
                { client: 'BBVA', slaCompliance: 94.3, incidents: 5, resolution: '2.1h' },
                { client: 'CaixaBank', slaCompliance: 97.1, incidents: 1, resolution: '1.2h' },
                { client: 'Banco Sabadell', slaCompliance: 92.5, incidents: 8, resolution: '2.8h' }
            ]

            const mockPerformanceData = [
                { month: 'Ene', compliance: 95.2, incidents: 12, uptime: 99.9 },
                { month: 'Feb', compliance: 96.1, incidents: 8, uptime: 99.95 },
                { month: 'Mar', compliance: 94.8, incidents: 15, uptime: 99.8 },
                { month: 'Abr', compliance: 97.2, incidents: 6, uptime: 99.98 },
                { month: 'May', compliance: 95.9, incidents: 10, uptime: 99.92 },
                { month: 'Jun', compliance: 94.2, incidents: 18, uptime: 99.85 }
            ]

            setSlaData(mockSLAData)
            setContractMetrics(mockContractMetrics)
            setPerformanceData(mockPerformanceData)

        } catch (err) {
            console.error('Error fetching SLA metrics:', err)
            setError('Error al cargar métricas SLA')
        } finally {
            setLoading(false)
        }
    }

    const getSLAColor = (compliance) => {
        if (compliance >= 95) return '#4caf50'
        if (compliance >= 90) return '#ff9800'
        return '#f44336'
    }

    const getSLAStatus = (compliance) => {
        if (compliance >= 95) return 'Excelente'
        if (compliance >= 90) return 'Aceptable'
        return 'Requiere Atención'
    }

    const slaBreakdown = slaData ? [
        { name: 'Críticos', value: slaData.criticalSLAs, color: '#4caf50' },
        { name: 'Estándar', value: slaData.standardSLAs, color: '#2196f3' },
        { name: 'Emergencia', value: slaData.emergencyResponse, color: '#ff9800' }
    ] : []

    const incidentDistribution = [
        { name: 'Resueltos < 1h', value: 65, color: '#4caf50' },
        { name: 'Resueltos 1-4h', value: 25, color: '#ff9800' },
        { name: 'Resueltos > 4h', value: 10, color: '#f44336' }
    ]

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Métricas SLA y Rendimiento
            </Typography>

            {loading && <LinearProgress sx={{ mb: 2 }} />}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {slaData && (
                <Grid container spacing={3}>
                    {/* Overall SLA Compliance */}
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Cumplimiento SLA General
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h3" sx={{ mr: 2 }}>
                                        {slaData.overallCompliance}%
                                    </Typography>
                                    <Chip
                                        label={getSLAStatus(slaData.overallCompliance)}
                                        sx={{
                                            backgroundColor: getSLAColor(slaData.overallCompliance),
                                            color: 'white'
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Uptime: {slaData.uptime}%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Response Times */}
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Tiempos de Respuesta
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body1">
                                        Promedio: <strong>{slaData.avgResolutionTime}</strong>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Máximo: {slaData.maxResolutionTime}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        MTTR: {slaData.mttr}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Reliability Metrics */}
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Métricas de Confiabilidad
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body1">
                                        MTBF: <strong>{slaData.mtbf}</strong>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Disponibilidad: {slaData.uptime}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Respuesta Emergencia: {slaData.emergencyResponse}%
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* SLA Breakdown */}
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Desglose SLA
                                </Typography>
                                <ResponsiveContainer width="100%" height={150}>
                                    <PieChart>
                                        <Pie
                                            data={slaBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={50}
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${value}%`}
                                        >
                                            {slaBreakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Performance Trend */}
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Tendencia de Rendimiento (Últimos 6 Meses)
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={performanceData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis yAxisId="left" domain={[90, 100]} />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip />
                                        <Line yAxisId="left" type="monotone" dataKey="compliance" stroke="#8884d8" name="Cumplimiento SLA %" />
                                        <Line yAxisId="right" type="monotone" dataKey="incidents" stroke="#82ca9d" name="Incidentes" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Incident Resolution Distribution */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Distribución de Resolución de Incidentes
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={incidentDistribution}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${value}%`}
                                        >
                                            {incidentDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Client SLA Performance */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">
                                        Rendimiento SLA por Cliente
                                    </Typography>
                                    <Button variant="outlined" size="small" onClick={() => setOpenDialog(true)}>
                                        Ver Detalles
                                    </Button>
                                </Box>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Cliente</TableCell>
                                                <TableCell align="right">Cumplimiento SLA</TableCell>
                                                <TableCell align="right">Incidentes</TableCell>
                                                <TableCell align="right">Tiempo Resolución</TableCell>
                                                <TableCell>Estado</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {contractMetrics.map((client) => (
                                                <TableRow key={client.client}>
                                                    <TableCell>{client.client}</TableCell>
                                                    <TableCell align="right">{client.slaCompliance}%</TableCell>
                                                    <TableCell align="right">{client.incidents}</TableCell>
                                                    <TableCell align="right">{client.resolution}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={getSLAStatus(client.slaCompliance)}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: getSLAColor(client.slaCompliance),
                                                                color: 'white'
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Client Details Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Detalles de SLA por Cliente</DialogTitle>
                <DialogContent>
                    <List>
                        {contractMetrics.map((client) => (
                            <ListItem key={client.client} divider>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography variant="h6">{client.client}</Typography>
                                            <Chip
                                                label={`${client.slaCompliance}%`}
                                                sx={{
                                                    backgroundColor: getSLAColor(client.slaCompliance),
                                                    color: 'white'
                                                }}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="body2">
                                                Incidentes del período: {client.incidents}
                                            </Typography>
                                            <Typography variant="body2">
                                                Tiempo promedio de resolución: {client.resolution}
                                            </Typography>
                                            <Typography variant="body2">
                                                Estado del contrato: {getSLAStatus(client.slaCompliance)}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default SLAMetricsPage