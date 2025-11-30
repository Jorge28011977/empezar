const express = require('express');
const { body, param } = require('express-validator');
const erpController = require('../controllers/erpController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validaciones para conectar ERP
const connectERPValidation = [
    body('system')
        .isIn(['sap', 'oracle'])
        .withMessage('Sistema debe ser "sap" o "oracle"')
];

// Validación para ID
const idValidation = [
    param('maintenanceId')
        .isInt({ min: 1 })
        .withMessage('ID de mantenimiento inválido')
];

// Validaciones para sincronizar costos
const syncCostsValidation = [
    body('amount')
        .isFloat({ min: 0.01 })
        .withMessage('Monto debe ser un número positivo'),
    body('currency')
        .optional()
        .isLength({ min: 3, max: 3 })
        .withMessage('Moneda debe tener 3 caracteres'),
    body('description')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Descripción debe tener máximo 255 caracteres')
];

// Rutas ERP
router.get(
    '/status',
    authenticateToken,
    authorizeRoles('admin'),
    erpController.getERPStatus
);

router.post(
    '/connect',
    authenticateToken,
    authorizeRoles('admin'),
    connectERPValidation,
    erpController.connectERP
);

router.post(
    '/disconnect',
    authenticateToken,
    authorizeRoles('admin'),
    erpController.disconnectERP
);

router.post(
    '/sync/maintenance/:maintenanceId',
    authenticateToken,
    authorizeRoles('admin'),
    idValidation,
    erpController.syncMaintenanceToERP
);

router.get(
    '/inventory',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    erpController.getERPInventory
);

router.post(
    '/sync/costs',
    authenticateToken,
    authorizeRoles('admin'),
    syncCostsValidation,
    erpController.syncCostsToERP
);

module.exports = router;