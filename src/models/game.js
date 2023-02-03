const { Sequelize } = require('sequelize');

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.belongsToMany(models.tag, { through: 'TagGame' });
    }
  }
  Game.init({
    inventoryNumber: DataTypes.STRING,
    name: DataTypes.STRING,
    count: Sequelize.NUMBER,
    lendingCount: Sequelize.NUMBER,
    status: Sequelize.NUMBER,
    language: DataTypes.STRING,
    minPlayers: Sequelize.NUMBER,
    maxPlayers: Sequelize.NUMBER,
    age: Sequelize.NUMBER,
    gameTime: Sequelize.NUMBER,
    description: DataTypes.STRING,
    note: DataTypes.STRING,
    image: DataTypes.STRING,
    sourceLink: Sequelize.BOOLEAN,
    rating: Sequelize.ARRAY(Sequelize.INTEGER),
    public: Sequelize.BOOLEAN,
    userName: DataTypes.STRING,
    userEmail: DataTypes.STRING,
    publisher: DataTypes.STRING,
    extension: DataTypes.STRING,
    price: Sequelize.NUMBER,
    purchasePrice: Sequelize.NUMBER
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};
