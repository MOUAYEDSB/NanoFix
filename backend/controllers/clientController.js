const { Client, Appareil } = require('../models/clientModel');

// ➕ Ajouter un client + son appareil
exports.createClient = async (req, res) => {
  try {
    const { clientData, appareilData } = req.body;

    const client = await Client.create(clientData);
    const appareil = await Appareil.create({
      ...appareilData,
      clientId: client.id
    });

    res.status(201).json({ client, appareil });
  } catch (error) {
    console.error('Erreur lors de la création:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// 🔄 Lire tous les clients avec appareils
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.findAll({ include: Appareil });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// 🔄 Lire un client par ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, { include: Appareil });
    if (!client) return res.status(404).json({ error: 'Client non trouvé' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ✏️ Modifier un client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client non trouvé' });

    await client.update(req.body);
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ❌ Supprimer un client (et ses appareils via cascade)
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client non trouvé' });

    await client.destroy();
    res.json({ message: 'Client supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
