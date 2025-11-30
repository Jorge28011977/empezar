'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Ticket extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Ticket.belongsTo(models.Machine, { foreignKey: 'machine_id' });
            Ticket.belongsTo(models.User, { foreignKey: 'reported_by', as: 'reporter' });
            Ticket.belongsTo(models.Technician, { foreignKey: 'assigned_to', as: 'assignee' });
            Ticket.hasMany(models.Report, { foreignKey: 'ticket_id' });
        }
    }
    Ticket.init({
        machine_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'machines',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        reported_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        assigned_to: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'technicians',
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 200]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        priority: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'medium',
            validate: {
                isIn: [['low', 'medium', 'high', 'critical']]
            }
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'open',
            validate: {
                isIn: [['open', 'assigned', 'in_progress', 'resolved', 'closed']]
            }
        },
        resolved_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Ticket',
        tableName: 'tickets',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    return Ticket;
};