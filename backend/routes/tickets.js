const express = require('express');
const { body, param, query } = require('express-validator');
const ticketController = require('../controllers/ticketController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validaciones para crear ticket
const createTicketValidation = [
    body('machine_id')
        .isInt({ min: 1 })
        .withMessage('ID de máquina inválido'),
    body('title')
        .notEmpty()
        .withMessage('El título es requerido')
        .isLength({ min: 1, max: 200 })
        .withMessage('El título debe tener entre 1 y 200 caracteres'),
    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('La descripción debe tener máximo 1000 caracteres'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('La prioridad debe ser low, medium, high o critical')
];

// Validaciones para actualizar ticket
const updateTicketValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID de ticket inválido'),
    body('title')
        .optional()
        .notEmpty()
        .withMessage('El título no puede estar vacío')
        .isLength({ min: 1, max: 200 })
        .withMessage('El título debe tener entre 1 y 200 caracteres'),
    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('La descripción debe tener máximo 1000 caracteres'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('La prioridad debe ser low, medium, high o critical')
];

// Validación para ID
const idValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID de ticket inválido')
];

// Validaciones para asignar técnico
const assignTechnicianValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID de ticket inválido'),
    body('technician_id')
        .isInt({ min: 1 })
        .withMessage('ID de técnico inválido')
];

// Validaciones para cambiar estado
const changeStatusValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID de ticket inválido'),
    body('status')
        .isIn(['open', 'assigned', 'in_progress', 'resolved', 'closed'])
        .withMessage('El estado debe ser open, assigned, in_progress, resolved o closed')
];

// Validaciones para filtros de getAllTickets
const getAllTicketsValidation = [
    query('status')
        .optional()
        .isIn(['open', 'assigned', 'in_progress', 'resolved', 'closed'])
        .withMessage('Estado inválido'),
    query('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Prioridad inválida'),
    query('machine_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de máquina inválido'),
    query('assigned_to')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de técnico inválido'),
    query('start_date')
        .optional()
        .isISO8601()
        .withMessage('Fecha de inicio inválida'),
    query('end_date')
        .optional()
        .isISO8601()
        .withMessage('Fecha de fin inválida'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Página inválida'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Límite debe estar entre 1 y 100')
];

// Rutas
router.get(
    '/',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    getAllTicketsValidation,
    ticketController.getAllTickets
);

router.get(
    '/:id',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    idValidation,
    ticketController.getTicketById
);

router.post(
    '/',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    createTicketValidation,
    ticketController.createTicket
);

router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    updateTicketValidation,
    ticketController.updateTicket
);

router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    idValidation,
    ticketController.deleteTicket
);

router.put(
    '/:id/assign',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    assignTechnicianValidation,
    ticketController.assignTechnician
);

router.put(
    '/:id/status',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    changeStatusValidation,
    ticketController.changeStatus
);

module.exports = router;