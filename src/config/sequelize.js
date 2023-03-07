const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];


// const sequelize = new Sequelize(
//   process.env.DB_NAME || config.database,
//   process.env.DB_USER || config.username,
//   process.env.DB_PASS || config.password,
//   {
//     host: '127.0.0.1',
//     port: 5433,
//     dialect: process.env.DB_DIALECT || config.dialect,

//   },
// );

sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
}
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
