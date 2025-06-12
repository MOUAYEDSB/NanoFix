// invoiceModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../data/database');  // chemin relatif selon ton projet
const Repair = require('./repairModel');   

const Invoice = sequelize.define('Invoice', {
  repairId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Une réparation a une seule facture
  },
  montant: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  dateEmission: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  statutPaiement: {
    type: DataTypes.ENUM('En attente', 'Payée', 'Annulée'),
    allowNull: false,
    defaultValue: 'En attente',
  },
  modePaiement: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'Invoices',
  timestamps: true,
});

// Association 1:1 entre Invoice et Repair
Invoice.belongsTo(Repair, { foreignKey: 'repairId', as: 'repair' });
Repair.hasOne(Invoice, { foreignKey: 'repairId', as: 'invoice' });

module.exports = Invoice;
