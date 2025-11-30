import React, { useState } from 'react'
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Grid
} from '@mui/material'
import { PictureAsPdf, TableChart } from '@mui/icons-material'
import { generateMachinesReport, generateMaintenanceReport, generateCostReport, generateInventoryReport } from '../utils/reportGenerators'

const ReportGenerator = () => {
    const [reportType, setReportType] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleGeneratePDF = async () => {
        if (!reportType) {
            setError('Selecciona un tipo de reporte')
            return
        }
        setLoading(true)
        setError('')
        try {
            const filters = { startDate, endDate }
            switch (reportType) {
                case 'machines':
                    await generateMachinesReport('pdf', filters)
                    break
                case 'maintenance':
                    await generateMaintenanceReport('pdf', filters)
                    break
                case 'cost':
                    await generateCostReport('pdf', filters)
                    break
                case 'inventory':
                    await generateInventoryReport('pdf', filters)
                    break
                default:
                    throw new Error('Tipo de reporte no válido')
            }
        } catch (err) {
            setError('Error al generar el reporte: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateExcel = async () => {
        if (!reportType) {
            setError('Selecciona un tipo de reporte')
            return
        }
        setLoading(true)
        setError('')
        try {
            const filters = { startDate, endDate }
            switch (reportType) {
                case 'machines':
                    await generateMachinesReport('excel', filters)
                    break
                case 'maintenance':
                    await generateMaintenanceReport('excel', filters)
                    break
                case 'cost':
                    await generateCostReport('excel', filters)
                    break
                case 'inventory':
                    await generateInventoryReport('excel', filters)
                    break
                default:
                    throw new Error('Tipo de reporte no válido')
            }
        } catch (err) {
            setError('Error al generar el reporte: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Generador de Reportes
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Tipo de Reporte</InputLabel>
                        <Select
                            value={reportType}
                            label="Tipo de Reporte"
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            <MenuItem value="machines">Lista de Máquinas</MenuItem>
                            <MenuItem value="maintenance">Historial de Mantenimientos</MenuItem>
                            <MenuItem value="cost">Costos Totales</MenuItem>
                            <MenuItem value="inventory">Estado de Inventario</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Fecha Inicio"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Fecha Fin"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Box display="flex" gap={2} justifyContent="center">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={loading ? <CircularProgress size={20} /> : <PictureAsPdf />}
                            onClick={handleGeneratePDF}
                            disabled={loading}
                        >
                            {loading ? 'Generando...' : 'Generar PDF'}
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={loading ? <CircularProgress size={20} /> : <TableChart />}
                            onClick={handleGenerateExcel}
                            disabled={loading}
                        >
                            {loading ? 'Generando...' : 'Generar Excel'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default ReportGenerator