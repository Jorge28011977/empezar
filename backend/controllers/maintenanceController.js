const { Maintenance, Machine, Technician, MaintenanceTemplate, SparePart, MaintenancePart, BlockchainRecord } = require('../models');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

// Obtener todos los mantenimientos con filtros opcionales
const getAllMaintenances = async (req, res) => {
    try {
        const {
            type,
            status,
            scheduled_date_from,
            scheduled_date_to,
            machine_id,
            technician_id,
            priority
        } = req.query;

        const where = {};

        if (type) where.type = type;
        if (status) where.status = status;
        if (machine_id) where.machine_id = machine_id;
        if (technician_id) where.technician_id = technician_id;
        if (priority) where.priority = priority;

        // Filtros de fecha
        if (scheduled_date_from || scheduled_date_to) {
            where.scheduled_date = {};
            if (scheduled_date_from) where.scheduled_date.$gte = scheduled_date_from;
            if (scheduled_date_to) where.scheduled_date.$lte = scheduled_date_to;
        }

        const maintenances = await Maintenance.findAll({
            where,
            include: [
                {
                    model: Machine,
                    as: 'Machine',
                    attributes: ['id', 'name', 'model', 'serial_number', 'location']
                },
                {
                    model: Technician,
                    as: 'Technician',
                    attributes: ['id', 'name', 'specialty', 'phone']
                },
                {
                    model: MaintenanceTemplate,
                    as: 'MaintenanceTemplate',
                    attributes: ['id', 'name', 'description', 'frequency_days']
                },
                {
                    model: SparePart,
                    as: 'SpareParts',
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'part_number']
                }
            ],
            order: [['scheduled_date', 'ASC'], ['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: maintenances,
            count: maintenances.length
        });
    } catch (error) {
        console.error('Error obteniendo mantenimientos:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Obtener mantenimiento por ID
const getMaintenanceById = async (req, res) => {
    try {
        const { id } = req.params;

        const maintenance = await Maintenance.findByPk(id, {
            include: [
                {
                    model: Machine,
                    as: 'Machine',
                    attributes: ['id', 'name', 'model', 'serial_number', 'location', 'status']
                },
                {
                    model: Technician,
                    as: 'Technician',
                    attributes: ['id', 'name', 'specialty', 'phone', 'email']
                },
                {
                    model: MaintenanceTemplate,
                    as: 'MaintenanceTemplate',
                    attributes: ['id', 'name', 'description', 'frequency_days', 'estimated_duration']
                },
                {
                    model: SparePart,
                    as: 'SpareParts',
                    through: { attributes: ['quantity'] },
                    attributes: ['id', 'name', 'part_number', 'description']
                }
            ]
        });

        if (!maintenance) {
            return res.status(404).json({
                success: false,
                error: 'Mantenimiento no encontrado'
            });
        }

        res.json({
            success: true,
            data: maintenance
        });
    } catch (error) {
        console.error('Error obteniendo mantenimiento:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Crear nuevo mantenimiento
const createMaintenance = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Datos de entrada inválidos',
                details: errors.array()
            });
        }

        const {
            machine_id,
            template_id,
            technician_id,
            type,
            scheduled_date,
            priority,
            description,
            notes,
            duration_hours,
            cost,
            spare_parts
        } = req.body;

        const maintenance = await Maintenance.create({
            machine_id,
            template_id,
            technician_id,
            type,
            scheduled_date,
            priority: priority || 'medium',
            description,
            notes,
            duration_hours,
            cost,
            status: 'scheduled'
        });

        // Asociar repuestos si se proporcionan
        if (spare_parts && Array.isArray(spare_parts)) {
            for (const part of spare_parts) {
                await MaintenancePart.create({
                    maintenance_id: maintenance.id,
                    spare_part_id: part.id,
                    quantity: part.quantity || 1
                });
            }
        }

        // Obtener el mantenimiento con asociaciones
        const createdMaintenance = await Maintenance.findByPk(maintenance.id, {
            include: [
                {
                    model: Machine,
                    as: 'Machine',
                    attributes: ['id', 'name', 'model']
                },
                {
                    model: Technician,
                    as: 'Technician',
                    attributes: ['id', 'name']
                },
                {
                    model: SparePart,
                    as: 'SpareParts',
                    through: { attributes: ['quantity'] },
                    attributes: ['id', 'name']
                }
            ]
        });

        res.status(201).json({
            success: true,
            data: createdMaintenance,
            message: 'Mantenimiento creado exitosamente'
        });
    } catch (error) {
        console.error('Error creando mantenimiento:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Actualizar mantenimiento
const updateMaintenance = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Datos de entrada inválidos',
                details: errors.array()
            });
        }

        const { id } = req.params;
        const {
            machine_id,
            template_id,
            technician_id,
            type,
            scheduled_date,
            actual_date,
            status,
            priority,
            description,
            notes,
            duration_hours,
            cost,
            spare_parts
        } = req.body;

        const maintenance = await Maintenance.findByPk(id);
        if (!maintenance) {
            return res.status(404).json({
                success: false,
                error: 'Mantenimiento no encontrado'
            });
        }

        await maintenance.update({
            machine_id,
            template_id,
            technician_id,
            type,
            scheduled_date,
            actual_date,
            status,
            priority,
            description,
            notes,
            duration_hours,
            cost
        });

        // Actualizar repuestos si se proporcionan
        if (spare_parts && Array.isArray(spare_parts)) {
            // Eliminar asociaciones existentes
            await MaintenancePart.destroy({ where: { maintenance_id: id } });

            // Crear nuevas asociaciones
            for (const part of spare_parts) {
                await MaintenancePart.create({
                    maintenance_id: id,
                    spare_part_id: part.id,
                    quantity: part.quantity || 1
                });
            }
        }

        // Obtener el mantenimiento actualizado
        const updatedMaintenance = await Maintenance.findByPk(id, {
            include: [
                {
                    model: Machine,
                    as: 'Machine',
                    attributes: ['id', 'name', 'model']
                },
                {
                    model: Technician,
                    as: 'Technician',
                    attributes: ['id', 'name']
                },
                {
                    model: SparePart,
                    as: 'SpareParts',
                    through: { attributes: ['quantity'] },
                    attributes: ['id', 'name']
                }
            ]
        });

        res.json({
            success: true,
            data: updatedMaintenance,
            message: 'Mantenimiento actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error actualizando mantenimiento:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Eliminar mantenimiento
const deleteMaintenance = async (req, res) => {
    try {
        const { id } = req.params;

        const maintenance = await Maintenance.findByPk(id);
        if (!maintenance) {
            return res.status(404).json({
                success: false,
                error: 'Mantenimiento no encontrado'
            });
        }

        // Eliminar asociaciones de repuestos
        await MaintenancePart.destroy({ where: { maintenance_id: id } });

        await maintenance.destroy();

        res.json({
            success: true,
            message: 'Mantenimiento eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando mantenimiento:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Asignar técnico a mantenimiento
const assignTechnician = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Datos de entrada inválidos',
                details: errors.array()
            });
        }

        const { id } = req.params;
        const { technician_id } = req.body;

        const maintenance = await Maintenance.findByPk(id);
        if (!maintenance) {
            return res.status(404).json({
                success: false,
                error: 'Mantenimiento no encontrado'
            });
        }

        // Verificar que el técnico existe
        const technician = await Technician.findByPk(technician_id);
        if (!technician) {
            return res.status(404).json({
                success: false,
                error: 'Técnico no encontrado'
            });
        }

        await maintenance.update({
            technician_id,
            status: 'in_progress'
        });

        res.json({
            success: true,
            message: 'Técnico asignado exitosamente',
            data: {
                maintenance_id: id,
                technician_id,
                technician_name: technician.name
            }
        });
    } catch (error) {
        console.error('Error asignando técnico:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Completar mantenimiento
const completeMaintenance = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Datos de entrada inválidos',
                details: errors.array()
            });
        }

        const { id } = req.params;
        const { actual_date, notes, duration_hours, cost } = req.body;

        const maintenance = await Maintenance.findByPk(id);
        if (!maintenance) {
            return res.status(404).json({
                success: false,
                error: 'Mantenimiento no encontrado'
            });
        }

        await maintenance.update({
            actual_date: actual_date || new Date().toISOString().split('T')[0],
            status: 'completed',
            notes: notes || maintenance.notes,
            duration_hours: duration_hours || maintenance.duration_hours,
            cost: cost || maintenance.cost
        });

        res.json({
            success: true,
            message: 'Mantenimiento completado exitosamente',
            data: {
                maintenance_id: id,
                status: 'completed',
                actual_date: maintenance.actual_date
            }
        });
    } catch (error) {
        console.error('Error completando mantenimiento:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Generar registro blockchain para mantenimiento
const generateBlockchainRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const maintenance = await Maintenance.findByPk(id, {
            include: [
                {
                    model: Machine,
                    as: 'Machine',
                    attributes: ['id', 'name', 'model', 'serial_number']
                },
                {
                    model: Technician,
                    as: 'Technician',
                    attributes: ['id', 'name']
                }
            ]
        });

        if (!maintenance) {
            return res.status(404).json({
                success: false,
                error: 'Mantenimiento no encontrado'
            });
        }

        // Verificar si ya existe un registro blockchain
        const existingRecord = await BlockchainRecord.findOne({
            where: { maintenance_id: id }
        });

        if (existingRecord) {
            return res.status(400).json({
                success: false,
                error: 'Ya existe un registro blockchain para este mantenimiento'
            });
        }

        // Crear datos para hash (simulando blockchain básico)
        const dataToHash = {
            maintenance_id: maintenance.id,
            machine_id: maintenance.machine_id,
            technician_id: maintenance.technician_id,
            type: maintenance.type,
            scheduled_date: maintenance.scheduled_date,
            actual_date: maintenance.actual_date,
            status: maintenance.status,
            description: maintenance.description,
            timestamp: new Date().toISOString()
        };

        // Generar hash SHA-256
        const dataString = JSON.stringify(dataToHash);
        const hash = crypto.createHash('sha256').update(dataString).digest('hex');

        // Simular transacción blockchain (placeholder)
        const transactionHash = `0x${crypto.randomBytes(32).toString('hex')}`;
        const blockNumber = Math.floor(Math.random() * 1000000) + 1000000; // Simulado

        // Crear registro blockchain
        const blockchainRecord = await BlockchainRecord.create({
            maintenance_id: id,
            transaction_hash: transactionHash,
            block_number: blockNumber,
            data_hash: hash,
            timestamp: new Date()
        });

        res.status(201).json({
            success: true,
            data: {
                maintenance_id: id,
                transaction_hash: transactionHash,
                block_number: blockNumber,
                data_hash: hash,
                timestamp: blockchainRecord.timestamp
            },
            message: 'Registro blockchain generado exitosamente'
        });
    } catch (error) {
        console.error('Error generando registro blockchain:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Verificar integridad de mantenimiento usando blockchain
const verifyBlockchainRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const maintenance = await Maintenance.findByPk(id);
        if (!maintenance) {
            return res.status(404).json({
                success: false,
                error: 'Mantenimiento no encontrado'
            });
        }

        const blockchainRecord = await BlockchainRecord.findOne({
            where: { maintenance_id: id }
        });

        if (!blockchainRecord) {
            return res.status(404).json({
                success: false,
                error: 'No existe registro blockchain para este mantenimiento'
            });
        }

        // Recrear hash con datos actuales
        const currentData = {
            maintenance_id: maintenance.id,
            machine_id: maintenance.machine_id,
            technician_id: maintenance.technician_id,
            type: maintenance.type,
            scheduled_date: maintenance.scheduled_date,
            actual_date: maintenance.actual_date,
            status: maintenance.status,
            description: maintenance.description,
            timestamp: blockchainRecord.timestamp.toISOString()
        };

        const currentHash = crypto.createHash('sha256')
            .update(JSON.stringify(currentData))
            .digest('hex');

        const isValid = currentHash === blockchainRecord.data_hash;

        res.json({
            success: true,
            data: {
                maintenance_id: id,
                stored_hash: blockchainRecord.data_hash,
                current_hash: currentHash,
                is_valid: isValid,
                transaction_hash: blockchainRecord.transaction_hash,
                block_number: blockchainRecord.block_number,
                timestamp: blockchainRecord.timestamp
            }
        });
    } catch (error) {
        console.error('Error verificando registro blockchain:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

module.exports = {
    getAllMaintenances,
    getMaintenanceById,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
    assignTechnician,
    completeMaintenance,
    generateBlockchainRecord,
    verifyBlockchainRecord
};