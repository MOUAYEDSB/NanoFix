const { DataTypes } = require('sequelize');
const sequelize = require('../data/database');

const Repair = sequelize.define('Repair', {
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  appareilId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categorieProbleme: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descriptionProbleme: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  diagnosticTechnicien: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  piecesNecessaires: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
    get() {
      const value = this.getDataValue('piecesNecessaires');
      return value ? value.split(';').filter((p) => p.trim() !== '') : [];
    },
    set(val) {
      this.setDataValue('piecesNecessaires', Array.isArray(val) ? val.join(';') : '');
    },
  },
  coutEstime: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  coutFinal: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  statut: {
    type: DataTypes.ENUM('En attente', 'En cours', 'Terminé', 'Livré', 'Annulé'),
    allowNull: false,
    defaultValue: 'En attente',
  },
  priorite: {
    type: DataTypes.ENUM('Basse', 'Normale', 'Haute', 'Urgente'),
    allowNull: false,
    defaultValue: 'Normale',
  },
  technicien: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
    get() {
      const value = this.getDataValue('notes');
      return value ? value.split(';').filter((n) => n.trim() !== '') : [];
    },
    set(val) {
      this.setDataValue('notes', Array.isArray(val) ? val.join(';') : '');
    },
  },
  dateCreation: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  dateDebutReparation: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dateFinReparation: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dateLivraison: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'Repairs',
  timestamps: false,
});

module.exports = Repair;
