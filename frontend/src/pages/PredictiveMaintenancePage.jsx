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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { predictiveAPI } from '../services/api'
import { getMachines } from '../services/apiMachines'
import ARMaintenanceGuide from '../components/ARMaintenanceGuide'

const PredictiveMaintenancePage = () => {
    const [machines, setMachines] = useState([])
    const [selectedMachine, setSelectedMachine] = useState('')
    const [prediction, setPrediction] = useState(null)
    const [trends, setTrends] = useState(null)
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [openARGuide, setOpenARGuide] = useState(false)
    const [selectedMaintenanceType, setSelectedMaintenanceType] = useState('preventive')

    useEffect(() => {
        fetchMachines()
    }, [])

    const fetchMachines = async () => {
        try {
            const response = await getMachines()
            setMachines(response.data)
            if (response.data.length > 0) {
                setSelectedMachine(response.data[0].id)
            }
        } catch (err) {
            console.error('Error fetching machines:', err)
            setError('Error al cargar las máquinas')
        }
    }

    const fetchPredictionData = async (machineId) => {
        if (!machineId) return

        try {
            setLoading(true)
            setError(null)

            const [predResponse, trendsResponse, recResponse] = await Promise.all([
                predictiveAPI.getPrediction(machineId),
                predictiveAPI.getTrends(machineId),
                predictiveAPI.getRecommendations(machineId)
            ])

            setPrediction(predResponse.data)
            setTrends(trendsResponse.data)
            setRecommendations(recResponse.data.recommendations || [])
        } catch (err) {
            console.error('Error fetching prediction data:', err)
            setError('Error al cargar datos predictivos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (selectedMachine) {
            fetchPredictionData(selectedMachine)
        }
    }, [selectedMachine])

    const getRiskColor = (level) => {
        switch (level) {
            case 'high': return '#f44336'
            case 'medium': return '#ff9800'
            case 'low': return '#4caf50'
            default: return '#9e9e9e'
        }
    }

    const getRiskLabel = (level) => {
        switch (level) {
            case 'high': return 'Alto Riesgo'
            case 'medium': return 'Riesgo Moderado'
            case 'low': return 'Bajo Riesgo'
            default: return 'Desconocido'
        }
    }

    const prepareTrendData = () => {
        if (!trends?.trends) return []

        const data = []
        // Simplificar: mostrar promedio por sensor
        Object.keys(trends.trends).forEach(sensorType => {
            data.push({
                sensor: sensorType,
                average: trends.trends[sensorType].average || 0,
                trend: trends.trends[sensorType].trend
            })
        })
        return data
    }

    const riskDistribution = [
        { name: 'Bajo', value: 60, color: '#4caf50' },
        { name: 'Moderado', value: 30, color: '#ff9800' },
        { name: 'Alto', value: 10, color: '#f44336' }
    ]

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Mantenimiento Predictivo con IA
            </Typography>

            <Box sx={{ mb: 3 }}>
                <FormControl fullWidth sx={{ maxWidth: 300 }}>
                    <InputLabel>Seleccionar Máquina</InputLabel>
                    <Select
                        value={selectedMachine}
                        onChange={(e) => setSelectedMachine(e.target.value)}
                        label="Seleccionar Máquina"
                    >
                        {machines.map((machine) => (
                            <MenuItem key={machine.id} value={machine.id}>
                                {machine.name} - {machine.model}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {loading && <LinearProgress sx={{ mb: 2 }} />}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {prediction && (
                <Grid container spacing={3}>
                    {/* Risk Score Card */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Score de Riesgo
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h3" sx={{ mr: 2 }}>
                                        {prediction.riskScore}
                                    </Typography>
                                    <Chip
                                        label={getRiskLabel(prediction.riskLevel)}
                                        sx={{
                                            backgroundColor: getRiskColor(prediction.riskLevel),
                                            color: 'white'
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Confianza: {Math.round((prediction.confidence || 0) * 100)}%
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Días hasta mantenimiento: {prediction.daysToMaintenance}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Recommendations Card */}
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">
                                        Recomendaciones de Mantenimiento
                                    </Typography>
                                    <Button variant="outlined" onClick={() => setOpenDialog(true)} sx={{ mr: 1 }}>
                                        Ver Detalles
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            setSelectedMaintenanceType(prediction.riskLevel === 'high' ? 'emergency' :
                                                prediction.riskLevel === 'medium' ? 'corrective' : 'preventive')
                                            setOpenARGuide(true)
                                        }}
                                    >
                                        Guía AR
                                    </Button>
                                </Box>
                                <List dense>
                                    {recommendations.slice(0, 3).map((rec, index) => (
                                        <ListItem key={index}>
                                            <ListItemText
                                                primary={rec.title}
                                                secondary={rec.description}
                                            />
                                            <Chip
                                                label={rec.priority}
                                                size="small"
                                                color={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'success'}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Trends Chart */}
                    {trends && (
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Tendencias de Sensores (Últimos {trends.period})
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={prepareTrendData()}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="sensor" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="average" stroke="#8884d8" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {/* Risk Distribution */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Distribución de Riesgos en Flota
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={riskDistribution}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${value}%`}
                                        >
                                            {riskDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Recommendations Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Recomendaciones Detalladas de Mantenimiento</DialogTitle>
                <DialogContent>
                    <List>
                        {recommendations.map((rec, index) => (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="h6">{rec.title}</Typography>
                                                <Chip
                                                    label={rec.priority}
                                                    size="small"
                                                    color={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'success'}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2">{rec.description}</Typography>
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    <strong>Costo estimado:</strong> ${rec.estimatedCost} |
                                                    <strong> Tiempo estimado:</strong> {rec.estimatedTime}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < recommendations.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            {/* Guía AR de Mantenimiento */}
            <ARMaintenanceGuide
                open={openARGuide}
                onClose={() => setOpenARGuide(false)}
                machineId={selectedMachine}
                maintenanceType={selectedMaintenanceType}
            />
        </Container>
    )
}

export default PredictiveMaintenancePage