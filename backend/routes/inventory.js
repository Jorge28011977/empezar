const express = require('express');
const { body, query } = require('express-validator');
const inventoryController = require('../controllers/inventoryController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validaciones para agregar movimiento de inventario
const addMovementValidation = [
    body('spare_part_id')
        .isInt({ min: 1 })
        .withMessage('ID de repuesto inválido'),
    body('quantity')
        .isInt()
        .withMessage('La cantidad debe ser un número entero'),
    body('movement_type')
        .isIn(['in', 'out', 'adjustment'])
        .withMessage('El tipo de movimiento debe ser in, out o adjustment'),
    body('reason')
        .optional()
        .isLength({ max: 500 })
        .withMessage('La razón debe tener máximo 500 caracteres'),
    body('technician_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de técnico inválido')
];

// Validaciones para filtros de movimientos
const movementFiltersValidation = [
    query('spare_part_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de repuesto inválido'),
    query('movement_type')
        .optional()
        .isIn(['in', 'out', 'adjustment'])
        .withMessage('El tipo de movimiento debe ser in, out o adjustment'),
    query('start_date')
        .optional()
        .isISO8601()
        .withMessage('La fecha de inicio debe ser una fecha válida'),
    query('end_date')
        .optional()
        .isISO8601()
        .withMessage('La fecha de fin debe ser una fecha válida')
];

// Validaciones para stock
const stockValidation = [
    query('spare_part_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de repuesto inválido')
];

// Rutas
router.get(
    '/movements',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    movementFiltersValidation,
    inventoryController.getInventoryMovements
);

router.post(
    '/movements',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    addMovementValidation,
    inventoryController.addInventoryMovement
);

router.get(
    '/stock',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    stockValidation,
    inventoryController.getCurrentStock
);

module.exports = router;