import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Card, CardContent, Typography } from '@mui/material'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const MaintenanceTrendBarChart = ({ loading }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6">Tendencia de Mantenimientos</Typography>
                    <Typography>Cargando gráfico...</Typography>
                </CardContent>
            </Card>
        )
    }

    // Datos mock para mantenimientos por mes
    const monthlyData = [
        { month: 'Ene', count: 8 },
        { month: 'Feb', count: 12 },
        { month: 'Mar', count: 6 },
        { month: 'Abr', count: 15 },
        { month: 'May', count: 10 },
        { month: 'Jun', count: 18 }
    ]

    const data = {
        labels: monthlyData.map(item => item.month),
        datasets: [
            {
                label: 'Mantenimientos',
                data: monthlyData.map(item => item.count),
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
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
                text: 'Mantenimientos por Mes',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Número de Mantenimientos'
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
                    Tendencia de Mantenimientos
                </Typography>
                <Bar data={data} options={options} />
            </CardContent>
        </Card>
    )
}

export default MaintenanceTrendBarChart