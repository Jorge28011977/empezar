// Middleware para Multi-Factor Authentication (MFA)
const jwt = require('jsonwebtoken');
const db = require('../models');

// Verificar si MFA es requerido para el usuario
const checkMFARequired = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        // En producción, verificar configuración MFA del usuario
        // Aquí simulamos que MFA es requerido para roles admin y tecnico
        const mfaRequired = ['admin', 'tecnico'].includes(req.user.role);

        if (mfaRequired && !req.user.mfaVerified) {
            return res.status(403).json({
                message: 'MFA requerido',
                code: 'MFA_REQUIRED',
                mfaSetupRequired: !req.user.mfaEnabled
            });
        }

        next();
    } catch (error) {
        console.error('Error en verificación MFA:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Verificar token MFA (TOTP)
const verifyMFAToken = (req, res, next) => {
    try {
        const { mfaToken } = req.body;

        if (!mfaToken) {
            return res.status(400).json({
                message: 'Token MFA requerido',
                code: 'MFA_TOKEN_MISSING'
            });
        }

        // En producción, verificar TOTP con biblioteca como speakeasy
        // Aquí simulamos verificación (aceptar códigos que terminen en 0)
        const isValid = mfaToken.length === 6 && mfaToken.endsWith('0');

        if (!isValid) {
            return res.status(401).json({
                message: 'Token MFA inválido',
                code: 'MFA_TOKEN_INVALID'
            });
        }

        // Marcar MFA como verificado en la sesión
        req.mfaVerified = true;
        next();
    } catch (error) {
        console.error('Error verificando token MFA:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Rate limiting para intentos MFA
const mfaRateLimit = (() => {
    const attempts = new Map();

    return (req, res, next) => {
        const userId = req.user?.id;
        const now = Date.now();
        const windowMs = 15 * 60 * 1000; // 15 minutos
        const maxAttempts = 5;

        if (!userId) {
            return next();
        }

        const userAttempts = attempts.get(userId) || [];
        const recentAttempts = userAttempts.filter(time => now - time < windowMs);

        if (recentAttempts.length >= maxAttempts) {
            return res.status(429).json({
                message: 'Demasiados intentos MFA. Intente más tarde.',
                code: 'MFA_RATE_LIMIT_EXCEEDED',
                retryAfter: Math.ceil((recentAttempts[0] + windowMs - now) / 1000)
            });
        }

        recentAttempts.push(now);
        attempts.set(userId, recentAttempts);

        next();
    };
})();

// Middleware compuesto para rutas que requieren MFA completo
const requireMFA = [checkMFARequired, mfaRateLimit];

module.exports = {
    checkMFARequired,
    verifyMFAToken,
    mfaRateLimit,
    requireMFA
};