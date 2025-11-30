'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Report extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Report.belongsTo(models.Maintenance, { foreignKey: 'maintenance_id' });
            Report.belongsTo(models.Ticket, { foreignKey: 'ticket_id' });
            Report.belongsTo(models.User, { foreignKey: 'generated_by', as: 'generator' });
        }
    }
    Report.init({
        maintenance_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'maintenances',
                key: 'id'
            }
        },
        ticket_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'tickets',
                key: 'id'
            }
        },
        generated_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 50]
            }
        },
        content: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        generated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Report',
        tableName: 'reports',
        timestamps: false
    });
    return Report;
};