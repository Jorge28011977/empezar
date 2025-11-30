import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Card, CardContent, Typography } from '@mui/material'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const CostTrendLineChart = ({ stats, loading }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6">Tendencia de Costos</Typography>
                    <Typography>Cargando gráfico...</Typography>
                </CardContent>
            </Card>
        )
    }

    const data = {
        labels: stats.monthly.map(item => item.month),
        datasets: [
            {
                label: 'Costos (€)',
                data: stats.monthly.map(item => item.cost),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Costos Mensuales',
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `Costo: €${context.parsed.y}`
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Costo (€)'
                },
                ticks: {
                    callback: (value) => `€${value}`
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Mes'
                }
            }
        }
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Tendencia de Costos
                </Typography>
                <Line data={data} options={options} />
            </CardContent>
        </Card>
    )
}

export default CostTrendLineChart