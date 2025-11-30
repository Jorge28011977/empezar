const express = require('express');
const { body, param, query } = require('express-validator');
const coreBankingController = require('../controllers/coreBankingController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener resumen de integración
router.get('/summary', coreBankingController.getIntegrationSummary);

// Obtener estado de todas las conexiones
router.get('/status', coreBankingController.getConnectionStatus);

// Configurar sistema core banking (solo admin)
router.post('/configure',
    authorizeRoles('admin'),
    [
        body('system').isIn(['temenos', 'oracle', 'fis']).withMessage('Sistema inválido'),
        body('config').isObject().notEmpty()
    ],
    coreBankingController.configureSystem
);

// Probar conexión con sistema específico
router.get('/:system/test',
    [
        param('system').isIn(['temenos', 'oracle', 'fis'])
    ],
    coreBankingController.testConnection
);

// Obtener máquinas desde core banking
router.get('/:system/machines',
    [
        param('system').isIn(['temenos', 'oracle', 'fis']),
        query('branchCode').optional().isString()
    ],
    coreBankingController.getMachinesFromCore
);

// Importar máquinas desde core banking a nuestro sistema
router.post('/:system/import',
    authorizeRoles('admin'),
    [
        param('system').isIn(['temenos', 'oracle', 'fis']),
        query('branchCode').optional().isString()
    ],
    coreBankingController.importMachines
);

// Sincronizar datos de mantenimiento
router.post('/:system/sync',
    [
        param('system').isIn(['temenos', 'oracle', 'fis']),
        body('machineId').notEmpty(),
        body('maintenanceDate').isISO8601(),
        body('status').notEmpty()
    ],
    coreBankingController.syncMaintenanceData
);

// Obtener métricas de una máquina específica
router.get('/:system/machines/:machineId/metrics',
    [
        param('system').isIn(['temenos', 'oracle', 'fis']),
        param('machineId').notEmpty()
    ],
    coreBankingController.getMachineMetrics
);

// Limpiar cache (solo admin)
router.post('/cache/clear',
    authorizeRoles('admin'),
    coreBankingController.clearCache
);

module.exports = router;
