const { Ticket, Machine, User, Technician } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Obtener todos los tickets con filtros opcionales
const getAllTickets = async (req, res) => {
    try {
        const { status, priority, machine_id, assigned_to, start_date, end_date, page = 1, limit = 10 } = req.query;
        const where = {};
        const offset = (page - 1) * limit;

        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (machine_id) where.machine_id = machine_id;
        if (assigned_to) where.assigned_to = assigned_to;

        if (start_date || end_date) {
            where.created_at = {};
            if (start_date) where.created_at[Op.gte] = new Date(start_date);
            if (end_date) where.created_at[Op.lte] = new Date(end_date);
        }

        const { count, rows: tickets } = await Ticket.findAndCountAll({
            where,
            include: [
                {
                    model: Machine,
                    as: 'Machine',
                    attributes: ['id', 'name', 'model', 'serial_number', 'location']
                },
                {
                    model: User,
                    as: 'reporter',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Technician,
                    as: 'assignee',
                    attributes: ['id', 'name', 'specialty']
                }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            data: tickets,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Error obteniendo tickets:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Obtener ticket por ID
const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await Ticket.findByPk(id, {
            include: [
                {
                    model: Machine,
                    as: 'Machine',
                    attributes: ['id', 'name', 'model', 'serial_number', 'location', 'status']
                },
                {
                    model: User,
                    as: 'reporter',
                    attributes: ['id', 'name', 'email', 'role']
                },
                {
                    model: Technician,
                    as: 'assignee',
                    attributes: ['id', 'name', 'specialty', 'phone']
                }
            ]
        });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: 'Ticket no encontrado'
            });
        }

        res.json({
            success: true,
            data: ticket
        });
    } catch (error) {
        console.error('Error obteniendo ticket:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Crear nuevo ticket
const createTicket = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Datos de entrada inválidos',
                details: errors.array()
            });
        }

        const { machine_id, title, description, priority } = req.body;
        const reported_by = req.user.id;

        const ticket = await Ticket.create({
            machine_id,
            reported_by,
            title,
            description,
            priority: priority || 'medium'
        });

        // Obtener ticket con asociaciones
        const ticketWithAssociations = await Ticket.findByPk(ticket.id, {
            include: [
                {
                    model: Machine,
                    as: 'Machine',
                    attributes: ['id', 'name', 'model']
                },
                {
                    model: User,
                    as: 'reporter',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        res.status(201).json({
            success: true,
            data: ticketWithAssociations,
            message: 'Ticket creado exitosamente'
        });
    } catch (error) {
        console.error('Error creando ticket:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Actualizar ticket
const updateTicket = async (req, res) => {
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
        const { title, description, priority } = req.body;

        const ticket = await Ticket.findByPk(id);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: 'Ticket no encontrado'
            });
        }

        await ticket.update({
            title,
            description,
            priority
        });

        // Obtener ticket actualizado con asociaciones
        const updatedTicket = await Ticket.findByPk(id, {
            include: [
                {
                    model: Machine,
                    as: 'Machine',
                    attributes: ['id', 'name', 'model']
                },
                {
                    model: User,
                    as: 'reporter',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Technician,
                    as: 'assignee',
                    attributes: ['id', 'name']
                }
            ]
        });

        res.json({
            success: true,
            data: updatedTicket,
            message: 'Ticket actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error actualizando ticket:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Eliminar ticket
const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await Ticket.findByPk(id);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: 'Ticket no encontrado'
            });
        }

        await ticket.destroy();

        res.json({
            success: true,
            message: 'Ticket eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando ticket:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Asignar técnico a ticket
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

        const ticket = await Ticket.findByPk(id);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: 'Ticket no encontrado'
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

        await ticket.update({
            assigned_to: technician_id,
            status: 'assigned'
        });

        // Obtener ticket actualizado
        const updatedTicket = await Ticket.findByPk(id, {
            include: [
                {
                    model: Machine,
                    as: 'Machine',
                    attributes: ['id', 'name']
                },
                {
                    model: Technician,
                    as: 'assignee',
                    attributes: ['id', 'name', 'specialty']
                }
            ]
        });

        res.json({
            success: true,
            data: updatedTicket,
            message: 'Técnico asignado exitosamente'
        });
    } catch (error) {
        console.error('Error asignando técnico:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Cambiar estado del ticket
const changeStatus = async (req, res) => {
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
        const { status } = req.body;

        const ticket = await Ticket.findByPk(id);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: 'Ticket no encontrado'
            });
        }

        // Validar transiciones de estado
        const validTransitions = {
            'open': ['assigned', 'in_progress', 'closed'],
            'assigned': ['in_progress', 'resolved', 'closed'],
            'in_progress': ['resolved', 'closed'],
            'resolved': ['closed'],
            'closed': [] // No se puede cambiar de closed
        };

        if (!validTransitions[ticket.status].includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Transición de estado inválida: de ${ticket.status} a ${status}`
            });
        }

        const updateData = { status };
        if (status === 'resolved') {
            updateData.resolved_at = new Date();
        }

        await ticket.update(updateData);

        // Obtener ticket actualizado
        const updatedTicket = await Ticket.findByPk(id, {
            include: [
                {
                    model: Machine,
                    as: 'Machine',
                    attributes: ['id', 'name']
                },
                {
                    model: Technician,
                    as: 'assignee',
                    attributes: ['id', 'name']
                }
            ]
        });

        res.json({
            success: true,
            data: updatedTicket,
            message: 'Estado del ticket actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error cambiando estado:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

module.exports = {
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    assignTechnician,
    changeStatus
};