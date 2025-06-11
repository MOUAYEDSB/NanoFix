// controllers/repairController.js
const  Repair   = require('../models/repairModel');
const { Client, Appareil } = require('../models/clientModel');
const { Op } = require('sequelize');

// Debug: Log the Repair model
console.log('Repair model:', Repair);

exports.createRepair = async (req, res) => {
  try {
    const {
      clientId,
      appareilId,
      categorieProbleme,
      descriptionProbleme,
      diagnosticTechnicien,
      piecesNecessaires,
      coutEstime,
      coutFinal,
      statut,
      priorite,
      technicien,
      notes,
    } = req.body;

    // Validate required fields
    if (!clientId || !appareilId || !categorieProbleme || !descriptionProbleme || !technicien) {
      return res.status(400).json({
        error: 'Les champs clientId, appareilId, categorieProbleme, descriptionProbleme et technicien sont requis.',
      });
    }

    // Validate statut and priorite
    const validStatuts = ['En attente', 'En cours', 'Terminé', 'Livré', 'Annulé'];
    const validPriorites = ['Basse', 'Normale', 'Haute', 'Urgente'];
    if (statut && !validStatuts.includes(statut)) {
      return res.status(400).json({ error: `Le statut doit être l'un des suivants : ${validStatuts.join(', ')}` });
    }
    if (priorite && !validPriorites.includes(priorite)) {
      return res.status(400).json({ error: `La priorité doit être l'une des suivantes : ${validPriorites.join(', ')}` });
    }

    // Verify client and appareil exist
    const client = await Client.findByPk(clientId);
    const appareil = await Appareil.findByPk(appareilId);
    if (!client || !appareil) {
      return res.status(404).json({ error: 'Client ou appareil introuvable.' });
    }

    // Verify appareil belongs to client
    if (appareil.clientId !== clientId) {
      return res.status(400).json({ error: "L'appareil n'appartient pas au client spécifié." });
    }

    const repair = await Repair.create({
      clientId,
      appareilId,
      categorieProbleme,
      descriptionProbleme,
      diagnosticTechnicien: diagnosticTechnicien || null,
      piecesNecessaires: Array.isArray(piecesNecessaires) ? piecesNecessaires : [],
      coutEstime: parseFloat(coutEstime) || 0,
      coutFinal: parseFloat(coutFinal) || 0,
      statut: statut || 'En attente',
      priorite: priorite || 'Normale',
      technicien,
      notes: Array.isArray(notes) ? notes : [],
      dateCreation: new Date(),
      dateDebutReparation: statut === 'En cours' ? new Date() : null,
      dateFinReparation: statut === 'Terminé' ? new Date() : null,
      dateLivraison: statut === 'Livré' ? new Date() : null,
    });

    res.status(201).json(repair);
  } catch (error) {
    console.error('Erreur lors de la création de la réparation:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur lors de la création de la réparation.' });
  }
};

exports.getAllRepairs = async (req, res) => {
  try {
    const repairs = await Repair.findAll({
      include: [
        { model: Client, as: 'client' },      // L’alias doit correspondre à l’association
        { model: Appareil, as: 'appareil' }
      ],
    });
    res.json(repairs);
  } catch (error) {
    console.error('Erreur lors de la récupération des réparations:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getRepairById = async (req, res) => {
  try {
    const repair = await Repair.findByPk(req.params.id, {
      include: [
        { model: Client, as: 'client', attributes: ['id', 'prenom', 'nom', 'telephone'] },
        { model: Appareil, as: 'appareil', attributes: ['id', 'marque', 'modele', 'couleur'] },
      ],
    });

    if (!repair) {
      return res.status(404).json({ error: 'Réparation introuvable.' });
    }

    res.json(repair);
  } catch (error) {
    console.error('Erreur lors de la récupération de la réparation:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur lors de la récupération de la réparation.' });
  }
};

exports.updateRepair = async (req, res) => {
  try {
    const repair = await Repair.findByPk(req.params.id);
    if (!repair) {
      return res.status(404).json({ error: 'Réparation introuvable.' });
    }

    const {
      clientId,
      appareilId,
      categorieProbleme,
      descriptionProbleme,
      diagnosticTechnicien,
      piecesNecessaires,
      coutEstime,
      coutFinal,
      statut,
      priorite,
      technicien,
      notes,
    } = req.body;

    // Validate required fields
    if (!clientId || !appareilId || !categorieProbleme || !descriptionProbleme || !technicien) {
      return res.status(400).json({
        error: 'Les champs clientId, appareilId, categorieProbleme, descriptionProbleme et technicien sont requis.',
      });
    }

    // Validate statut and priorite
    const validStatuts = ['En attente', 'En cours', 'Terminé', 'Livré', 'Annulé'];
    const validPriorites = ['Basse', 'Normale', 'Haute', 'Urgente'];
    if (statut && !validStatuts.includes(statut)) {
      return res.status(400).json({ error: `Le statut doit être l'un des suivants : ${validStatuts.join(', ')}` });
    }
    if (priorite && !validPriorites.includes(priorite)) {
      return res.status(400).json({ error: `La priorité doit être l'une des suivantes : ${validPriorites.join(', ')}` });
    }

    // Verify client and appareil exist
    const client = await Client.findByPk(clientId);
    const appareil = await Appareil.findByPk(appareilId);
    if (!client || !appareil) {
      return res.status(404).json({ error: 'Client ou appareil introuvable.' });
    }

    // Verify appareil belongs to client
    if (appareil.clientId !== clientId) {
      return res.status(400).json({ error: "L'appareil n'appartient pas au client spécifié." });
    }

    const updatedData = {
      clientId,
      appareilId,
      categorieProbleme,
      descriptionProbleme,
      diagnosticTechnicien: diagnosticTechnicien || null,
      piecesNecessaires: Array.isArray(piecesNecessaires) ? piecesNecessaires : [],
      coutEstime: parseFloat(coutEstime) || 0,
      coutFinal: parseFloat(coutFinal) || 0,
      statut: statut || repair.statut,
      priorite: priorite || repair.priorite,
      technicien,
      notes: Array.isArray(notes) ? notes : [],
      dateDebutReparation:
        statut === 'En cours' && !repair.dateDebutReparation ? new Date() : repair.dateDebutReparation,
      dateFinReparation: statut === 'Terminé' && !repair.dateFinReparation ? new Date() : repair.dateFinReparation,
      dateLivraison: statut === 'Livré' && !repair.dateLivraison ? new Date() : repair.dateLivraison,
    };

    await repair.update(updatedData);
    res.json(repair);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réparation:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur lors de la mise à jour de la réparation.' });
  }
};

exports.deleteRepair = async (req, res) => {
  try {
    const repair = await Repair.findByPk(req.params.id);
    if (!repair) {
      return res.status(404).json({ error: 'Réparation introuvable.' });
    }

    await repair.destroy();
    res.json({ message: 'Réparation supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réparation:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur lors de la suppression de la réparation.' });
  }
};