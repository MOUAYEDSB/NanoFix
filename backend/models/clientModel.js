const { DataTypes } = require('sequelize');
const path = require('path');

const sequelize = require('../data/database');


const Client = sequelize.define('Client', {
  nom: { type: DataTypes.STRING, allowNull: false },
  prenom: { type: DataTypes.STRING, allowNull: false },
  telephone: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  adresse: DataTypes.STRING,
}, { timestamps: true });

const Appareil = sequelize.define('Appareil', {
  marque: DataTypes.STRING,
  modele: DataTypes.STRING,
  imei: DataTypes.STRING,
  couleur: DataTypes.STRING,
  motDePasseEcran: DataTypes.STRING,
  accessoires: {
    type: DataTypes.TEXT,
    get() {
      const val = this.getDataValue('accessoires');
      return val ? val.split(';').filter(x => x.trim()) : [];
    },
    set(val) {
      this.setDataValue('accessoires', Array.isArray(val) ? val.join(';') : '');
    }
  }
}, { timestamps: true });

// Relations
Client.hasMany(Appareil, { foreignKey: 'clientId', onDelete: 'CASCADE' });
Appareil.belongsTo(Client, { foreignKey: 'clientId' });

sequelize.sync(); // Synchronisation

module.exports = { sequelize, Client, Appareil };
