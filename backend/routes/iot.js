const express = require('express');
const { body, param, query } = require('express-validator');
const iotController = require('../controllers/iotController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validaciones para crear sensor
const createSensorValidation = [
    body('machine_id')
        .isInt({ min: 1 })
        .withMessage('ID de máquina inválido'),
    body('sensor_type')
        .isLength({ min: 1, max: 50 })
        .withMessage('Tipo de sensor debe tener entre 1 y 50 caracteres'),
    body('sensor_id')
        .isLength({ min: 1, max: 100 })
        .withMessage('ID de sensor debe tener entre 1 y 100 caracteres'),
    body('location_on_machine')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Ubicación debe tener máximo 100 caracteres'),
    body('status')
        .optional()
        .isIn(['active', 'inactive', 'maintenance'])
        .withMessage('Estado debe ser active, inactive o maintenance')
];

// Validaciones para recibir datos de sensor
const receiveDataValidation = [
    body('sensor_id')
        .isLength({ min: 1, max: 100 })
        .withMessage('ID de sensor requerido'),
    body('value')
        .isFloat()
        .withMessage('Valor debe ser un número'),
    body('unit')
        .optional()
        .isLength({ max: 20 })
        .withMessage('Unidad debe tener máximo 20 caracteres'),
    body('timestamp')
        .optional()
        .isISO8601()
        .withMessage('Timestamp debe ser una fecha válida')
];

// Validación para ID
const idValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID de sensor inválido')
];

// Validaciones para filtros de query
const queryFiltersValidation = [
    query('machine_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de máquina inválido'),
    query('status')
        .optional()
        .isIn(['active', 'inactive', 'maintenance'])
        .withMessage('Estado debe ser active, inactive o maintenance'),
    query('sensor_id')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('ID de sensor inválido'),
    query('sensor_type')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Tipo de sensor inválido'),
    query('date_from')
        .optional()
        .isISO8601()
        .withMessage('Fecha desde debe ser una fecha válida'),
    query('date_to')
        .optional()
        .isISO8601()
        .withMessage('Fecha hasta debe ser una fecha válida'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 1000 })
        .withMessage('Límite debe ser entre 1 y 1000')
];

// Rutas para sensores
router.get(
    '/sensors',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    queryFiltersValidation,
    iotController.getAllSensors
);

router.get(
    '/sensors/:id',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    idValidation,
    iotController.getSensorById
);

router.post(
    '/sensors',
    authenticateToken,
    authorizeRoles('admin'),
    createSensorValidation,
    iotController.createSensor
);

// Rutas para datos de sensores
router.post(
    '/data',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'), // O quizás sin auth para dispositivos IoT
    receiveDataValidation,
    iotController.receiveSensorData
);

router.get(
    '/data',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    queryFiltersValidation,
    iotController.getSensorData
);

// Rutas para alertas
router.get(
    '/alerts',
    authenticateToken,
    authorizeRoles('admin', 'tecnico'),
    iotController.getAlerts
);

module.exports = router;