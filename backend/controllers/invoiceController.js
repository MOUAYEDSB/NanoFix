// invoiceController.js
const Invoice = require('../models/invoiceModel');
const Repair = require('../models/repairModel');

exports.createInvoice = async (req, res) => {
  try {
    const { repairId, montant, dateEmission, statutPaiement, modePaiement, notes } = req.body;

    // Vérifier si la réparation existe
    const repair = await Repair.findByPk(repairId);
    if (!repair) return res.status(404).json({ message: 'Réparation non trouvée' });

    // Vérifier si la facture existe déjà pour cette réparation
    const existingInvoice = await Invoice.findOne({ where: { repairId } });
    if (existingInvoice) return res.status(400).json({ message: 'Facture déjà existante pour cette réparation' });

    const invoice = await Invoice.create({
      repairId,
      montant,
      dateEmission,
      statutPaiement,
      modePaiement,
      notes,
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de la facture' });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: [{ model: Repair, as: 'repair' }]
    });
    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des factures' });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [{ model: Repair, as: 'repair' }]
    });
    if (!invoice) return res.status(404).json({ message: 'Facture non trouvée' });
    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la facture' });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Facture non trouvée' });

    await invoice.update(req.body);
    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la facture' });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Facture non trouvée' });

    await invoice.destroy();
    res.json({ message: 'Facture supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la facture' });
  }
};
