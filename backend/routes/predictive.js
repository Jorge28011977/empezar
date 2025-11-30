const express = require('express');
const router = express.Router();
const predictiveController = require('../controllers/predictiveController');
const auth = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

// GET /api/predictive/machines/:machineId/predict
// Predecir mantenimiento preventivo para una máquina
router.get('/machines/:machineId/predict', predictiveController.predictMaintenance);

// GET /api/predictive/machines/:machineId/trends?days=30
// Obtener tendencias de fallos para una máquina
router.get('/machines/:machineId/trends', predictiveController.getFailureTrends);

// GET /api/predictive/machines/:machineId/recommendations
// Obtener recomendaciones de mantenimiento para una máquina
router.get('/machines/:machineId/recommendations', predictiveController.getMaintenanceRecommendations);

module.exports = router;