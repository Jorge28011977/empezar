'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MaintenancePart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            MaintenancePart.belongsTo(models.Maintenance, { foreignKey: 'maintenance_id' });
            MaintenancePart.belongsTo(models.SparePart, { foreignKey: 'spare_part_id' });
        }
    }
    MaintenancePart.init({
        maintenance_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'maintenances',
                key: 'id'
            }
        },
        spare_part_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'spare_parts',
                key: 'id'
            }
        },
        quantity_used: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
                min: 1
            }
        },
        cost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            validate: {
                min: 0
            }
        }
    }, {
        sequelize,
        modelName: 'MaintenancePart',
        tableName: 'maintenance_parts',
        timestamps: false
    });
    return MaintenancePart;
};