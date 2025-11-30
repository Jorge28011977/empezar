// Core Banking Connector - Integración con sistemas bancarios principales
const axios = require('axios');
const crypto = require('crypto');

class CoreBankingConnector {
    constructor() {
        this.connections = {
            temenos: {
                baseUrl: process.env.TEMENOS_BASE_URL || 'https://api.temenos.com',
                apiKey: process.env.TEMENOS_API_KEY,
                clientId: process.env.TEMENOS_CLIENT_ID,
                enabled: false
            },
            oracle: {
                baseUrl: process.env.ORACLE_BASE_URL || 'https://api.oracle.com/flexcube',
                username: process.env.ORACLE_USERNAME,
                password: process.env.ORACLE_PASSWORD,
                enabled: false
            },
            fis: {
                baseUrl: process.env.FIS_BASE_URL || 'https://api.fisglobal.com',
                apiKey: process.env.FIS_API_KEY,
                secret: process.env.FIS_SECRET,
                enabled: false
            }
        };

        // Cache para optimización
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
    }

    // Configurar conexión con sistema específico
    configureConnection(system, config) {
        if (this.connections[system]) {
            this.connections[system] = { ...this.connections[system], ...config, enabled: true };
            console.log(`Conexión ${system} configurada y habilitada`);
            return true;
        }
        return false;
    }

    // Verificar conectividad con core banking
    async testConnection(system) {
        try {
            if (!this.connections[system]?.enabled) {
                throw new Error(`Sistema ${system} no configurado`);
            }

            const config = this.connections[system];
            let response;

            switch (system) {
                case 'temenos':
                    response = await axios.get(`${config.baseUrl}/health`, {
                        headers: {
                            'X-API-Key': config.apiKey,
                            'X-Client-ID': config.clientId
                        },
                        timeout: 5000
                    });
                    break;

                case 'oracle':
                    response = await axios.get(`${config.baseUrl}/status`, {
                        auth: {
                            username: config.username,
                            password: config.password
                        },
                        timeout: 5000
                    });
                    break;

                case 'fis':
                    const timestamp = Date.now().toString();
                    const signature = crypto
                        .createHmac('sha256', config.secret)
                        .update(timestamp)
                        .digest('hex');

                    response = await axios.get(`${config.baseUrl}/ping`, {
                        headers: {
                            'X-API-Key': config.apiKey,
                            'X-Timestamp': timestamp,
                            'X-Signature': signature
                        },
                        timeout: 5000
                    });
                    break;

                default:
                    throw new Error(`Sistema ${system} no soportado`);
            }

            return {
                system,
                status: 'CONNECTED',
                responseTime: response.config.timeout - (response.config.timeout || 0),
                lastChecked: new Date().toISOString()
            };

        } catch (error) {
            console.error(`Error conectando a ${system}:`, error.message);
            return {
                system,
                status: 'ERROR',
                error: error.message,
                lastChecked: new Date().toISOString()
            };
        }
    }

