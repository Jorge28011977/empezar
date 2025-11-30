'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SparePart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            SparePart.hasMany(models.Inventory, { foreignKey: 'spare_part_id' });
            SparePart.belongsToMany(models.Maintenance, {
                through: models.MaintenancePart,
                foreignKey: 'spare_part_id',
                otherKey: 'maintenance_id'
            });
        }
    }
    SparePart.init({
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        part_number: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        category: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        unit_cost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            validate: {
                min: 0
            }
        },
        quantity_in_stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        minimum_stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        supplier: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'SparePart',
        tableName: 'spare_parts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });
    return SparePart;
};