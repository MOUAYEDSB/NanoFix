const { sequelize, Client, Appareil } = require('./clientModel');  // Ton fichier Client & Appareil
const Repair = require('./repairModel');

// Associer Repair à Client et Appareil
Repair.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
Repair.belongsTo(Appareil, { foreignKey: 'appareilId', as: 'appareil' });

// Pour navigation inverse (pas obligatoire mais utile)
Client.hasMany(Repair, { foreignKey: 'clientId', as: 'repairs' });
Appareil.hasMany(Repair, { foreignKey: 'appareilId', as: 'repairs' });

module.exports = {
  sequelize,
  Client,
  Appareil,
  Repair,
};