    // Obtener datos de máquinas desde core banking
    async getMachinesFromCore(system, branchCode = null) {
        const cacheKey = `machines_${system}_${branchCode || 'all'}`;

        // Verificar cache
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            if (!this.connections[system]?.enabled) {
                throw new Error(`Sistema ${system} no configurado`);
            }

            const config = this.connections[system];
            let machines = [];

            switch (system) {
                case 'temenos':
                    const temenosResponse = await axios.get(`${config.baseUrl}/atm-machines`, {
                        headers: {
                            'X-API-Key': config.apiKey,
                            'X-Client-ID': config.clientId
                        },
                        params: branchCode ? { branchCode } : {}
                    });

                    machines = temenosResponse.data.map(machine => ({
                        externalId: machine.id,
                        system: 'temenos',
                        name: machine.name,
                        model: machine.model,
                        location: machine.branchName,
                        status: this.mapTemenosStatus(machine.status),
                        installationDate: machine.installationDate,
                        lastMaintenance: machine.lastServiceDate
                    }));
                    break;

                case 'oracle':
                    const oracleResponse = await axios.get(`${config.baseUrl}/devices/atm`, {
                        auth: {
                            username: config.username,
                            password: config.password
                        },
                        params: branchCode ? { branch: branchCode } : {}
                    });

                    machines = oracleResponse.data.map(machine => ({
                        externalId: machine.deviceId,
                        system: 'oracle',
                        name: machine.deviceName,
                        model: machine.deviceType,
                        location: machine.branchName,
                        status: this.mapOracleStatus(machine.status),
                        installationDate: machine.installDate,
                        lastMaintenance: machine.lastMaintenanceDate
                    }));
                    break;

                case 'fis':
                    const fisTimestamp = Date.now().toString();
                    const fisSignature = crypto
                        .createHmac('sha256', config.secret)
                        .update(fisTimestamp)
                        .digest('hex');

                    const fisResponse = await axios.get(`${config.baseUrl}/terminals/atm`, {
                        headers: {
                            'X-API-Key': config.apiKey,
                            'X-Timestamp': fisTimestamp,
                            'X-Signature': fisSignature
                        },
                        params: branchCode ? { location: branchCode } : {}
                    });

                    machines = fisResponse.data.map(machine => ({
                        externalId: machine.terminalId,
                        system: 'fis',
                        name: machine.terminalName,
                        model: machine.terminalModel,
                        location: machine.locationName,
                        status: this.mapFisStatus(machine.status),
                        installationDate: machine.installationDate,
                        lastMaintenance: machine.lastServiceDate
                    }));
                    break;
            }

            // Cachear resultado
            this.cache.set(cacheKey, {
                data: machines,
                timestamp: Date.now()
            });

            return machines;

        } catch (error) {
            console.error(`Error obteniendo máquinas de ${system}:`, error.message);
            throw new Error(`Error conectando a ${system}: ${error.message}`);
        }
    }

    // Sincronizar datos con core banking
    async syncMaintenanceData(system, maintenanceData) {
        try {
            if (!this.connections[system]?.enabled) {
                throw new Error(`Sistema ${system} no configurado`);
            }

            const config = this.connections[system];
            let response;

            switch (system) {
                case 'temenos':
                    response = await axios.post(`${config.baseUrl}/maintenance/sync`, maintenanceData, {
                        headers: {
                            'X-API-Key': config.apiKey,
                            'X-Client-ID': config.clientId
                        }
                    });
                    break;

                case 'oracle':
                    response = await axios.post(`${config.baseUrl}/maintenance/update`, maintenanceData, {
                        auth: {
                            username: config.username,
                            password: config.password
                        }
                    });
                    break;

                case 'fis':
                    const timestamp = Date.now().toString();
                    const signature = crypto
                        .createHmac('sha256', config.secret)
                        .update(timestamp + JSON.stringify(maintenanceData))
                        .digest('hex');

                    response = await axios.post(`${config.baseUrl}/maintenance/sync`, maintenanceData, {
                        headers: {
                            'X-API-Key': config.apiKey,
                            'X-Timestamp': timestamp,
                            'X-Signature': signature
                        }
                    });
                    break;
            }

            return {
                system,
                status: 'SYNCED',
                transactionId: response.data?.transactionId,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error(`Error sincronizando con ${system}:`, error.message);
            throw new Error(`Error sincronizando con ${system}: ${error.message}`);
        }
    }

    // Obtener métricas de rendimiento de máquinas
    async getMachineMetrics(system, machineId) {
        try {
            if (!this.connections[system]?.enabled) {
                throw new Error(`Sistema ${system} no configurado`);
            }

            const config = this.connections[system];
            let metrics = {};

            switch (system) {
                case 'temenos':
                    const temenosResponse = await axios.get(`${config.baseUrl}/atm-machines/${machineId}/metrics`, {
                        headers: {
                            'X-API-Key': config.apiKey,
                            'X-Client-ID': config.clientId
                        }
                    });
                    metrics = {
                        transactions: temenosResponse.data.totalTransactions,
                        uptime: temenosResponse.data.uptimePercentage,
                        errors: temenosResponse.data.errorCount,
                        lastTransaction: temenosResponse.data.lastTransactionDate
                    };
                    break;

                case 'oracle':
                    const oracleResponse = await axios.get(`${config.baseUrl}/devices/${machineId}/performance`, {
                        auth: {
                            username: config.username,
                            password: config.password
                        }
                    });
                    metrics = {
                        transactions: oracleResponse.data.transactionCount,
                        uptime: oracleResponse.data.availability,
                        errors: oracleResponse.data.failureCount,
                        lastTransaction: oracleResponse.data.lastActivity
                    };
                    break;

                case 'fis':
                    const fisTimestamp = Date.now().toString();
                    const fisSignature = crypto
                        .createHmac('sha256', config.secret)
                        .update(fisTimestamp + machineId)
                        .digest('hex');

                    const fisResponse = await axios.get(`${config.baseUrl}/terminals/${machineId}/stats`, {
                        headers: {
                            'X-API-Key': config.apiKey,
                            'X-Timestamp': fisTimestamp,
                            'X-Signature': fisSignature
                        }
                    });
                    metrics = {
                        transactions: fisResponse.data.transactionVolume,
                        uptime: fisResponse.data.uptimePercent,
                        errors: fisResponse.data.errorIncidents,
                        lastTransaction: fisResponse.data.lastTransactionTime
                    };
                    break;
            }

            return {
                machineId,
                system,
                metrics,
                retrievedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error(`Error obteniendo métricas de ${system}:`, error.message);
            throw new Error(`Error obteniendo métricas de ${system}: ${error.message}`);
        }
    }

    // Mapeo de estados entre sistemas
    mapTemenosStatus(status) {
        const statusMap = {
            'ACTIVE': 'active',
            'INACTIVE': 'inactive',
            'MAINTENANCE': 'maintenance',
            'OUT_OF_ORDER': 'out_of_order'
        };
        return statusMap[status] || 'unknown';
    }

    mapOracleStatus(status) {
        const statusMap = {
            'OPERATIONAL': 'active',
            'DOWN': 'inactive',
            'SERVICING': 'maintenance',
            'FAILED': 'out_of_order'
        };
        return statusMap[status] || 'unknown';
    }

    mapFisStatus(status) {
        const statusMap = {
            'ONLINE': 'active',
            'OFFLINE': 'inactive',
            'SERVICE': 'maintenance',
            'ERROR': 'out_of_order'
        };
        return statusMap[status] || 'unknown';
    }

    // Limpiar cache
    clearCache() {
        this.cache.clear();
        console.log('Cache de Core Banking limpiado');
    }

    // Obtener estado de todas las conexiones
    async getConnectionStatus() {
        const systems = Object.keys(this.connections);
        const statusPromises = systems.map(system => this.testConnection(system));

        try {
            const results = await Promise.allSettled(statusPromises);
            return systems.reduce((acc, system, index) => {
                acc[system] = results[index].status === 'fulfilled'
                    ? results[index].value
                    : { system, status: 'ERROR', error: results[index].reason.message };
                return acc;
            }, {});
        } catch (error) {
            console.error('Error obteniendo estado de conexiones:', error);
            return {};
        }
    }
}

module.exports = new CoreBankingConnector();