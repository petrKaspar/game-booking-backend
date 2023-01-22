
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      inventoryNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      lendingCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      language: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      minPlayers: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      maxPlayers: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      gameTime: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sourceLink: {
        type: Sequelize.STRING,
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
      public: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rating: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: [0, 1, 2, 0, 5],
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Games');
  },
};
