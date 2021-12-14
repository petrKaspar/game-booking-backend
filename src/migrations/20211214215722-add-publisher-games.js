'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Games', 'publisher', {
      type: Sequelize.STRING,
      allowNull: true,
    }),
    await queryInterface.addColumn('Games', 'extension', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Games', 'publisher'),
    await queryInterface.removeColumn('Games', 'extension')
  }
};
