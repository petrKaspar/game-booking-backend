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
    status: {
      type: Sequelize.NUMBER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isIn: {
          args: [[1, 2, 3, 4, 5, 6, 7, 8]],
          msg: 'Status must be between 1 and 8 (1=dostupne, 2=vypujceno, 3=rezervovano, 4=ztraceno, 5=naDotaz, 6=alexandria, 7=poptano, 8=prodano)'
        }
      }
    },
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
    price: Sequelize.NUMBER,  // porizovaci cena hry
    purchasePrice: Sequelize.NUMBER, // cena za kterou se hra pujcuje
    location: DataTypes.STRING,
    message: DataTypes.STRING,
    sellingPrice: Sequelize.NUMBER, // cena za kterou se hra ma prodat v bazaru
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};
