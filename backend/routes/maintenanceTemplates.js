const express = require('express');
const { body, param, query } = require('express-validator');
const maintenanceTemplateController = require('../controllers/maintenanceTemplateController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validaciones para crear plantilla
const createTemplateValidation = [
    body('name')
        .isLength({ min: 1, max: 100 })
        .withMessage('Nombre debe tener entre 1 y 100 caracteres'),
    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Descripción debe tener máximo 1000 caracteres'),
    body('type')
        .isIn(['preventive', 'corrective'])
        .withMessage('Tipo debe ser preventive o corrective'),
    body('frequency_days')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Frecuencia debe ser un entero positivo'),
    body('estimated_duration_hours')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Duración estimada debe ser un número positivo'),
    body('required_parts')
        .optional()
        .isObject()
        .withMessage('Partes requeridas debe ser un objeto'),
    body('instructions')
        .optional()
        .isLength({ max: 2000 })
        .withMessage('Instrucciones deben tener máximo 2000 caracteres')
];

// Validaciones para actualizar plantilla
const updateTemplateValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID de plantilla inválido'),
    body('name')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Nombre debe tener entre 1 y 100 caracteres'),
    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Descripción debe tener máximo 1000 caracteres'),
    body('type')
        .optional()
        .isIn(['preventive', 'corrective'])
        .withMessage('Tipo debe ser preventive o corrective'),
    body('frequency_days')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Frecuencia debe ser un entero positivo'),
    body('estimated_duration_hours')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Duración estimada debe ser un número positivo'),
    body('required_parts')
        .optional()
        .isObject()
        .withMessage('Partes requeridas debe ser un objeto'),
    body('instructions')
        .optional()
        .isLength({ max: 2000 })
        .withMessage('Instrucciones deben tener máximo 2000 caracteres')
];

// Validación para ID
const idValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID de plantilla inválido')
];

// Validaciones para filtros de query
const queryFiltersValidation = [
    query('type')
        .optional()
        .isIn(['preventive', 'corrective'])
        .withMessage('Tipo debe ser preventive o corrective'),
    query('frequency_days')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Frecuencia debe ser un entero positivo')
];

// Validación para tipo de máquina
const machineTypeValidation = [
    param('type')
        .isIn(['preventive', 'corrective'])
        .withMessage('Tipo debe ser preventive o corrective')
];

// Rutas
router.get(
    '/',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    queryFiltersValidation,
    maintenanceTemplateController.getAllTemplates
);

router.get(
    '/:id',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    idValidation,
    maintenanceTemplateController.getTemplateById
);

router.post(
    '/',
    authenticateToken,
    authorizeRoles('admin'),
    createTemplateValidation,
    maintenanceTemplateController.createTemplate
);

router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    updateTemplateValidation,
    maintenanceTemplateController.updateTemplate
);

router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    idValidation,
    maintenanceTemplateController.deleteTemplate
);

router.get(
    '/machine-type/:type',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    machineTypeValidation,
    maintenanceTemplateController.getTemplatesByMachineType
);

module.exports = router;