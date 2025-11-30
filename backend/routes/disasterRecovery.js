const express = require('express');
const { body } = require('express-validator');
const disasterRecoveryController = require('../controllers/disasterRecoveryController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener métricas de SLA
router.get('/metrics', disasterRecoveryController.getSLAMetrics);

// Obtener estado de backups
router.get('/backups', disasterRecoveryController.getBackupStatus);

// Ejecutar backup manual
router.post('/backups', [
    body('type').optional().isIn(['FULL', 'INCREMENTAL'])
], disasterRecoveryController.triggerBackup);

// Simular failover
router.post('/failover', [
    body('reason').optional().isString()
], disasterRecoveryController.triggerFailover);

// Obtener plan de DR
router.get('/plan', disasterRecoveryController.getDRPlan);

module.exports = router;