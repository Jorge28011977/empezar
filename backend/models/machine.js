'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Machine extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Machine.hasMany(models.Maintenance, { foreignKey: 'machine_id' });
            Machine.hasMany(models.Ticket, { foreignKey: 'machine_id' });
            Machine.hasMany(models.IotSensor, { foreignKey: 'machine_id' });
        }
    }
    Machine.init({
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        model: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        serial_number: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        location: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        installation_date: {
            type: DataTypes.DATEONLY,
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
        modelName: 'Machine',
        tableName: 'machines',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    return Machine;
};