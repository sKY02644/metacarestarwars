'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        unique: true,
        type: DataTypes.UUID
      },
      movie_title: {
        type: DataTypes.STRING
      },
      comment: {
        type: DataTypes.STRING(500)
      },
      ip_address: {
        type: DataTypes.STRING
      },
      commenter: {
        type: DataTypes.STRING
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('Comments');
  }
};