const { Sequelize } = require('sequelize');

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Borrow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.belongsToMany(models.tag, { through: 'TagGame' });
    }
  }
  Borrow.init({
    status: Sequelize.NUMBER,
    note: DataTypes.STRING,
    userName: DataTypes.STRING,
    userEmail: DataTypes.STRING,
    reservationDate: DataTypes.DATE,
    borrowDate: DataTypes.DATE,
    returnDate: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Borrow',
  });
  return Borrow;
};

/*
ERROR:  relation "Borrows" does not exist at character

z nejakeho duvodu je potreba mit DB vytvorenou s nazvem v mnoznem cisle. Chyba se opreavi prejmenovanim z `await queryInterface.createTable('Borrow', {...` na ...createTable('Borrows', {...` v migracich.
*/

