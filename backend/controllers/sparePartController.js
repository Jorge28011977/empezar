const { SparePart, Inventory } = require('../models');
const { validationResult } = require('express-validator');

// Obtener todos los repuestos con filtros opcionales
const getAllSpareParts = async (req, res) => {
    try {
        const { category, low_stock } = req.query;
        const where = {};

        if (category) where.category = category;
        if (low_stock === 'true') {
            where.quantity_in_stock = {
                [require('sequelize').Op.lte]: require('sequelize').col('minimum_stock')
            };
        }

        const spareParts = await SparePart.findAll({
            where,
            include: [
                {
                    model: Inventory,
                    as: 'Inventories',
                    attributes: ['id', 'quantity', 'movement_type', 'date', 'reason']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: spareParts,
            count: spareParts.length
        });
    } catch (error) {
        console.error('Error obteniendo repuestos:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Obtener repuesto por ID
const getSparePartById = async (req, res) => {
    try {
        const { id } = req.params;

        const sparePart = await SparePart.findByPk(id, {
            include: [
                {
                    model: Inventory,
                    as: 'Inventories',
                    attributes: ['id', 'quantity', 'movement_type', 'date', 'reason', 'technician_id']
                }
            ]
        });

        if (!sparePart) {
            return res.status(404).json({
                success: false,
                error: 'Repuesto no encontrado'
            });
        }

        res.json({
            success: true,
            data: sparePart
        });
    } catch (error) {
        console.error('Error obteniendo repuesto:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Crear nuevo repuesto
const createSparePart = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Datos de entrada inválidos',
                details: errors.array()
            });
        }

        const { name, description, part_number, category, unit_cost, quantity_in_stock, minimum_stock, supplier } = req.body;

        const sparePart = await SparePart.create({
            name,
            description,
            part_number,
            category,
            unit_cost,
            quantity_in_stock: quantity_in_stock || 0,
            minimum_stock: minimum_stock || 0,
            supplier
        });

        res.status(201).json({
            success: true,
            data: sparePart,
            message: 'Repuesto creado exitosamente'
        });
    } catch (error) {
        console.error('Error creando repuesto:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                error: 'El número de parte ya existe'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Actualizar repuesto
const updateSparePart = async (req, res) => {
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
        const { name, description, part_number, category, unit_cost, quantity_in_stock, minimum_stock, supplier } = req.body;

        const sparePart = await SparePart.findByPk(id);
        if (!sparePart) {
            return res.status(404).json({
                success: false,
                error: 'Repuesto no encontrado'
            });
        }

        await sparePart.update({
            name,
            description,
            part_number,
            category,
            unit_cost,
            quantity_in_stock,
            minimum_stock,
            supplier
        });

        res.json({
            success: true,
            data: sparePart,
            message: 'Repuesto actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error actualizando repuesto:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                error: 'El número de parte ya existe'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Eliminar repuesto
const deleteSparePart = async (req, res) => {
    try {
        const { id } = req.params;

        const sparePart = await SparePart.findByPk(id);
        if (!sparePart) {
            return res.status(404).json({
                success: false,
                error: 'Repuesto no encontrado'
            });
        }

        await sparePart.destroy();

        res.json({
            success: true,
            message: 'Repuesto eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando repuesto:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Obtener alertas de stock bajo
const getLowStockAlerts = async (req, res) => {
    try {
        const lowStockParts = await SparePart.findAll({
            where: {
                quantity_in_stock: {
                    [require('sequelize').Op.lte]: require('sequelize').col('minimum_stock')
                }
            },
            attributes: ['id', 'name', 'part_number', 'quantity_in_stock', 'minimum_stock', 'category'],
            order: [['quantity_in_stock', 'ASC']]
        });

        res.json({
            success: true,
            data: lowStockParts,
            count: lowStockParts.length,
            message: lowStockParts.length > 0 ? 'Hay repuestos con stock bajo' : 'Todos los repuestos tienen stock suficiente'
        });
    } catch (error) {
        console.error('Error obteniendo alertas de stock bajo:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

module.exports = {
    getAllSpareParts,
    getSparePartById,
    createSparePart,
    updateSparePart,
    deleteSparePart,
    getLowStockAlerts
};