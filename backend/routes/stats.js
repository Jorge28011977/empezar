const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener estadísticas de máquinas
router.get('/machines', async (req, res) => {
    try {
        // Simulación de estadísticas (en producción calcular desde BD)
        const stats = {
            total: 150,
            active: 120,
            maintenance: 20,
            inactive: 10
        };
        res.json(stats);
    } catch (error) {
        console.error('Error obteniendo estadísticas de máquinas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener estadísticas de mantenimientos
router.get('/maintenances', async (req, res) => {
    try {
        const stats = {
            total: 45,
            pending: 12,
            completed: 33,
            overdue: 5
        };
        res.json(stats);
    } catch (error) {
        console.error('Error obteniendo estadísticas de mantenimientos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener estadísticas de costos
router.get('/costs', async (req, res) => {
    try {
        const stats = {
            total: 125000,
            monthly: [
                { month: 'Ene', cost: 8500 },
                { month: 'Feb', cost: 9200 },
                { month: 'Mar', cost: 7800 },
                { month: 'Abr', cost: 10500 },
                { month: 'May', cost: 9800 },
                { month: 'Jun', cost: 11200 }
            ]
        };
        res.json(stats);
    } catch (error) {
        console.error('Error obteniendo estadísticas de costos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener estadísticas de técnicos
router.get('/technicians', async (req, res) => {
    try {
        const stats = {
            total: 25,
            available: 18,
            busy: 7
        };
        res.json(stats);
    } catch (error) {
        console.error('Error obteniendo estadísticas de técnicos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener alertas
router.get('/alerts', async (req, res) => {
    try {
        const alerts = [
            { id: 1, type: 'stock', message: 'Repuesto XYZ con stock bajo (5 unidades)', severity: 'warning' },
            { id: 2, type: 'maintenance', message: 'Mantenimiento pendiente para Máquina A', severity: 'error' },
            { id: 3, type: 'stock', message: 'Repuesto ABC agotado', severity: 'error' }
        ];
        res.json(alerts);
    } catch (error) {
        console.error('Error obteniendo alertas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;