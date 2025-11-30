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
    Divider,
    Tabs,
    Tab
} from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import api from '../services/api'

const CoreBankingPage = () => {
    const [bankingData, setBankingData] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [integrations, setIntegrations] = useState([])
    const [tabValue, setTabValue] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [openDialog, setOpenDialog] = useState(false)

    useEffect(() => {
        fetchCoreBankingData()
    }, [])

    const fetchCoreBankingData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Simular datos de core banking
            const mockBankingData = {
                totalAccounts: 1250,
                activeIntegrations: 8,
                totalTransactions: 45632,
                successRate: 99.7,
                avgProcessingTime: '1.2 segundos',
                monthlyVolume: '€2.4M',
                apiCalls: 892340,
                uptime: 99.98
            }

            const mockTransactions = [
                { id: 'TXN001', type: 'Transfer', amount: 50000, status: 'completed', timestamp: '2025-11-30T10:30:00Z', client: 'Banco Santander' },
                { id: 'TXN002', type: 'Payment', amount: 2500, status: 'processing', timestamp: '2025-11-30T10:25:00Z', client: 'BBVA' },
                { id: 'TXN003', type: 'Deposit', amount: 100000, status: 'completed', timestamp: '2025-11-30T10:20:00Z', client: 'CaixaBank' },
                { id: 'TXN004', type: 'Withdrawal', amount: 7500, status: 'failed', timestamp: '2025-11-30T10:15:00Z', client: 'Banco Sabadell' }
            ]

            const mockIntegrations = [
                { bank: 'Banco Santander', status: 'active', transactions: 12543, uptime: 99.9, lastSync: '2025-11-30T10:30:00Z' },
                { bank: 'BBVA', status: 'active', transactions: 9876, uptime: 99.8, lastSync: '2025-11-30T10:28:00Z' },
                { bank: 'CaixaBank', status: 'active', transactions: 15678, uptime: 100.0, lastSync: '2025-11-30T10:25:00Z' },
                { bank: 'Banco Sabadell', status: 'maintenance', transactions: 5432, uptime: 98.5, lastSync: '2025-11-30T09:45:00Z' }
            ]

            setBankingData(mockBankingData)
            setTransactions(mockTransactions)
            setIntegrations(mockIntegrations)

        } catch (err) {
            console.error('Error fetching core banking data:', err)
            setError('Error al cargar datos de core banking')
        } finally {
            setLoading(false)
        }
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#4caf50'
            case 'processing': return '#ff9800'
            case 'failed': return '#f44336'
            case 'active': return '#4caf50'
            case 'maintenance': return '#ff9800'
            default: return '#9e9e9e'
        }
    }

    const transactionVolume = [
        { month: 'Ene', volume: 1800000 },
        { month: 'Feb', volume: 2100000 },
        { month: 'Mar', volume: 1950000 },
        { month: 'Abr', volume: 2300000 },
        { month: 'May', volume: 2400000 },
        { month: 'Jun', volume: 2200000 }
    ]

    const apiPerformance = [
        { hour: '00', calls: 12000 },
        { hour: '04', calls: 8000 },
        { hour: '08', calls: 25000 },
        { hour: '12', calls: 35000 },
        { hour: '16', calls: 28000 },
        { hour: '20', calls: 18000 }
    ]

    const integrationStatus = integrations.reduce((acc, integration) => {
        acc[integration.status] = (acc[integration.status] || 0) + 1
        return acc
    }, {})

    const statusChartData = Object.entries(integrationStatus).map(([status, count]) => ({
        name: status,
        value: count,
        color: getStatusColor(status)
    }))

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard Core Banking
            </Typography>

            {loading && <LinearProgress sx={{ mb: 2 }} />}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {bankingData && (
                <>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        {/* Key Metrics */}
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Cuentas Totales
                                    </Typography>
                                    <Typography variant="h3" color="primary">
                                        {bankingData.totalAccounts.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Activas y gestionadas
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Integraciones Activas
                                    </Typography>
                                    <Typography variant="h3" color="success.main">
                                        {bankingData.activeIntegrations}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Bancos conectados
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Tasa de Éxito
                                    </Typography>
                                    <Typography variant="h3" color="success.main">
                                        {bankingData.successRate}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Transacciones exitosas
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Volumen Mensual
                                    </Typography>
                                    <Typography variant="h3" color="primary">
                                        {bankingData.monthlyVolume}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Procesado este mes
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="core banking tabs">
                            <Tab label="Transacciones" />
                            <Tab label="Integraciones" />
                            <Tab label="Analytics" />
                        </Tabs>
                    </Box>

                    {/* Transactions Tab */}
                    {tabValue === 0 && (
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6">
                                                Transacciones Recientes
                                            </Typography>
                                            <Button variant="outlined" size="small" onClick={() => setOpenDialog(true)}>
                                                Ver Todas
                                            </Button>
                                        </Box>
                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>ID Transacción</TableCell>
                                                        <TableCell>Tipo</TableCell>
                                                        <TableCell align="right">Monto (€)</TableCell>
                                                        <TableCell>Cliente</TableCell>
                                                        <TableCell>Estado</TableCell>
                                                        <TableCell>Timestamp</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {transactions.map((transaction) => (
                                                        <TableRow key={transaction.id}>
                                                            <TableCell>{transaction.id}</TableCell>
                                                            <TableCell>{transaction.type}</TableCell>
                                                            <TableCell align="right">{transaction.amount.toLocaleString()}</TableCell>
                                                            <TableCell>{transaction.client}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={transaction.status}
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: getStatusColor(transaction.status),
                                                                        color: 'white'
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
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

                    {/* Integrations Tab */}
                    {tabValue === 1 && (
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Estado de Integraciones
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={statusChartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    dataKey="value"
                                                    label={({ name, value }) => `${name}: ${value}`}
                                                >
                                                    {statusChartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Detalles de Integraciones
                                        </Typography>
                                        <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Banco</TableCell>
                                                        <TableCell>Estado</TableCell>
                                                        <TableCell align="right">Transacciones</TableCell>
                                                        <TableCell align="right">Uptime</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {integrations.map((integration) => (
                                                        <TableRow key={integration.bank}>
                                                            <TableCell>{integration.bank}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={integration.status}
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: getStatusColor(integration.status),
                                                                        color: 'white'
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="right">{integration.transactions.toLocaleString()}</TableCell>
                                                            <TableCell align="right">{integration.uptime}%</TableCell>
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

                    {/* Analytics Tab */}
                    {tabValue === 2 && (
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Volumen de Transacciones (6 Meses)
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={transactionVolume}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => [`€${value.toLocaleString()}`, 'Volumen']} />
                                                <Bar dataKey="volume" fill="#8884d8" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Llamadas API por Hora
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={apiPerformance}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="hour" />
                                                <YAxis />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="calls" stroke="#82ca9d" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}
                </>
            )}

            {/* Transactions Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
                <DialogTitle>Historial Completo de Transacciones</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell align="right">Monto</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Timestamp</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{transaction.id}</TableCell>
                                        <TableCell>{transaction.type}</TableCell>
                                        <TableCell align="right">€{transaction.amount.toLocaleString()}</TableCell>
                                        <TableCell>{transaction.client}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={transaction.status}
                                                size="small"
                                                sx={{
                                                    backgroundColor: getStatusColor(transaction.status),
                                                    color: 'white'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default CoreBankingPage