const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../database.sqlite'),
  logging: false, // Optionnel : désactiver les logs SQL
});

module.exports = sequelize;
