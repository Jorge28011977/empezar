const { Machine, Maintenance, Ticket } = require('../models');
const { validationResult } = require('express-validator');

// Obtener tipos de máquinas disponibles
const getMachineTypes = async (req, res) => {
    try {
        // Tipos de máquinas disponibles (pueden venir de una tabla o ser hardcodeados)
        const machineTypes = [
            { id: 1, name: 'ATM', description: 'Cajero Automático' },
            { id: 2, name: 'Kiosk', description: 'Kiosco de Servicios' },
            { id: 3, name: 'Printer', description: 'Impresora' },
            { id: 4, name: 'Scanner', description: 'Escáner' },
            { id: 5, name: 'Terminal', description: 'Terminal de Pago' }
        ];

        res.json({
            success: true,
            data: machineTypes
        });
    } catch (error) {
        console.error('Error obteniendo tipos de máquina:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Obtener todas las máquinas con filtros opcionales
const getAllMachines = async (req, res) => {
    try {
        const { location, status, model } = req.query;
        const where = {};

        if (location) where.location = location;
        if (status) where.status = status;
        if (model) where.model = model;

        const machines = await Machine.findAll({
            where,
            include: [
                {
                    model: Maintenance,
                    as: 'Maintenances',
                    attributes: ['id', 'type', 'status', 'scheduled_date', 'priority']
                },
                {
                    model: Ticket,
                    as: 'Tickets',
                    attributes: ['id', 'title', 'status', 'priority']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: machines,
            count: machines.length
        });
    } catch (error) {
        console.error('Error obteniendo máquinas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Obtener máquina por ID
const getMachineById = async (req, res) => {
    try {
        const { id } = req.params;

        const machine = await Machine.findByPk(id, {
            include: [
                {
                    model: Maintenance,
                    as: 'Maintenances',
                    attributes: ['id', 'type', 'status', 'scheduled_date', 'actual_date', 'priority', 'description']
                },
                {
                    model: Ticket,
                    as: 'Tickets',
                    attributes: ['id', 'title', 'status', 'priority', 'description', 'resolved_at']
                }
            ]
        });

        if (!machine) {
            return res.status(404).json({
                success: false,
                error: 'Máquina no encontrada'
            });
        }

        res.json({
            success: true,
            data: machine
        });
    } catch (error) {
        console.error('Error obteniendo máquina:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Crear nueva máquina
const createMachine = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Datos de entrada inválidos',
                details: errors.array()
            });
        }

        const { name, model, serial_number, location, installation_date, status } = req.body;

        const machine = await Machine.create({
            name,
            model,
            serial_number,
            location,
            installation_date,
            status: status || 'active'
        });

        res.status(201).json({
            success: true,
            data: machine,
            message: 'Máquina creada exitosamente'
        });
    } catch (error) {
        console.error('Error creando máquina:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                error: 'El número de serie ya existe'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Actualizar máquina
const updateMachine = async (req, res) => {
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
        const { name, model, serial_number, location, installation_date, status } = req.body;

        const machine = await Machine.findByPk(id);
        if (!machine) {
            return res.status(404).json({
                success: false,
                error: 'Máquina no encontrada'
            });
        }

        await machine.update({
            name,
            model,
            serial_number,
            location,
            installation_date,
            status
        });

        res.json({
            success: true,
            data: machine,
            message: 'Máquina actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error actualizando máquina:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                error: 'El número de serie ya existe'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Eliminar máquina
const deleteMachine = async (req, res) => {
    try {
        const { id } = req.params;

        const machine = await Machine.findByPk(id);
        if (!machine) {
            return res.status(404).json({
                success: false,
                error: 'Máquina no encontrada'
            });
        }

        await machine.destroy();

        res.json({
            success: true,
            message: 'Máquina eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando máquina:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

module.exports = {
    getMachineTypes,
    getAllMachines,
    getMachineById,
    createMachine,
    updateMachine,
    deleteMachine
};