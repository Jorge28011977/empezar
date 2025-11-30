const erpIntegration = require('../utils/erpIntegration');

// Obtener estado de conexión ERP
const getERPStatus = async (req, res) => {
    try {
        const status = erpIntegration.getConnectionStatus();
        res.json({
            success: true,
            data: status
        });
    } catch (error) {
        console.error('Error obteniendo estado ERP:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Conectar a sistema ERP
const connectERP = async (req, res) => {
    try {
        const { system } = req.body; // 'sap' o 'oracle'

        if (!system || !['sap', 'oracle'].includes(system)) {
            return res.status(400).json({
                success: false,
                error: 'Sistema ERP inválido. Use "sap" o "oracle"'
            });
        }

        const result = await erpIntegration.connect(system);

        if (result.success) {
            res.json({
                success: true,
                data: erpIntegration.getConnectionStatus(),
                message: result.message
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error conectando a ERP:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Desconectar de ERP
const disconnectERP = async (req, res) => {
    try {
        const result = await erpIntegration.disconnect();

        res.json({
            success: true,
            data: erpIntegration.getConnectionStatus(),
            message: result.message
        });
    } catch (error) {
        console.error('Error desconectando de ERP:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Sincronizar mantenimiento con ERP
const syncMaintenanceToERP = async (req, res) => {
    try {
        const { maintenanceId } = req.params;

        // Obtener datos del mantenimiento (placeholder - en implementación real)
        const maintenanceData = {
            id: maintenanceId,
            type: 'preventivo',
            description: 'Mantenimiento de ejemplo',
            scheduled_date: new Date().toISOString().split('T')[0]
        };

        const result = await erpIntegration.syncMaintenanceData(maintenanceData);

        if (result.success) {
            res.json({
                success: true,
                data: result.data,
                message: result.message
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error sincronizando mantenimiento con ERP:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Obtener datos de inventario desde ERP
const getERPInventory = async (req, res) => {
    try {
        const { filters } = req.query;

        const result = await erpIntegration.getInventoryData(filters);

        if (result.success) {
            res.json({
                success: true,
                data: result.data,
                message: result.message
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error obteniendo inventario de ERP:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Sincronizar costos con ERP
const syncCostsToERP = async (req, res) => {
    try {
        const { amount, currency, description } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Monto inválido'
            });
        }

        const costData = {
            amount: parseFloat(amount),
            currency: currency || 'EUR',
            description: description || 'Costos de mantenimiento'
        };

        const result = await erpIntegration.syncCostData(costData);

        if (result.success) {
            res.json({
                success: true,
                data: result.data,
                message: result.message
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error sincronizando costos con ERP:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

module.exports = {
    getERPStatus,
    connectERP,
    disconnectERP,
    syncMaintenanceToERP,
    getERPInventory,
    syncCostsToERP
};