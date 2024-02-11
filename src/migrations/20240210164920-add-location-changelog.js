'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Changelogs', 'location', {
      type: Sequelize.STRING,
      allowNull: true,
    }),
    await queryInterface.addColumn('Changelogs', 'message', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Changelogs', 'location'),
    await queryInterface.removeColumn('Changelogs', 'message')
  }
};
