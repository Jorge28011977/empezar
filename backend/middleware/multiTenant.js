// Middleware para Multi-Tenant Architecture
const multiTenant = (req, res, next) => {
    try {
        // Extraer tenant ID del header, JWT, o subdomain
        let tenantId = null;

        // Opción 1: Header personalizado
        if (req.headers['x-tenant-id']) {
            tenantId = req.headers['x-tenant-id'];
        }

        // Opción 2: Del JWT token (si está disponible)
        if (req.user && req.user.tenantId) {
            tenantId = req.user.tenantId;
        }

        // Opción 3: Subdomain (ej: banco1.sistema.com)
        if (req.subdomains && req.subdomains.length > 0) {
            tenantId = req.subdomains[0];
        }

        // Para desarrollo/demo, usar tenant por defecto
        if (!tenantId) {
            tenantId = 'default';
        }

        // Validar tenant ID
        if (!isValidTenantId(tenantId)) {
            return res.status(400).json({
                message: 'Tenant ID inválido',
                code: 'INVALID_TENANT'
            });
        }

        // Verificar que el tenant esté activo
        if (!isTenantActive(tenantId)) {
            return res.status(403).json({
                message: 'Tenant inactivo o suspendido',
                code: 'TENANT_INACTIVE'
            });
        }

        // Agregar tenant al request para uso en controladores
        req.tenantId = tenantId;

        // Configurar schema de base de datos por tenant (si aplica)
        // En PostgreSQL: SET search_path TO tenant_{tenantId};

        // Logging para auditoría
        console.log(`[${new Date().toISOString()}] Tenant: ${tenantId} - ${req.method} ${req.path}`);

        next();
    } catch (error) {
        console.error('Error en middleware multi-tenant:', error);
        res.status(500).json({
            message: 'Error interno del servidor',
            code: 'TENANT_ERROR'
        });
    }
};

// Función para validar tenant ID
function isValidTenantId(tenantId) {
    // Validar formato (solo letras, números, guiones)
    const validFormat = /^[a-zA-Z0-9_-]+$/;

    // Longitud máxima
    const maxLength = 50;

    return tenantId &&
        tenantId.length <= maxLength &&
        validFormat.test(tenantId);
}

// Función para verificar si tenant está activo
function isTenantActive(tenantId) {
    // En producción, esto consultaría una base de datos de tenants
    // Aquí simulamos tenants activos
    const activeTenants = [
        'default',
        'banco-santander',
        'bbva',
        'banco-popular',
        'caixa-bank',
        'santander-mexico',
        'itau-brasil'
    ];

    return activeTenants.includes(tenantId);
}

// Middleware adicional para aislamiento de datos
const dataIsolation = (req, res, next) => {
    // Asegurar que todas las consultas incluyan el tenantId
    req.query.tenantId = req.tenantId;
    req.body.tenantId = req.tenantId;

    next();
};

// Middleware para rate limiting por tenant
const tenantRateLimit = (req, res, next) => {
    const tenantId = req.tenantId;

    // En producción, implementar rate limiting por tenant
    // Aquí solo logging
    console.log(`Rate limit check for tenant: ${tenantId}`);

    next();
};

module.exports = {
    multiTenant,
    dataIsolation,
    tenantRateLimit
};