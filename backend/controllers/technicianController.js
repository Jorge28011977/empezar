const { Technician, User, Maintenance, Ticket } = require('../models');
const { validationResult } = require('express-validator');

// Obtener todos los técnicos con filtros opcionales
const getAllTechnicians = async (req, res) => {
    try {
        const { availability, specialization } = req.query;
        const where = {};

        if (availability !== undefined) {
            where.availability = availability === 'true';
        }
        if (specialization) {
            where.specialization = specialization;
        }

        const technicians = await Technician.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['id', 'username', 'email', 'role']
                },
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
            order: [['user_id', 'ASC']]
        });

        res.json({
            success: true,
            data: technicians,
            count: technicians.length
        });
    } catch (error) {
        console.error('Error obteniendo técnicos:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Obtener técnico por ID
const getTechnicianById = async (req, res) => {
    try {
        const { id } = req.params;

        const technician = await Technician.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['id', 'username', 'email', 'role']
                },
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

        if (!technician) {
            return res.status(404).json({
                success: false,
                error: 'Técnico no encontrado'
            });
        }

        res.json({
            success: true,
            data: technician
        });
    } catch (error) {
        console.error('Error obteniendo técnico:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Crear nuevo técnico
const createTechnician = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Datos de entrada inválidos',
                details: errors.array()
            });
        }

        const { user_id, specialization, availability } = req.body;

        // Verificar que el usuario existe y tiene rol 'tecnico'
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }
        if (user.role !== 'tecnico') {
            return res.status(400).json({
                success: false,
                error: 'El usuario debe tener rol de técnico'
            });
        }

        // Verificar que no existe ya un técnico para este usuario
        const existingTechnician = await Technician.findOne({ where: { user_id } });
        if (existingTechnician) {
            return res.status(400).json({
                success: false,
                error: 'Ya existe un técnico para este usuario'
            });
        }

        const technician = await Technician.create({
            user_id,
            specialization,
            availability: availability !== undefined ? availability : true
        });

        // Incluir datos del usuario en la respuesta
        const technicianWithUser = await Technician.findByPk(technician.id, {
            include: [{
                model: User,
                as: 'User',
                attributes: ['id', 'username', 'email', 'role']
            }]
        });

        res.status(201).json({
            success: true,
            data: technicianWithUser,
            message: 'Técnico creado exitosamente'
        });
    } catch (error) {
        console.error('Error creando técnico:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                error: 'Ya existe un técnico para este usuario'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Actualizar técnico
const updateTechnician = async (req, res) => {
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
        const { specialization, availability } = req.body;

        const technician = await Technician.findByPk(id);
        if (!technician) {
            return res.status(404).json({
                success: false,
                error: 'Técnico no encontrado'
            });
        }

        await technician.update({
            specialization,
            availability
        });

        // Incluir datos del usuario en la respuesta
        const updatedTechnician = await Technician.findByPk(id, {
            include: [{
                model: User,
                as: 'User',
                attributes: ['id', 'username', 'email', 'role']
            }]
        });

        res.json({
            success: true,
            data: updatedTechnician,
            message: 'Técnico actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error actualizando técnico:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Eliminar técnico
const deleteTechnician = async (req, res) => {
    try {
        const { id } = req.params;

        const technician = await Technician.findByPk(id);
        if (!technician) {
            return res.status(404).json({
                success: false,
                error: 'Técnico no encontrado'
            });
        }

        await technician.destroy();

        res.json({
            success: true,
            message: 'Técnico eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando técnico:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

module.exports = {
    getAllTechnicians,
    getTechnicianById,
    createTechnician,
    updateTechnician,
    deleteTechnician
};