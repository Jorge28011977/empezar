const express = require('express');
const { body, query } = require('express-validator');
const auditController = require('../controllers/auditController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Registrar evento de auditoría
router.post('/events', [
    body('action').isIn(['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT']).withMessage('Acción inválida'),
    body('entityType').isString().notEmpty(),
    body('entityId').optional().isString(),
    body('oldValues').optional().isObject(),
    body('newValues').optional().isObject(),
    body('reason').optional().isString()
], auditController.logEvent);

// Obtener audit trail
router.get('/trail', [
    query('entityType').optional().isString(),
    query('entityId').optional().isString(),
    query('userId').optional().isInt(),
    query('action').optional().isIn(['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT']),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
], auditController.getAuditTrail);

// Verificar integridad de evento
router.get('/events/:eventId/verify', auditController.verifyEvent);

// Obtener métricas de auditoría
router.get('/metrics', auditController.getAuditMetrics);

// Generar reporte de auditoría
router.get('/reports', [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('entityType').optional().isString()
], auditController.generateAuditReport);

module.exports = router;