module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Borrows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userEmail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reservationDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      borrowDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      returnDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      GameId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Borrows');
  },
};
