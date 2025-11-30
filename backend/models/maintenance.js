'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Maintenance extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Maintenance.belongsTo(models.Machine, { foreignKey: 'machine_id' });
            Maintenance.belongsTo(models.MaintenanceTemplate, { foreignKey: 'template_id' });
            Maintenance.belongsTo(models.Technician, { foreignKey: 'technician_id' });
            Maintenance.hasOne(models.CalendarEvent, { foreignKey: 'maintenance_id' });
            Maintenance.hasOne(models.BlockchainRecord, { foreignKey: 'maintenance_id' });
            Maintenance.hasMany(models.Report, { foreignKey: 'maintenance_id' });
            Maintenance.belongsToMany(models.SparePart, {
                through: models.MaintenancePart,
                foreignKey: 'maintenance_id',
                otherKey: 'spare_part_id'
            });
        }
    }
    Maintenance.init({
        machine_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'machines',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        template_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'maintenance_templates',
                key: 'id'
            }
        },
        technician_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'technicians',
                key: 'id'
            }
        },
        type: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        scheduled_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        actual_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'scheduled',
            validate: {
                isIn: [['scheduled', 'in_progress', 'completed', 'cancelled']]
            }
        },
        priority: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'medium',
            validate: {
                isIn: [['low', 'medium', 'high', 'critical']]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        duration_hours: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            validate: {
                min: 0
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
        modelName: 'Maintenance',
        tableName: 'maintenances',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    return Maintenance;
};