const { MaintenanceTemplate, SparePart } = require('../models');
const { validationResult } = require('express-validator');

// Obtener todas las plantillas con filtros opcionales
const getAllTemplates = async (req, res) => {
    try {
        const {
            type,
            frequency_days,
            machine_type
        } = req.query;

        const where = {};

        if (type) where.type = type;
        if (frequency_days) where.frequency_days = frequency_days;
        // machine_type no existe en el modelo, filtrar por type si es necesario

        const templates = await MaintenanceTemplate.findAll({
            where,
            include: [
                // No hay asociaciones directas, pero required_parts contiene IDs de repuestos
            ],
            order: [['name', 'ASC']]
        });

        res.json({
            success: true,
            data: templates,
            count: templates.length
        });
    } catch (error) {
        console.error('Error obteniendo plantillas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Obtener plantilla por ID
const getTemplateById = async (req, res) => {
    try {
        const { id } = req.params;

        const template = await MaintenanceTemplate.findByPk(id);

        if (!template) {
            return res.status(404).json({
                success: false,
                error: 'Plantilla no encontrada'
            });
        }

        res.json({
            success: true,
            data: template
        });
    } catch (error) {
        console.error('Error obteniendo plantilla:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Crear nueva plantilla
const createTemplate = async (req, res) => {
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
            name,
            description,
            type,
            frequency_days,
            estimated_duration_hours,
            required_parts,
            instructions
        } = req.body;

        const template = await MaintenanceTemplate.create({
            name,
            description,
            type,
            frequency_days,
            estimated_duration_hours,
            required_parts,
            instructions
        });

        res.status(201).json({
            success: true,
            data: template,
            message: 'Plantilla creada exitosamente'
        });
    } catch (error) {
        console.error('Error creando plantilla:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Actualizar plantilla
const updateTemplate = async (req, res) => {
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
            name,
            description,
            type,
            frequency_days,
            estimated_duration_hours,
            required_parts,
            instructions
        } = req.body;

        const template = await MaintenanceTemplate.findByPk(id);
        if (!template) {
            return res.status(404).json({
                success: false,
                error: 'Plantilla no encontrada'
            });
        }

        await template.update({
            name,
            description,
            type,
            frequency_days,
            estimated_duration_hours,
            required_parts,
            instructions
        });

        res.json({
            success: true,
            data: template,
            message: 'Plantilla actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error actualizando plantilla:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Eliminar plantilla
const deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;

        const template = await MaintenanceTemplate.findByPk(id);
        if (!template) {
            return res.status(404).json({
                success: false,
                error: 'Plantilla no encontrada'
            });
        }

        await template.destroy();

        res.json({
            success: true,
            message: 'Plantilla eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando plantilla:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Obtener plantillas por tipo de máquina (filtrar por type del template)
const getTemplatesByMachineType = async (req, res) => {
    try {
        const { type } = req.params;

        const templates = await MaintenanceTemplate.findAll({
            where: { type },
            order: [['name', 'ASC']]
        });

        res.json({
            success: true,
            data: templates,
            count: templates.length
        });
    } catch (error) {
        console.error('Error obteniendo plantillas por tipo:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

module.exports = {
    getAllTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplatesByMachineType
};