const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
];

const registerValidation = [
    body('name').trim().notEmpty().isLength({ min: 2 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['admin', 'tecnico', 'usuario'])
];

// Routes
router.post('/login', loginValidation, authController.login);
router.post('/register', registerValidation, authController.register);
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;