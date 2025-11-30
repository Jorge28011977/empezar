const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { checkMFARequired } = require('./mfa');

// Rate limiting por usuario
const userRateLimit = (() => {
    const attempts = new Map();

    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        const windowMs = 15 * 60 * 1000; // 15 minutos
        const maxAttempts = 10;

        const userAttempts = attempts.get(ip) || [];
        const recentAttempts = userAttempts.filter(time => now - time < windowMs);

        if (recentAttempts.length >= maxAttempts) {
            return res.status(429).json({
                error: 'Demasiados intentos. Intente más tarde.',
                code: 'RATE_LIMIT_EXCEEDED',
                retryAfter: Math.ceil((recentAttempts[0] + windowMs - now) / 1000)
            });
        }

        recentAttempts.push(now);
        attempts.set(ip, recentAttempts);

        next();
    };
})();

// Control de geolocalización
const geoLocationCheck = (req, res, next) => {
    try {
        // En producción, verificar IP contra países permitidos
        // Aquí simulamos verificación básica
        const clientIP = req.ip || req.connection.remoteAddress;

        // Lista de países permitidos (códigos ISO)
        const allowedCountries = ['ES', 'PT', 'MX', 'CO', 'BR', 'AR', 'CL'];

        // En producción, usar servicio de geolocalización como MaxMind
        // Aquí simulamos que todas las IPs son válidas para desarrollo
        const isAllowed = true; // Simulación

        if (!isAllowed) {
            return res.status(403).json({
                error: 'Acceso no permitido desde esta ubicación',
                code: 'GEO_LOCATION_BLOCKED'
            });
        }

        next();
    } catch (error) {
        console.error('Error en verificación geográfica:', error);
        // No bloquear por errores de geolocalización
        next();
    }
};

// Middleware de autenticación JWT mejorado
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ error: 'Token de acceso requerido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        // Agregar información adicional del usuario
        req.user = {
            ...user.toJSON(),
            mfaEnabled: decoded.mfaEnabled || false,
            mfaVerified: decoded.mfaVerified || false,
            lastLogin: decoded.lastLogin,
            loginIP: decoded.loginIP
        };

        // Logging de acceso para auditoría
        console.log(`[${new Date().toISOString()}] User ${user.email} accessed ${req.method} ${req.path} from ${req.ip}`);

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        console.error('Error en autenticación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Middleware de autorización por roles
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Acceso denegado: rol insuficiente' });
        }

        next();
    };
};

// Middleware compuesto que incluye autenticación + MFA + geolocalización
const authenticateWithMFA = [
    userRateLimit,
    geoLocationCheck,
    authenticateToken,
    checkMFARequired
];

module.exports = {
    authenticateToken,
    authorizeRoles,
    authenticateWithMFA,
    userRateLimit,
    geoLocationCheck
};