const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const repairRoutes = require('./routes/repairRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/repair', repairRoutes);
app.use('/api/invoices', invoiceRoutes);

// Synchronisation de la base et démarrage du serveur
sequelize.sync().then(() => {
  console.log('Base de données synchronisée avec succès.');

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
  });
}).catch(err => {
  console.error("Erreur lors de la synchronisation de la base :", err);
});
