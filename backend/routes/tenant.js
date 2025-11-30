const express = require('express');
const { body } = require('express-validator');
const tenantController = require('../controllers/tenantController');
const { authenticateToken } = require('../middleware/auth');
const { multiTenant } = require('../middleware/multiTenant');

const router = express.Router();

// Aplicar middleware multi-tenant a todas las rutas
router.use(multiTenant);

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener información del tenant actual
router.get('/current', tenantController.getCurrentTenant);

// Obtener métricas de uso del tenant
router.get('/metrics', tenantController.getTenantMetrics);

// Configurar tenant (solo admin del tenant)
router.put('/config', [
    body('settings').isObject()
], tenantController.configureTenant);

// Obtener configuración de seguridad
router.get('/security', tenantController.getSecurityConfig);

// Rutas de administración (solo super-admin)
router.get('/all', tenantController.getAllTenants);

router.post('/create', [
    body('id').isString().notEmpty(),
    body('name').isString().notEmpty(),
    body('plan').isIn(['BASIC', 'PROFESSIONAL', 'ENTERPRISE']),
    body('adminEmail').isEmail()
], tenantController.createTenant);

router.post('/:tenantId/suspend', [
    body('reason').optional().isString()
], tenantController.suspendTenant);

module.exports = router;