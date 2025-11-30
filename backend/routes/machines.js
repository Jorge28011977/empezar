const express = require('express');
const { body, param } = require('express-validator');
const machineController = require('../controllers/machineController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validaciones para crear máquina
const createMachineValidation = [
    body('name')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 1, max: 100 })
        .withMessage('El nombre debe tener entre 1 y 100 caracteres'),
    body('serial_number')
        .notEmpty()
        .withMessage('El número de serie es requerido')
        .isLength({ min: 1, max: 100 })
        .withMessage('El número de serie debe tener entre 1 y 100 caracteres'),
    body('model')
        .optional()
        .isLength({ max: 100 })
        .withMessage('El modelo debe tener máximo 100 caracteres'),
    body('location')
        .optional()
        .isLength({ max: 200 })
        .withMessage('La ubicación debe tener máximo 200 caracteres'),
    body('installation_date')
        .optional()
        .isISO8601()
        .withMessage('La fecha de instalación debe ser una fecha válida'),
    body('status')
        .optional()
        .isIn(['active', 'inactive', 'maintenance'])
        .withMessage('El estado debe ser active, inactive o maintenance')
];

// Validaciones para actualizar máquina
const updateMachineValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID de máquina inválido'),
    body('name')
        .optional()
        .notEmpty()
        .withMessage('El nombre no puede estar vacío')
        .isLength({ min: 1, max: 100 })
        .withMessage('El nombre debe tener entre 1 y 100 caracteres'),
    body('serial_number')
        .optional()
        .notEmpty()
        .withMessage('El número de serie no puede estar vacío')
        .isLength({ min: 1, max: 100 })
        .withMessage('El número de serie debe tener entre 1 y 100 caracteres'),
    body('model')
        .optional()
        .isLength({ max: 100 })
        .withMessage('El modelo debe tener máximo 100 caracteres'),
    body('location')
        .optional()
        .isLength({ max: 200 })
        .withMessage('La ubicación debe tener máximo 200 caracteres'),
    body('installation_date')
        .optional()
        .isISO8601()
        .withMessage('La fecha de instalación debe ser una fecha válida'),
    body('status')
        .optional()
        .isIn(['active', 'inactive', 'maintenance'])
        .withMessage('El estado debe ser active, inactive o maintenance')
];

// Validación para ID
const idValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID de máquina inválido')
];

// Rutas
router.get(
    '/',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    machineController.getAllMachines
);

// Obtener tipos de máquinas disponibles
router.get(
    '/types/all',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    machineController.getMachineTypes
);

router.get(
    '/:id',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    idValidation,
    machineController.getMachineById
);

router.post(
    '/',
    authenticateToken,
    authorizeRoles('admin'),
    createMachineValidation,
    machineController.createMachine
);

router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    updateMachineValidation,
    machineController.updateMachine
);

router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    idValidation,
    machineController.deleteMachine
);

module.exports = router;