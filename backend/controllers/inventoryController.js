const { Inventory, SparePart, Technician } = require('../models');
const { validationResult } = require('express-validator');
const { sequelize } = require('../models');

// Obtener movimientos de inventario con filtros
const getInventoryMovements = async (req, res) => {
    try {
        const { spare_part_id, movement_type, start_date, end_date } = req.query;
        const where = {};

        if (spare_part_id) where.spare_part_id = spare_part_id;
        if (movement_type) where.movement_type = movement_type;
        if (start_date || end_date) {
            where.date = {};
            if (start_date) where.date[require('sequelize').Op.gte] = new Date(start_date);
            if (end_date) where.date[require('sequelize').Op.lte] = new Date(end_date);
        }

        const movements = await Inventory.findAll({
            where,
            include: [
                {
                    model: SparePart,
                    as: 'SparePart',
                    attributes: ['id', 'name', 'part_number', 'category']
                },
                {
                    model: Technician,
                    as: 'Technician',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['date', 'DESC']]
        });

        res.json({
            success: true,
            data: movements,
            count: movements.length
        });
    } catch (error) {
        console.error('Error obteniendo movimientos de inventario:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Agregar movimiento de inventario
const addInventoryMovement = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                error: 'Datos de entrada inválidos',
                details: errors.array()
            });
        }

        const { spare_part_id, quantity, movement_type, reason, technician_id } = req.body;

        // Verificar que el repuesto existe
        const sparePart = await SparePart.findByPk(spare_part_id, { transaction });
        if (!sparePart) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                error: 'Repuesto no encontrado'
            });
        }

        // Calcular nuevo stock
        let newStock = sparePart.quantity_in_stock;
        if (movement_type === 'in') {
            newStock += quantity;
        } else if (movement_type === 'out') {
            newStock -= quantity;
            if (newStock < 0) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    error: 'No hay suficiente stock disponible'
                });
            }
        } else if (movement_type === 'adjustment') {
            newStock = quantity; // quantity puede ser el nuevo stock total
        }

        // Crear movimiento
        const movement = await Inventory.create({
            spare_part_id,
            quantity,
            movement_type,
            reason,
            technician_id,
            date: new Date()
        }, { transaction });

        // Actualizar stock del repuesto
        await sparePart.update({ quantity_in_stock: newStock }, { transaction });

        await transaction.commit();

        // Obtener movimiento con asociaciones
        const movementWithAssociations = await Inventory.findByPk(movement.id, {
            include: [
                {
                    model: SparePart,
                    as: 'SparePart',
                    attributes: ['id', 'name', 'part_number', 'quantity_in_stock']
                },
                {
                    model: Technician,
                    as: 'Technician',
                    attributes: ['id', 'name']
                }
            ]
        });

        res.status(201).json({
            success: true,
            data: movementWithAssociations,
            message: 'Movimiento de inventario registrado exitosamente'
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Error agregando movimiento de inventario:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Obtener stock actual
const getCurrentStock = async (req, res) => {
    try {
        const { spare_part_id } = req.query;

        if (spare_part_id) {
            // Stock de un repuesto específico
            const sparePart = await SparePart.findByPk(spare_part_id, {
                attributes: ['id', 'name', 'part_number', 'quantity_in_stock', 'minimum_stock', 'category']
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
        } else {
            // Stock de todos los repuestos
            const stock = await SparePart.findAll({
                attributes: ['id', 'name', 'part_number', 'quantity_in_stock', 'minimum_stock', 'category'],
                order: [['name', 'ASC']]
            });

            res.json({
                success: true,
                data: stock,
                count: stock.length
            });
        }
    } catch (error) {
        console.error('Error obteniendo stock actual:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

module.exports = {
    getInventoryMovements,
    addInventoryMovement,
    getCurrentStock
};