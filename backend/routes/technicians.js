const express = require('express');
const { body, param } = require('express-validator');
const technicianController = require('../controllers/technicianController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validaciones para crear técnico
const createTechnicianValidation = [
    body('user_id')
        .isInt({ min: 1 })
        .withMessage('ID de usuario inválido'),
    body('specialization')
        .optional()
        .isLength({ max: 100 })
        .withMessage('La especialización debe tener máximo 100 caracteres'),
    body('availability')
        .optional()
        .isBoolean()
        .withMessage('La disponibilidad debe ser un valor booleano')
];

// Validaciones para actualizar técnico
const updateTechnicianValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID de técnico inválido'),
    body('specialization')
        .optional()
        .isLength({ max: 100 })
        .withMessage('La especialización debe tener máximo 100 caracteres'),
    body('availability')
        .optional()
        .isBoolean()
        .withMessage('La disponibilidad debe ser un valor booleano')
];

// Validación para ID
const idValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID de técnico inválido')
];

// Rutas
router.get(
    '/',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    technicianController.getAllTechnicians
);

router.get(
    '/:id',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    idValidation,
    technicianController.getTechnicianById
);

router.post(
    '/',
    authenticateToken,
    authorizeRoles('admin'),
    createTechnicianValidation,
    technicianController.createTechnician
);

router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    updateTechnicianValidation,
    technicianController.updateTechnician
);

router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    idValidation,
    technicianController.deleteTechnician
);

module.exports = router;