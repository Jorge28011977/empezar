'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MaintenanceTemplate extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            MaintenanceTemplate.hasMany(models.Maintenance, { foreignKey: 'template_id' });
        }
    }
    MaintenanceTemplate.init({
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
        type: {
            type: DataTypes.ENUM('preventive', 'corrective'),
            allowNull: false,
            validate: {
                isIn: [['preventive', 'corrective']]
            }
        },
        frequency_days: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1
            }
        },
        estimated_duration_hours: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            validate: {
                min: 0
            }
        },
        required_parts: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'MaintenanceTemplate',
        tableName: 'maintenance_templates',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });
    return MaintenanceTemplate;
};