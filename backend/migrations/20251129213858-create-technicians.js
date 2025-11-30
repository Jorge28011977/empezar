'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('technicians', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      specialization: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      availability: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    });

    // Add indexes
    await queryInterface.addIndex('technicians', ['user_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('technicians');
  }
};
