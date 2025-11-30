const express = require('express');
const { body } = require('express-validator');
const mfaController = require('../controllers/mfaController');
const auth = require('../middleware/auth');
const { verifyMFAToken, mfaRateLimit } = require('../middleware/mfa');

const router = express.Router();

// Todas las rutas requieren autenticación básica
router.use(auth);

// Generar secreto MFA
router.post('/setup', mfaController.generateMFASecret);

// Verificar y activar MFA
router.post('/activate', [
    body('token').isLength({ min: 6, max: 6 }).isNumeric(),
    body('secret').notEmpty()
], mfaController.verifyAndActivateMFA);

// Verificar token MFA (para login con MFA pendiente)
router.post('/verify', [
    body('token').isLength({ min: 6, max: 6 }).isNumeric()
], mfaRateLimit, mfaController.verifyMFAToken);

// Desactivar MFA
router.post('/deactivate', mfaController.deactivateMFA);

// Obtener estado MFA
router.get('/status', mfaController.getMFAStatus);

// Generar códigos de respaldo
router.post('/backup-codes', mfaController.generateBackupCodes);

// Verificar código de respaldo
router.post('/verify-backup', [
    body('code').isLength({ min: 8, max: 8 }).matches(/^[A-F0-9]+$/)
], mfaController.verifyBackupCode);

module.exports = router;