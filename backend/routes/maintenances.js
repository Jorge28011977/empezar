const express = require('express');
const { body, param, query } = require('express-validator');
const maintenanceController = require('../controllers/maintenanceController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validaciones para crear mantenimiento
const createMaintenanceValidation = [
    body('machine_id')
        .isInt({ min: 1 })
        .withMessage('ID de máquina inválido'),
    body('template_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de plantilla inválido'),
    body('technician_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de técnico inválido'),
    body('type')
        .isIn(['preventivo', 'correctivo'])
        .withMessage('Tipo debe ser preventivo o correctivo'),
    body('scheduled_date')
        .optional()
        .isISO8601()
        .withMessage('Fecha programada debe ser una fecha válida'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Prioridad debe ser low, medium, high o critical'),
    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Descripción debe tener máximo 1000 caracteres'),
    body('notes')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Notas deben tener máximo 1000 caracteres'),
    body('duration_hours')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Duración debe ser un número positivo'),
    body('cost')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Costo debe ser un número positivo'),
    body('spare_parts')
        .optional()
        .isArray()
        .withMessage('Repuestos debe ser un array'),
    body('spare_parts.*.id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de repuesto inválido'),
    body('spare_parts.*.quantity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Cantidad debe ser un entero positivo')
];

// Validaciones para actualizar mantenimiento
const updateMaintenanceValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID de mantenimiento inválido'),
    body('machine_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de máquina inválido'),
    body('template_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de plantilla inválido'),
    body('technician_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de técnico inválido'),
    body('type')
        .optional()
        .isIn(['preventivo', 'correctivo'])
        .withMessage('Tipo debe ser preventivo o correctivo'),
    body('scheduled_date')
        .optional()
        .isISO8601()
        .withMessage('Fecha programada debe ser una fecha válida'),
    body('actual_date')
        .optional()
        .isISO8601()
        .withMessage('Fecha actual debe ser una fecha válida'),
    body('status')
        .optional()
        .isIn(['scheduled', 'in_progress', 'completed', 'cancelled'])
        .withMessage('Estado debe ser scheduled, in_progress, completed o cancelled'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Prioridad debe ser low, medium, high o critical'),
    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Descripción debe tener máximo 1000 caracteres'),
    body('notes')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Notas deben tener máximo 1000 caracteres'),
    body('duration_hours')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Duración debe ser un número positivo'),
    body('cost')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Costo debe ser un número positivo'),
    body('spare_parts')
        .optional()
        .isArray()
        .withMessage('Repuestos debe ser un array'),
    body('spare_parts.*.id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de repuesto inválido'),
    body('spare_parts.*.quantity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Cantidad debe ser un entero positivo')
];

// Validación para ID
const idValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID de mantenimiento inválido')
];

// Validaciones para asignar técnico
const assignTechnicianValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID de mantenimiento inválido'),
    body('technician_id')
        .isInt({ min: 1 })
        .withMessage('ID de técnico inválido')
];

// Validaciones para completar mantenimiento
const completeMaintenanceValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID de mantenimiento inválido'),
    body('actual_date')
        .optional()
        .isISO8601()
        .withMessage('Fecha actual debe ser una fecha válida'),
    body('notes')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Notas deben tener máximo 1000 caracteres'),
    body('duration_hours')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Duración debe ser un número positivo'),
    body('cost')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Costo debe ser un número positivo')
];

// Validaciones para filtros de query
const queryFiltersValidation = [
    query('type')
        .optional()
        .isIn(['preventivo', 'correctivo'])
        .withMessage('Tipo debe ser preventivo o correctivo'),
    query('status')
        .optional()
        .isIn(['scheduled', 'in_progress', 'completed', 'cancelled'])
        .withMessage('Estado debe ser scheduled, in_progress, completed o cancelled'),
    query('scheduled_date_from')
        .optional()
        .isISO8601()
        .withMessage('Fecha desde debe ser una fecha válida'),
    query('scheduled_date_to')
        .optional()
        .isISO8601()
        .withMessage('Fecha hasta debe ser una fecha válida'),
    query('machine_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de máquina inválido'),
    query('technician_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de técnico inválido'),
    query('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Prioridad debe ser low, medium, high o critical')
];

// Rutas
router.get(
    '/',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    queryFiltersValidation,
    maintenanceController.getAllMaintenances
);

router.get(
    '/:id',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    idValidation,
    maintenanceController.getMaintenanceById
);

router.post(
    '/',
    authenticateToken,
    authorizeRoles('admin'),
    createMaintenanceValidation,
    maintenanceController.createMaintenance
);

router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    updateMaintenanceValidation,
    maintenanceController.updateMaintenance
);

router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    idValidation,
    maintenanceController.deleteMaintenance
);

router.put(
    '/:id/assign',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    assignTechnicianValidation,
    maintenanceController.assignTechnician
);

router.put(
    '/:id/complete',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    completeMaintenanceValidation,
    maintenanceController.completeMaintenance
);

// Rutas blockchain
router.post(
    '/:id/blockchain',
    authenticateToken,
    authorizeRoles('admin'),
    idValidation,
    maintenanceController.generateBlockchainRecord
);

router.get(
    '/:id/blockchain/verify',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    idValidation,
    maintenanceController.verifyBlockchainRecord
);

module.exports = router;