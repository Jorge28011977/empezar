'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class IotData extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            IotData.belongsTo(models.IotSensor, { foreignKey: 'sensor_id' });
        }
    }
    IotData.init({
        sensor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'iot_sensors',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        value: {
            type: DataTypes.DECIMAL(10, 4),
            allowNull: true,
            validate: {
                min: -999999.9999,
                max: 999999.9999
            }
        },
        unit: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'IotData',
        tableName: 'iot_data',
        timestamps: false
    });
    return IotData;
};