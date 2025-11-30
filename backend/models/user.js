'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.hasOne(models.Technician, { foreignKey: 'user_id' });
            User.hasMany(models.Ticket, { foreignKey: 'reported_by' });
            User.hasMany(models.Report, { foreignKey: 'generated_by' });
        }
    }
    User.init({
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [1, 50]
            }
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true,
                len: [1, 100]
            }
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        role: {
            type: DataTypes.ENUM('admin', 'tecnico', 'usuario'),
            allowNull: false,
            validate: {
                isIn: [['admin', 'tecnico', 'usuario']]
            }
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    return User;
};