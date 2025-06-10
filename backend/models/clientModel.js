const { Sequelize, DataTypes } = require('sequelize');

// Connexion SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: false
});

// Modèle Client
const Client = sequelize.define('Client', {
  nom: DataTypes.STRING,
  prenom: DataTypes.STRING,
  telephone: DataTypes.STRING,
  email: DataTypes.STRING,
  adresse: DataTypes.STRING,
  dateCreation: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
});

// Modèle Appareil
const Appareil = sequelize.define('Appareil', {
  marque: DataTypes.STRING,
  modele: DataTypes.STRING,
  imei: DataTypes.STRING,
  couleur: DataTypes.STRING,
  motDePasseEcran: DataTypes.STRING,
  accessoires: {
    type: DataTypes.TEXT,
    get() {
      return this.getDataValue('accessoires')?.split(';') || [];
    },
    set(val) {
      this.setDataValue('accessoires', val.join(';'));
    }
  }
});

// Relation Client → Appareils
Client.hasMany(Appareil, { foreignKey: 'clientId', onDelete: 'CASCADE' });
Appareil.belongsTo(Client, { foreignKey: 'clientId' });

sequelize.sync(); // Création automatique si pas déjà présent

module.exports = { sequelize, Client, Appareil };
