const express = require('express');
const { body, param, query } = require('express-validator');
const sparePartController = require('../controllers/sparePartController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validaciones para crear repuesto
const createSparePartValidation = [
    body('name')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 1, max: 100 })
        .withMessage('El nombre debe tener entre 1 y 100 caracteres'),
    body('part_number')
        .notEmpty()
        .withMessage('El número de parte es requerido')
        .isLength({ min: 1, max: 100 })
        .withMessage('El número de parte debe tener entre 1 y 100 caracteres'),
    body('category')
        .optional()
        .isLength({ max: 50 })
        .withMessage('La categoría debe tener máximo 50 caracteres'),
    body('unit_cost')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El costo unitario debe ser un número positivo'),
    body('quantity_in_stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('La cantidad en stock debe ser un número entero no negativo'),
    body('minimum_stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El stock mínimo debe ser un número entero no negativo'),
    body('supplier')
        .optional()
        .isLength({ max: 100 })
        .withMessage('El proveedor debe tener máximo 100 caracteres')
];

// Validaciones para actualizar repuesto
const updateSparePartValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID de repuesto inválido'),
    body('name')
        .optional()
        .notEmpty()
        .withMessage('El nombre no puede estar vacío')
        .isLength({ min: 1, max: 100 })
        .withMessage('El nombre debe tener entre 1 y 100 caracteres'),
    body('part_number')
        .optional()
        .notEmpty()
        .withMessage('El número de parte no puede estar vacío')
        .isLength({ min: 1, max: 100 })
        .withMessage('El número de parte debe tener entre 1 y 100 caracteres'),
    body('category')
        .optional()
        .isLength({ max: 50 })
        .withMessage('La categoría debe tener máximo 50 caracteres'),
    body('unit_cost')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El costo unitario debe ser un número positivo'),
    body('quantity_in_stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('La cantidad en stock debe ser un número entero no negativo'),
    body('minimum_stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El stock mínimo debe ser un número entero no negativo'),
    body('supplier')
        .optional()
        .isLength({ max: 100 })
        .withMessage('El proveedor debe tener máximo 100 caracteres')
];

// Validación para ID
const idValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID de repuesto inválido')
];

// Validación para filtros
const filterValidation = [
    query('category')
        .optional()
        .isLength({ max: 50 })
        .withMessage('La categoría debe tener máximo 50 caracteres'),
    query('low_stock')
        .optional()
        .isIn(['true', 'false'])
        .withMessage('low_stock debe ser true o false')
];

// Rutas
router.get(
    '/',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    filterValidation,
    sparePartController.getAllSpareParts
);

router.get(
    '/:id',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    idValidation,
    sparePartController.getSparePartById
);

router.post(
    '/',
    authenticateToken,
    authorizeRoles('admin'),
    createSparePartValidation,
    sparePartController.createSparePart
);

router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    updateSparePartValidation,
    sparePartController.updateSparePart
);

router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    idValidation,
    sparePartController.deleteSparePart
);

router.get(
    '/alerts/low-stock',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    sparePartController.getLowStockAlerts
);

module.exports = router;