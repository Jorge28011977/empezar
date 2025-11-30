'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class IotSensor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            IotSensor.belongsTo(models.Machine, { foreignKey: 'machine_id' });
            IotSensor.hasMany(models.IotData, { foreignKey: 'sensor_id' });
        }
    }
    IotSensor.init({
        machine_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'machines',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        sensor_type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 50]
            }
        },
        sensor_id: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        location_on_machine: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'active',
            validate: {
                isIn: [['active', 'inactive', 'maintenance']]
            }
        }
    }, {
        sequelize,
        modelName: 'IotSensor',
        tableName: 'iot_sensors',
        timestamps: false
    });
    return IotSensor;
};