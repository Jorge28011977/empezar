'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CalendarEvent extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            CalendarEvent.belongsTo(models.Maintenance, { foreignKey: 'maintenance_id' });
        }
    }
    CalendarEvent.init({
        maintenance_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'maintenances',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 200]
            }
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        reminder: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'CalendarEvent',
        tableName: 'calendar_events',
        timestamps: false
    });
    return CalendarEvent;
};