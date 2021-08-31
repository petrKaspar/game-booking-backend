

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line import/no-dynamic-require
const config = require(`${__dirname}/../config/config.js`)[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

fs.readdirSync(__dirname)
  .filter(file => (
    file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  ))
  .forEach((file) => {
    // const model = sequelize.import(path.join(__dirname, file));
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// relationships for models

//= ==============================
// Define all relationships here below
//= ==============================
// db.User.hasMany(db.Address);
// db.Address.belongsTo(db.User);
db.Game.belongsToMany(db.Tag, {
  through: 'TagGame',
});
db.Tag.belongsToMany(db.Game, {
  through: 'TagGame',
});
db.TagGame.belongsTo(db.Game);
db.TagGame.belongsTo(db.Tag);

db.Game.hasMany(db.Borrow);
db.Borrow.belongsTo(db.Game);

db.Game.hasMany(db.Changelog);
db.Changelog.belongsTo(db.Game); // automaticky si to najde sloupec s presnym nazvem `GameId`, musi se vsak v migarci vytvorit

// for automatic call "CREATE TABLE IF NOT EXISTS "TagGame"" GameId in relation 1:N and another things ...
//sequelize.sync();

module.exports = db;
