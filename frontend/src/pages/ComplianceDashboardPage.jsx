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
    ListItemText
} from '@mui/material'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../services/api'

const ComplianceDashboardPage = () => {
    const [complianceData, setComplianceData] = useState(null)
    const [auditLogs, setAuditLogs] = useState([])
    const [slaMetrics, setSlaMetrics] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [openDialog, setOpenDialog] = useState(false)

    useEffect(() => {
        fetchComplianceData()
    }, [])

    const fetchComplianceData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Obtener logs de auditoría
            const auditResponse = await api.get('/audit/logs?limit=50')
            setAuditLogs(auditResponse.data)

            // Calcular métricas de cumplimiento
            const complianceMetrics = calculateComplianceMetrics(auditResponse.data)
            setComplianceData(complianceMetrics)

            // Calcular métricas SLA (simulado por ahora)
            setSlaMetrics({
                overallCompliance: 92,
                criticalIncidents: 2,
                resolvedIncidents: 45,
                avgResolutionTime: '2.3 horas',
                uptime: 99.7
            })

        } catch (err) {
            console.error('Error fetching compliance data:', err)
            setError('Error al cargar datos de cumplimiento')
        } finally {
            setLoading(false)
        }
    }

    const calculateComplianceMetrics = (logs) => {
        const totalLogs = logs.length
        const securityEvents = logs.filter(log => log.action.includes('security') || log.action.includes('auth')).length
        const maintenanceEvents = logs.filter(log => log.action.includes('maintenance')).length
        const complianceEvents = logs.filter(log => log.action.includes('compliance') || log.action.includes('audit')).length

        return {
            totalAudits: totalLogs,
            securityCompliance: Math.round((securityEvents / totalLogs) * 100),
            maintenanceCompliance: Math.round((maintenanceEvents / totalLogs) * 100),
            regulatoryCompliance: Math.round((complianceEvents / totalLogs) * 100),
            pciDssScore: 95, // Simulado
            gdprScore: 88, // Simulado
            soxScore: 92 // Simulado
        }
    }

    const complianceChartData = complianceData ? [
        { name: 'Seguridad', value: complianceData.securityCompliance, color: '#4caf50' },
        { name: 'Mantenimiento', value: complianceData.maintenanceCompliance, color: '#2196f3' },
        { name: 'Regulatorio', value: complianceData.regulatoryCompliance, color: '#ff9800' }
    ] : []

    const regulatoryScores = complianceData ? [
        { name: 'PCI DSS', score: complianceData.pciDssScore },
        { name: 'GDPR', score: complianceData.gdprScore },
        { name: 'SOX', score: complianceData.soxScore }
    ] : []

    const getComplianceColor = (score) => {
        if (score >= 90) return '#4caf50'
        if (score >= 70) return '#ff9800'
        return '#f44336'
    }

    const getComplianceLabel = (score) => {
        if (score >= 90) return 'Excelente'
        if (score >= 70) return 'Aceptable'
        return 'Requiere Atención'
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard de Cumplimiento Normativo
            </Typography>

            {loading && <LinearProgress sx={{ mb: 2 }} />}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {complianceData && slaMetrics && (
                <Grid container spacing={3}>
                    {/* Overall Compliance Score */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Score General de Cumplimiento
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h3" sx={{ mr: 2 }}>
                                        {Math.round((complianceData.securityCompliance + complianceData.maintenanceCompliance + complianceData.regulatoryCompliance) / 3)}%
                                    </Typography>
                                    <Chip
                                        label={getComplianceLabel(Math.round((complianceData.securityCompliance + complianceData.maintenanceCompliance + complianceData.regulatoryCompliance) / 3))}
                                        sx={{
                                            backgroundColor: getComplianceColor(Math.round((complianceData.securityCompliance + complianceData.maintenanceCompliance + complianceData.regulatoryCompliance) / 3)),
                                            color: 'white'
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Basado en {complianceData.totalAudits} eventos auditados
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* SLA Metrics */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Métricas SLA
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body1">
                                        Cumplimiento General: <strong>{slaMetrics.overallCompliance}%</strong>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Uptime: {slaMetrics.uptime}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tiempo Promedio de Resolución: {slaMetrics.avgResolutionTime}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Chip label={`${slaMetrics.criticalIncidents} Incidentes Críticos`} color="error" size="small" />
                                    <Chip label={`${slaMetrics.resolvedIncidents} Resueltos`} color="success" size="small" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Regulatory Compliance */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Cumplimiento Regulatorio
                                </Typography>
                                <ResponsiveContainer width="100%" height={150}>
                                    <BarChart data={regulatoryScores}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Bar dataKey="score" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Compliance Breakdown */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Desglose de Cumplimiento
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={complianceChartData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${value}%`}
                                        >
                                            {complianceChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Recent Audit Logs */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">
                                        Logs de Auditoría Recientes
                                    </Typography>
                                    <Button variant="outlined" size="small" onClick={() => setOpenDialog(true)}>
                                        Ver Todos
                                    </Button>
                                </Box>
                                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Fecha</TableCell>
                                                <TableCell>Acción</TableCell>
                                                <TableCell>Usuario</TableCell>
                                                <TableCell>Estado</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {auditLogs.slice(0, 5).map((log) => (
                                                <TableRow key={log.id}>
                                                    <TableCell>{new Date(log.timestamp).toLocaleDateString()}</TableCell>
                                                    <TableCell>{log.action}</TableCell>
                                                    <TableCell>{log.user_id || 'Sistema'}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={log.status || 'OK'}
                                                            size="small"
                                                            color={log.status === 'ERROR' ? 'error' : 'success'}
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

            {/* Audit Logs Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Logs de Auditoría Completos</DialogTitle>
                <DialogContent>
                    <List>
                        {auditLogs.map((log) => (
                            <ListItem key={log.id} divider>
                                <ListItemText
                                    primary={`${log.action} - ${log.user_id || 'Sistema'}`}
                                    secondary={
                                        <Box>
                                            <Typography variant="body2">
                                                Fecha: {new Date(log.timestamp).toLocaleString()}
                                            </Typography>
                                            <Typography variant="body2">
                                                Detalles: {log.details || 'Sin detalles adicionales'}
                                            </Typography>
                                            <Chip
                                                label={log.status || 'OK'}
                                                size="small"
                                                color={log.status === 'ERROR' ? 'error' : 'success'}
                                                sx={{ mt: 1 }}
                                            />
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

export default ComplianceDashboardPage