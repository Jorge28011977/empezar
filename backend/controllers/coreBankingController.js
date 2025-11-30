const coreBankingConnector = require('../connectors/coreBanking');
const db = require('../models');

// Controlador para Core Banking Integration
class CoreBankingController {
    // Configurar conexión con sistema core banking
    async configureSystem(req, res) {
        try {
            const { system, config } = req.body;

            if (!system || !config) {
                return res.status(400).json({
                    message: 'Sistema y configuración requeridos'
                });
            }

            const result = coreBankingConnector.configureConnection(system, config);

            if (result) {
                res.json({
                    message: `Sistema ${system} configurado exitosamente`,
                    system,
                    enabled: true
                });
            } else {
                res.status(400).json({
                    message: `Sistema ${system} no soportado`
                });
            }
        } catch (error) {
            console.error('Error configurando sistema:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    // Probar conectividad con sistema
    async testConnection(req, res) {
        try {
            const { system } = req.params;

            const result = await coreBankingConnector.testConnection(system);

            if (result.status === 'CONNECTED') {
                res.json({
                    message: 'Conexión exitosa',
                    ...result
                });
            } else {
                res.status(503).json({
                    message: 'Error de conexión',
                    ...result
                });
            }
        } catch (error) {
            console.error('Error probando conexión:', error);
            res.status(500).json({
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener estado de todas las conexiones
    async getConnectionStatus(req, res) {
        try {
            const status = await coreBankingConnector.getConnectionStatus();

            res.json({
                systems: status,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error obteniendo estado de conexiones:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    // Obtener máquinas desde core banking
    async getMachinesFromCore(req, res) {
        try {
            const { system } = req.params;
            const { branchCode } = req.query;

            const machines = await coreBankingConnector.getMachinesFromCore(system, branchCode);

            res.json({
                system,
                branchCode: branchCode || 'all',
                count: machines.length,
                machines
            });
        } catch (error) {
            console.error('Error obteniendo máquinas:', error);
            res.status(500).json({
                message: 'Error obteniendo máquinas',
                error: error.message
            });
        }
    }

    // Sincronizar datos de mantenimiento con core banking
    async syncMaintenanceData(req, res) {
        try {
            const { system } = req.params;
            const maintenanceData = req.body;

            const result = await coreBankingConnector.syncMaintenanceData(system, maintenanceData);

            res.json({
                message: 'Datos sincronizados exitosamente',
                ...result
            });
        } catch (error) {
            console.error('Error sincronizando datos:', error);
            res.status(500).json({
                message: 'Error sincronizando datos',
                error: error.message
            });
        }
    }

    // Obtener métricas de una máquina desde core banking
    async getMachineMetrics(req, res) {
        try {
            const { system, machineId } = req.params;

            const metrics = await coreBankingConnector.getMachineMetrics(system, machineId);

            res.json({
                message: 'Métricas obtenidas exitosamente',
                ...metrics
            });
        } catch (error) {
            console.error('Error obteniendo métricas:', error);
            res.status(500).json({
                message: 'Error obteniendo métricas',
                error: error.message
            });
        }
    }

    // Importar máquinas desde core banking a nuestro sistema
    async importMachines(req, res) {
        try {
            const { system } = req.params;
            const { branchCode } = req.query;

            // Obtener máquinas del core banking
            const machines = await coreBankingConnector.getMachinesFromCore(system, branchCode);

            // Importar a nuestra base de datos
            const imported = [];
            const errors = [];

            for (const machine of machines) {
                try {
                    // Verificar si ya existe
                    const existing = await db.Machine.findOne({
                        where: {
                            externalId: machine.externalId,
                            externalSystem: machine.system
                        }
                    });

                    if (existing) {
                        // Actualizar
                        await existing.update({
                            name: machine.name,
                            model: machine.model,
                            location: machine.location,
                            status: machine.status
                        });
                        imported.push({ ...machine, action: 'UPDATED' });
                    } else {
                        // Crear nueva
                        await db.Machine.create({
                            name: machine.name,
                            model: machine.model,
                            serialNumber: machine.externalId,
                            location: machine.location,
                            status: machine.status,
                            externalId: machine.externalId,
                            externalSystem: machine.system,
                            installationDate: machine.installationDate
                        });
                        imported.push({ ...machine, action: 'CREATED' });
                    }
                } catch (error) {
                    errors.push({
                        machine: machine.externalId,
                        error: error.message
                    });
                }
            }

            res.json({
                message: 'Importación completada',
                system,
                imported: imported.length,
                errors: errors.length,
                details: {
                    imported,
                    errors
                }
            });
        } catch (error) {
            console.error('Error importando máquinas:', error);
            res.status(500).json({
                message: 'Error importando máquinas',
                error: error.message
            });
        }
    }

    // Limpiar cache de core banking
    async clearCache(req, res) {
        try {
            coreBankingConnector.clearCache();

            res.json({
                message: 'Cache limpiado exitosamente',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error limpiando cache:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    // Obtener resumen de integración
    async getIntegrationSummary(req, res) {
        try {
            const status = await coreBankingConnector.getConnectionStatus();

            // Contar máquinas sincronizadas
            const syncedMachines = await db.Machine.count({
                where: {
                    externalSystem: {
                        [db.Sequelize.Op.ne]: null
                    }
                }
            });

            // Agrupar por sistema
            const machinesBySystem = await db.Machine.findAll({
                attributes: [
                    'externalSystem',
                    [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
                ],
                where: {
                    externalSystem: {
                        [db.Sequelize.Op.ne]: null
                    }
                },
                group: ['externalSystem']
            });

            res.json({
                message: 'Resumen de integración obtenido',
                connections: status,
                synchronization: {
                    totalMachinesSynced: syncedMachines,
                    bySystem: machinesBySystem.reduce((acc, item) => {
                        acc[item.externalSystem] = parseInt(item.getDataValue('count'));
                        return acc;
                    }, {})
                },
                lastUpdated: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error obteniendo resumen:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}

module.exports = new CoreBankingController();
