const { sequelize, Client, Appareil } = require('./clientModel');  // Ton fichier Client & Appareil
const Repair = require('./repairModel');

// Associer Repair à Client et Appareil
Repair.belongsTo(Client, {
  foreignKey: 'clientId',
  as: 'client',
  onDelete: 'CASCADE',
});

Repair.belongsTo(Appareil, {
  foreignKey: 'appareilId',
  as: 'appareil',
  onDelete: 'CASCADE',
});

Client.hasMany(Repair, {
  foreignKey: 'clientId',
  as: 'repairs',
  onDelete: 'CASCADE',
});

Appareil.hasMany(Repair, {
  foreignKey: 'appareilId',
  as: 'repairs',
  onDelete: 'CASCADE',
});

module.exports = {
  sequelize,
  Client,
  Appareil,
  Repair,
};
