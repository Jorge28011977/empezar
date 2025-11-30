const crypto = require('crypto');
const db = require('../models');

// Controlador para Multi-Factor Authentication (MFA)
class MFAController {
    // Generar secreto MFA para un usuario (TOTP)
    async generateMFASecret(req, res) {
        try {
            const userId = req.user.id;

            // Generar secreto aleatorio de 32 bytes (base32 encoded)
            const secret = crypto.randomBytes(32).toString('base64')
                .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

            // Generar URI para apps autenticadoras (Google Authenticator, etc.)
            const issuer = 'Sistema Mantenimiento Bancario';
            const accountName = req.user.email;
            const uri = `otpauth://totp/${issuer}:${accountName}?secret=${secret}&issuer=${issuer}`;

            // En producción, guardar el secreto temporalmente hasta verificación
            // Aquí simulamos almacenamiento
            console.log(`MFA Secret generado para usuario ${userId}: ${secret}`);

            res.json({
                message: 'Secreto MFA generado',
                secret,
                uri,
                qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}`,
                instructions: [
                    '1. Instale una app autenticadora (Google Authenticator, Authy, etc.)',
                    '2. Escanee el código QR o ingrese el secreto manualmente',
                    '3. Use la app para generar códigos de 6 dígitos',
                    '4. Verifique el código para activar MFA'
                ]
            });
        } catch (error) {
            console.error('Error generando secreto MFA:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    // Verificar y activar MFA
    async verifyAndActivateMFA(req, res) {
        try {
            const userId = req.user.id;
            const { token, secret } = req.body;

            if (!token || !secret) {
                return res.status(400).json({
                    message: 'Token y secreto requeridos'
                });
            }

            // En producción, verificar TOTP usando speakeasy
            // Aquí simulamos verificación (aceptar códigos que terminen en 0)
            const isValid = token.length === 6 && token.endsWith('0');

            if (!isValid) {
                return res.status(401).json({
                    message: 'Código MFA inválido',
                    code: 'MFA_TOKEN_INVALID'
                });
            }

            // En producción, guardar configuración MFA del usuario
            console.log(`MFA activado para usuario ${userId}`);

            res.json({
                message: 'MFA activado exitosamente',
                mfaEnabled: true,
                activatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error activando MFA:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    // Verificar código MFA (para login)
    async verifyMFAToken(req, res) {
        try {
            const userId = req.user.id;
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({
                    message: 'Token MFA requerido'
                });
            }

            // En producción, verificar TOTP
            // Aquí simulamos verificación
            const isValid = token.length === 6 && token.endsWith('0');

            if (!isValid) {
                return res.status(401).json({
                    message: 'Código MFA inválido',
                    code: 'MFA_TOKEN_INVALID'
                });
            }

            // Generar nuevo token JWT con MFA verificado
            const jwt = require('jsonwebtoken');
            const newToken = jwt.sign(
                {
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.role,
                    mfaVerified: true
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'MFA verificado exitosamente',
                token: newToken,
                mfaVerified: true
            });
        } catch (error) {
            console.error('Error verificando token MFA:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    // Desactivar MFA
    async deactivateMFA(req, res) {
        try {
            const userId = req.user.id;

            // En producción, remover configuración MFA
            console.log(`MFA desactivado para usuario ${userId}`);

            res.json({
                message: 'MFA desactivado exitosamente',
                mfaEnabled: false,
                deactivatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error desactivando MFA:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    // Obtener estado MFA del usuario
    async getMFAStatus(req, res) {
        try {
            const userId = req.user.id;

            // En producción, consultar configuración MFA del usuario
            const mfaStatus = {
                enabled: req.user.mfaEnabled || false,
                verified: req.user.mfaVerified || false,
                lastVerified: req.user.lastMFAVerification || null,
                backupCodes: req.user.backupCodesCount || 0,
                methods: ['TOTP'], // Time-based One-Time Password
                required: ['admin', 'tecnico'].includes(req.user.role)
            };

            res.json(mfaStatus);
        } catch (error) {
            console.error('Error obteniendo estado MFA:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    // Generar códigos de respaldo
    async generateBackupCodes(req, res) {
        try {
            const userId = req.user.id;

            // Generar 10 códigos de respaldo
            const backupCodes = [];
            for (let i = 0; i < 10; i++) {
                backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
            }

            // En producción, hashear y guardar códigos
            console.log(`Códigos de respaldo generados para usuario ${userId}`);

            res.json({
                message: 'Códigos de respaldo generados',
                codes: backupCodes,
                instructions: [
                    'Guarde estos códigos en un lugar seguro',
                    'Cada código puede usarse solo una vez',
                    'Si pierde acceso a su app autenticadora, use estos códigos',
                    'Genere nuevos códigos si los pierde'
                ],
                warning: 'Estos códigos no se mostrarán nuevamente'
            });
        } catch (error) {
            console.error('Error generando códigos de respaldo:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    // Verificar código de respaldo
    async verifyBackupCode(req, res) {
        try {
            const userId = req.user.id;
            const { code } = req.body;

            if (!code) {
                return res.status(400).json({
                    message: 'Código de respaldo requerido'
                });
            }

            // En producción, verificar y consumir código de respaldo
            // Aquí simulamos verificación
            const isValid = code.length === 8 && /^[A-F0-9]+$/.test(code);

            if (!isValid) {
                return res.status(401).json({
                    message: 'Código de respaldo inválido',
                    code: 'BACKUP_CODE_INVALID'
                });
            }

            // Generar nuevo token JWT
            const jwt = require('jsonwebtoken');
            const newToken = jwt.sign(
                {
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.role,
                    mfaVerified: true,
                    backupCodeUsed: true
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Código de respaldo verificado',
                token: newToken,
                mfaVerified: true,
                method: 'backup_code'
            });
        } catch (error) {
            console.error('Error verificando código de respaldo:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}

module.exports = new MFAController();