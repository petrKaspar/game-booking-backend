const { Sequelize } = require('sequelize');

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Changelog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.belongsToMany(models.tag, { through: 'TagGame' });
    }
  }
  Changelog.init({
    statusOld: Sequelize.NUMBER,
    statusNew: Sequelize.NUMBER,
    note: DataTypes.STRING,
    userName: DataTypes.STRING,
    userEmail: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Changelog',
  });
  return Changelog;
};
