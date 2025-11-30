const tf = require('@tensorflow/tfjs');
const { IotData, Maintenance } = require('../models');

class PredictiveModel {
    constructor() {
        this.model = null;
        this.isTrained = false;
    }

    // Entrenar el modelo con datos históricos
    async trainModel() {
        try {
            // Obtener datos de IoT y mantenimientos para etiquetar
            const iotData = await IotData.findAll({
                include: [{
                    model: require('../models').IotSensor,
                    include: [require('../models').Machine]
                }],
                limit: 1000, // Limitar para entrenamiento rápido
                order: [['timestamp', 'DESC']]
            });

            const maintenanceData = await Maintenance.findAll({
                where: { status: 'completed' },
                include: [require('../models').Machine]
            });

            // Preparar datos de entrenamiento (simplificado)
            const features = [];
            const labels = [];

            iotData.forEach(data => {
                const sensor = data.IotSensor;
                const machine = sensor ? sensor.Machine : null;
                if (machine) {
                    // Características: valor del sensor, tipo de sensor
                    const feature = [
                        parseFloat(data.value) || 0,
                        sensor.sensor_type === 'temperature' ? 1 : 0,
                        sensor.sensor_type === 'vibration' ? 1 : 0,
                        sensor.sensor_type === 'pressure' ? 1 : 0
                    ];

                    // Etiqueta: 1 si hay mantenimiento reciente (riesgo alto), 0 si no
                    const recentMaintenance = maintenanceData.some(m =>
                        m.machine_id === machine.id &&
                        Math.abs(new Date(m.scheduled_date) - new Date(data.timestamp)) < 7 * 24 * 60 * 60 * 1000 // 7 días
                    );
                    labels.push(recentMaintenance ? 1 : 0);
                    features.push(feature);
                }
            });

            if (features.length === 0) {
                console.log('No hay suficientes datos para entrenar');
                return;
            }

            // Crear tensores
            const xs = tf.tensor2d(features);
            const ys = tf.tensor2d(labels.map(l => [l]));

            // Modelo simple de red neuronal
            this.model = tf.sequential();
            this.model.add(tf.layers.dense({ inputShape: [4], units: 10, activation: 'relu' }));
            this.model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

            this.model.compile({
                optimizer: tf.train.adam(),
                loss: 'binaryCrossentropy',
                metrics: ['accuracy']
            });

            // Entrenar
            await this.model.fit(xs, ys, {
                epochs: 50,
                batchSize: 32,
                verbose: 0
            });

            this.isTrained = true;
            console.log('Modelo entrenado exitosamente');
        } catch (error) {
            console.error('Error entrenando modelo:', error);
        }
    }

    // Predecir riesgo para una máquina
    async predictRisk(machineId) {
        if (!this.isTrained) {
            await this.trainModel();
        }

        try {
            // Obtener datos recientes de IoT para la máquina
            const recentData = await IotData.findAll({
                include: [{
                    model: require('../models').IotSensor,
                    where: { machine_id: machineId }
                }],
                limit: 10,
                order: [['timestamp', 'DESC']]
            });

            if (recentData.length === 0) {
                return { risk: 0.5, confidence: 0 }; // Riesgo neutral si no hay datos
            }

            // Promedio de predicciones
            const predictions = [];
            for (const data of recentData) {
                const sensor = data.IotSensor;
                const feature = [
                    parseFloat(data.value) || 0,
                    sensor.sensor_type === 'temperature' ? 1 : 0,
                    sensor.sensor_type === 'vibration' ? 1 : 0,
                    sensor.sensor_type === 'pressure' ? 1 : 0
                ];

                const input = tf.tensor2d([feature]);
                const pred = this.model.predict(input);
                const risk = pred.dataSync()[0];
                predictions.push(risk);
            }

            const avgRisk = predictions.reduce((a, b) => a + b, 0) / predictions.length;
            return {
                risk: avgRisk,
                confidence: Math.min(predictions.length / 10, 1), // Confianza basada en cantidad de datos
                level: avgRisk > 0.7 ? 'high' : avgRisk > 0.3 ? 'medium' : 'low'
            };
        } catch (error) {
            console.error('Error en predicción:', error);
            return { risk: 0.5, confidence: 0, level: 'unknown' };
        }
    }

    // Calcular score de riesgo (0-100)
    calculateRiskScore(riskData) {
        return Math.round(riskData.risk * 100);
    }
}

module.exports = new PredictiveModel();