import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Card, CardContent, Typography } from '@mui/material'

ChartJS.register(ArcElement, Tooltip, Legend)

const MachineStatusPieChart = ({ stats, loading }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6">Estado de Máquinas</Typography>
                    <Typography>Cargando gráfico...</Typography>
                </CardContent>
            </Card>
        )
    }

    const data = {
        labels: ['Activas', 'En Mantenimiento', 'Inactivas'],
        datasets: [
            {
                data: [stats.active, stats.maintenance, stats.inactive],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.8)', // verde
                    'rgba(255, 152, 0, 0.8)', // naranja
                    'rgba(244, 67, 54, 0.8)', // rojo
                ],
                borderColor: [
                    'rgba(76, 175, 80, 1)',
                    'rgba(255, 152, 0, 1)',
                    'rgba(244, 67, 54, 1)',
                ],
                borderWidth: 1,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || ''
                        const value = context.parsed
                        const total = context.dataset.data.reduce((a, b) => a + b, 0)
                        const percentage = ((value / total) * 100).toFixed(1)
                        return `${label}: ${value} (${percentage}%)`
                    },
                },
            },
        },
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Estado de Máquinas
                </Typography>
                <Pie data={data} options={options} />
            </CardContent>
        </Card>
    )
}

export default MachineStatusPieChart