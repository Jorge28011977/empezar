'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Technician extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Technician.belongsTo(models.User, { foreignKey: 'user_id' });
            Technician.hasMany(models.Maintenance, { foreignKey: 'technician_id' });
            Technician.hasMany(models.Ticket, { foreignKey: 'assigned_to' });
            Technician.hasMany(models.Inventory, { foreignKey: 'technician_id' });
        }
    }
    Technician.init({
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        specialization: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        availability: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'Technician',
        tableName: 'technicians',
        timestamps: false
    });
    return Technician;
};