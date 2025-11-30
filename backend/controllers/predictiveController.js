const predictiveModel = require('../utils/predictiveModel');
const { Machine, IotData, Maintenance } = require('../models');

exports.predictMaintenance = async (req, res) => {
    try {
        const { machineId } = req.params;

        if (!machineId) {
            return res.status(400).json({ error: 'Machine ID requerido' });
        }

        const machine = await Machine.findByPk(machineId);
        if (!machine) {
            return res.status(404).json({ error: 'Máquina no encontrada' });
        }

        const riskData = await predictiveModel.predictRisk(machineId);
        const riskScore = predictiveModel.calculateRiskScore(riskData);

        // Calcular días hasta mantenimiento recomendado
        const daysToMaintenance = riskData.level === 'high' ? 1 :
            riskData.level === 'medium' ? 7 : 30;

        res.json({
            machineId,
            riskScore,
            riskLevel: riskData.level,
            confidence: riskData.confidence,
            daysToMaintenance,
            recommendation: riskData.level === 'high' ?
                'Mantenimiento inmediato requerido' :
                riskData.level === 'medium' ?
                    'Programar mantenimiento en los próximos días' :
                    'Mantenimiento preventivo en el próximo mes'
        });
    } catch (error) {
        console.error('Error en predicción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.getFailureTrends = async (req, res) => {
    try {
        const { machineId } = req.params;
        const { days = 30 } = req.query;

        if (!machineId) {
            return res.status(400).json({ error: 'Machine ID requerido' });
        }

        const machine = await Machine.findByPk(machineId);
        if (!machine) {
            return res.status(404).json({ error: 'Máquina no encontrada' });
        }

        // Obtener datos de IoT de los últimos días
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const iotData = await IotData.findAll({
            include: [{
                model: require('../models').IotSensor,
                where: { machine_id: machineId }
            }],
            where: {
                timestamp: {
                    [require('sequelize').Op.gte]: startDate
                }
            },
            order: [['timestamp', 'ASC']]
        });

        // Agrupar por sensor y calcular tendencias
        const trends = {};
        iotData.forEach(data => {
            const sensorType = data.IotSensor.sensor_type;
            if (!trends[sensorType]) {
                trends[sensorType] = [];
            }
            trends[sensorType].push({
                timestamp: data.timestamp,
                value: parseFloat(data.value),
                unit: data.unit
            });
        });

        // Calcular estadísticas de tendencias
        const trendAnalysis = {};
        Object.keys(trends).forEach(sensorType => {
            const values = trends[sensorType].map(d => d.value);
            const timestamps = trends[sensorType].map(d => new Date(d.timestamp).getTime());

            if (values.length > 1) {
                // Calcular pendiente (tendencia)
                const n = values.length;
                const sumX = timestamps.reduce((a, b) => a + b, 0);
                const sumY = values.reduce((a, b) => a + b, 0);
                const sumXY = timestamps.reduce((sum, x, i) => sum + x * values[i], 0);
                const sumXX = timestamps.reduce((sum, x) => sum + x * x, 0);

                const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

                trendAnalysis[sensorType] = {
                    trend: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
                    slope: slope,
                    average: sumY / n,
                    max: Math.max(...values),
                    min: Math.min(...values),
                    dataPoints: values.length
                };
            }
        });

        res.json({
            machineId,
            period: `${days} días`,
            trends: trendAnalysis
        });
    } catch (error) {
        console.error('Error en análisis de tendencias:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.getMaintenanceRecommendations = async (req, res) => {
    try {
        const { machineId } = req.params;

        if (!machineId) {
            return res.status(400).json({ error: 'Machine ID requerido' });
        }

        const machine = await Machine.findByPk(machineId);
        if (!machine) {
            return res.status(404).json({ error: 'Máquina no encontrada' });
        }

        const riskData = await predictiveModel.predictRisk(machineId);

        // Obtener mantenimientos recientes
        const recentMaintenances = await Maintenance.findAll({
            where: { machine_id: machineId },
            order: [['scheduled_date', 'DESC']],
            limit: 5
        });

        // Generar recomendaciones basadas en riesgo y historial
        const recommendations = [];

        if (riskData.level === 'high') {
            recommendations.push({
                type: 'urgent',
                title: 'Mantenimiento de Emergencia',
                description: 'La máquina muestra signos de fallo inminente. Programar mantenimiento inmediato.',
                priority: 'high',
                estimatedCost: 500,
                estimatedTime: '4 horas'
            });
        }

        if (riskData.level === 'medium') {
            recommendations.push({
                type: 'preventive',
                title: 'Mantenimiento Preventivo',
                description: 'Se recomienda mantenimiento preventivo basado en análisis predictivo.',
                priority: 'medium',
                estimatedCost: 200,
                estimatedTime: '2 horas'
            });
        }

        // Recomendaciones basadas en historial
        const lastMaintenance = recentMaintenances[0];
        if (lastMaintenance) {
            const daysSinceLast = Math.floor((new Date() - new Date(lastMaintenance.scheduled_date)) / (1000 * 60 * 60 * 24));
            if (daysSinceLast > 90) {
                recommendations.push({
                    type: 'routine',
                    title: 'Mantenimiento de Rutina',
                    description: 'Han pasado más de 90 días desde el último mantenimiento.',
                    priority: 'low',
                    estimatedCost: 100,
                    estimatedTime: '1 hora'
                });
            }
        }

        res.json({
            machineId,
            riskLevel: riskData.level,
            recommendations
        });
    } catch (error) {
        console.error('Error en recomendaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};