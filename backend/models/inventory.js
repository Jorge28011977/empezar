'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Inventory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Inventory.belongsTo(models.SparePart, { foreignKey: 'spare_part_id' });
            Inventory.belongsTo(models.Technician, { foreignKey: 'technician_id' });
        }
    }
    Inventory.init({
        spare_part_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'spare_parts',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        movement_type: {
            type: DataTypes.ENUM('in', 'out', 'adjustment'),
            allowNull: false,
            validate: {
                isIn: [['in', 'out', 'adjustment']]
            }
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        technician_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'technicians',
                key: 'id'
            }
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Inventory',
        tableName: 'inventory',
        timestamps: false
    });
    return Inventory;
};