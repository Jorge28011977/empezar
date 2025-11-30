'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class BlockchainRecord extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            BlockchainRecord.belongsTo(models.Maintenance, { foreignKey: 'maintenance_id' });
        }
    }
    BlockchainRecord.init({
        maintenance_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'maintenances',
                key: 'id'
            }
        },
        transaction_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        block_number: {
            type: DataTypes.BIGINT,
            allowNull: true,
            validate: {
                min: 0
            }
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        data_hash: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'BlockchainRecord',
        tableName: 'blockchain_records',
        timestamps: false
    });
    return BlockchainRecord;
};