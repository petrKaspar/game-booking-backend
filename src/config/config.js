require('dotenv').config();

const x = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'gamebooking',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5433,
    dialect: process.env.DB_DIALECT || 'postgres',
    emailOptions: {
      user: process.env.EMAIL_USER || 'petr2kaspar@gmail.com',
      pass: process.env.EMAIL_PASS,
      to: process.env.EMAIL_TO || 'pkaspar1@seznam.cz',
    },
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    emailOptions: {
      user: process.env.EMAIL_USER || 'petr2kaspar@gmail.com',
      pass: process.env.EMAIL_PASS,
      to: process.env.EMAIL_TO || 'pkaspar1@seznam.cz',
    },
  },
};
module.exports = x;
