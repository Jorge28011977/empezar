const { IotSensor, IotData, Machine } = require('../models');
const { validationResult } = require('express-validator');

// Obtener todos los sensores IoT
const getAllSensors = async (req, res) => {
    try {
        const { machine_id, status } = req.query;

        const where = {};
        if (machine_id) where.machine_id = machine_id;
        if (status) where.status = status;

        const sensors = await IotSensor.findAll({
            where,
            include: [
                {
                    model: Machine,
                    as: 'Machine',
                    attributes: ['id', 'name', 'model', 'location']
                }
            ],
            order: [['machine_id', 'ASC'], ['sensor_type', 'ASC']]
        });

        res.json({
            success: true,
            data: sensors,
            count: sensors.length
        });
    } catch (error) {
        console.error('Error obteniendo sensores:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Obtener sensor por ID
const getSensorById = async (req, res) => {
    try {
        const { id } = req.params;

        const sensor = await IotSensor.findByPk(id, {
            include: [
                {
                    model: Machine,
                    as: 'Machine',
                    attributes: ['id', 'name', 'model', 'location', 'status']
                }
            ]
        });

        if (!sensor) {
            return res.status(404).json({
                success: false,
                error: 'Sensor no encontrado'
            });
        }

        res.json({
            success: true,
            data: sensor
        });
    } catch (error) {
        console.error('Error obteniendo sensor:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Crear nuevo sensor
const createSensor = async (req, res) => {
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
            sensor_type,
            sensor_id,
            location_on_machine,
            status
        } = req.body;

        const sensor = await IotSensor.create({
            machine_id,
            sensor_type,
            sensor_id,
            location_on_machine,
            status: status || 'active'
        });

        const createdSensor = await IotSensor.findByPk(sensor.id, {
            include: [
                {
                    model: Machine,
                    as: 'Machine',
                    attributes: ['id', 'name']
                }
            ]
        });

        res.status(201).json({
            success: true,
            data: createdSensor,
            message: 'Sensor creado exitosamente'
        });
    } catch (error) {
        console.error('Error creando sensor:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Recibir datos de sensor (IoT endpoint)
const receiveSensorData = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Datos de entrada inválidos',
                details: errors.array()
            });
        }

        const { sensor_id, value, unit, timestamp } = req.body;

        // Verificar que el sensor existe
        const sensor = await IotSensor.findOne({ where: { sensor_id } });
        if (!sensor) {
            return res.status(404).json({
                success: false,
                error: 'Sensor no encontrado'
            });
        }

        // Crear registro de datos
        const dataRecord = await IotData.create({
            sensor_id: sensor.id,
            value,
            unit,
            timestamp: timestamp || new Date()
        });

        // Lógica básica de alertas (placeholder)
        let alert = null;
        // Placeholder: si value > 100, alerta (puedes personalizar por sensor_type)
        if (value > 100) {
            alert = {
                type: 'threshold_exceeded',
                message: `Valor ${value} excede el umbral para sensor ${sensor.sensor_type}`,
                sensor_id: sensor.id,
                value,
                timestamp: dataRecord.timestamp
            };
        }

        res.status(201).json({
            success: true,
            data: dataRecord,
            alert,
            message: 'Datos de sensor recibidos exitosamente'
        });
    } catch (error) {
        console.error('Error recibiendo datos de sensor:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Obtener datos de sensores con filtros
const getSensorData = async (req, res) => {
    try {
        const {
            sensor_id,
            machine_id,
            sensor_type,
            date_from,
            date_to,
            limit = 100
        } = req.query;

        const where = {};

        if (sensor_id) {
            const sensor = await IotSensor.findOne({ where: { sensor_id } });
            if (sensor) where.sensor_id = sensor.id;
        }

        if (machine_id) {
            const sensors = await IotSensor.findAll({ where: { machine_id } });
            where.sensor_id = sensors.map(s => s.id);
        }

        if (sensor_type) {
            const sensors = await IotSensor.findAll({ where: { sensor_type } });
            where.sensor_id = sensors.map(s => s.id);
        }

        // Filtros de fecha
        if (date_from || date_to) {
            where.timestamp = {};
            if (date_from) where.timestamp.$gte = date_from;
            if (date_to) where.timestamp.$lte = date_to;
        }

        const data = await IotData.findAll({
            where,
            include: [
                {
                    model: IotSensor,
                    as: 'IotSensor',
                    attributes: ['sensor_id', 'sensor_type', 'location_on_machine'],
                    include: [
                        {
                            model: Machine,
                            as: 'Machine',
                            attributes: ['id', 'name', 'location']
                        }
                    ]
                }
            ],
            order: [['timestamp', 'DESC']],
            limit: parseInt(limit)
        });

        res.json({
            success: true,
            data,
            count: data.length
        });
    } catch (error) {
        console.error('Error obteniendo datos de sensores:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Obtener alertas (placeholder básico)
const getAlerts = async (req, res) => {
    try {
        // Placeholder: obtener datos recientes y simular alertas
        const recentData = await IotData.findAll({
            where: {
                timestamp: {
                    $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24 horas
                }
            },
            include: [
                {
                    model: IotSensor,
                    as: 'IotSensor',
                    attributes: ['sensor_id', 'sensor_type', 'location_on_machine'],
                    include: [
                        {
                            model: Machine,
                            as: 'Machine',
                            attributes: ['id', 'name', 'location']
                        }
                    ]
                }
            ],
            order: [['timestamp', 'DESC']]
        });

        // Simular alertas basadas en valores altos
        const alerts = recentData
            .filter(d => d.value > 100)
            .map(d => ({
                id: d.id,
                type: 'threshold_exceeded',
                message: `Valor alto detectado: ${d.value} en sensor ${d.IotSensor.sensor_type}`,
                sensor: d.IotSensor,
                value: d.value,
                timestamp: d.timestamp,
                severity: d.value > 150 ? 'high' : 'medium'
            }));

        res.json({
            success: true,
            data: alerts,
            count: alerts.length
        });
    } catch (error) {
        console.error('Error obteniendo alertas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

module.exports = {
    getAllSensors,
    getSensorById,
    createSensor,
    receiveSensorData,
    getSensorData,
    getAlerts
};