import React, { useState } from 'react';
import { FileText, Plus, Eye, Download, DollarSign, Calendar } from 'lucide-react';
import { Facture, Reparation, Client, Appareil } from '../types';

interface InvoiceManagementProps {
  factures: Facture[];
  reparations: Reparation[];
  clients: Client[];
  appareils: Appareil[];
  onAddFacture: (facture: Facture) => void;
  onUpdateFacture: (facture: Facture) => void;
}

const InvoiceManagement: React.FC<InvoiceManagementProps> = ({
  factures,
  reparations,
  clients,
  appareils,
  onAddFacture,
  onUpdateFacture
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingFacture, setEditingFacture] = useState<Facture | null>(null);
  const [selectedReparation, setSelectedReparation] = useState<string>('');

  const tvaRate = 0.20; // 20% TVA

  const [formData, setFormData] = useState({
    reparationId: '',
    montantHT: 0,
    statutPaiement: 'En attente' as const,
    methodePaiement: ''
  });

  const completedReparations = reparations.filter(r => 
    r.statut === 'Terminé' || r.statut === 'Livré'
  );

  const reparationsWithoutInvoice = completedReparations.filter(r => 
    !factures.some(f => f.reparationId === r.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const montantTVA = formData.montantHT * tvaRate;
    const montantTTC = formData.montantHT + montantTVA;
    
    const factureData: Facture = {
      id: editingFacture?.id || Date.now().toString(),
      numeroFacture: editingFacture?.numeroFacture || `F${Date.now().toString().slice(-6)}`,
      ...formData,
      tva: montantTVA,
      montantTTC: montantTTC,
      dateEmission: editingFacture?.dateEmission || new Date().toISOString(),
      datePaiement: formData.statutPaiement === 'Payé' && !editingFacture?.datePaiement
        ? new Date().toISOString()
        : editingFacture?.datePaiement
    };

    if (editingFacture) {
      onUpdateFacture(factureData);
    } else {
      onAddFacture(factureData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      reparationId: '',
      montantHT: 0,
      statutPaiement: 'En attente',
      methodePaiement: ''
    });
    setShowForm(false);
    setEditingFacture(null);
    setSelectedReparation('');
  };

  const handleEdit = (facture: Facture) => {
    setFormData({
      reparationId: facture.reparationId,
      montantHT: facture.montantHT,
      statutPaiement: facture.statutPaiement,
      methodePaiement: facture.methodePaiement || ''
    });
    setEditingFacture(facture);
    setShowForm(true);
  };

  const handleReparationChange = (reparationId: string) => {
    setFormData(prev => ({ ...prev, reparationId }));
    setSelectedReparation(reparationId);
    
    const reparation = reparations.find(r => r.id === reparationId);
    if (reparation) {
      setFormData(prev => ({
        ...prev,
        montantHT: reparation.coutFinal || reparation.coutEstime
      }));
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Payé': return 'bg-green-100 text-green-800';
      case 'Partiellement payé': return 'bg-blue-100 text-blue-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReparationInfo = (reparationId: string) => {
    const reparation = reparations.find(r => r.id === reparationId);
    if (!reparation) return 'Réparation inconnue';
    
    const client = clients.find(c => c.id === reparation.clientId);
    const appareil = appareils.find(a => a.id === reparation.appareilId);
    
    return {
      client: client ? `${client.prenom} ${client.nom}` : 'Client inconnu',
      appareil: appareil ? `${appareil.marque} ${appareil.modele}` : 'Appareil inconnu',
      description: reparation.categorieProbleme
    };
  };

  const generateInvoicePDF = (facture: Facture) => {
    const reparationInfo = getReparationInfo(facture.reparationId);
    
    // Simulation de génération PDF - dans un vrai projet, utiliser jsPDF ou similaire
    const content = `
FACTURE N° ${facture.numeroFacture}

Date d'émission: ${new Date(facture.dateEmission).toLocaleDateString('fr-FR')}

Client: ${reparationInfo.client}
Appareil: ${reparationInfo.appareil}
Service: ${reparationInfo.description}

Montant HT: ${facture.montantHT.toFixed(2)}€
TVA (20%): ${facture.tva.toFixed(2)}€
Montant TTC: ${facture.montantTTC.toFixed(2)}€

Statut: ${facture.statutPaiement}
${facture.datePaiement ? `Payé le: ${new Date(facture.datePaiement).toLocaleDateString('fr-FR')}` : ''}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture-${facture.numeroFacture}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalRevenues = factures
    .filter(f => f.statutPaiement === 'Payé')
    .reduce((sum, f) => sum + f.montantTTC, 0);

  const unpaidInvoices = factures.filter(f => f.statutPaiement === 'En attente');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Factures</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Nouvelle Facture</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total des revenus</p>
              <p className="text-2xl font-bold text-green-600">{totalRevenues.toFixed(2)}€</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Factures impayées</p>
              <p className="text-2xl font-bold text-red-600">{unpaidInvoices.length}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total factures</p>
              <p className="text-2xl font-bold text-blue-600">{factures.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-green-600" />
            {editingFacture ? 'Modifier la Facture' : 'Nouvelle Facture'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Réparation *
                </label>
                <select
                  required
                  value={formData.reparationId}
                  onChange={(e) => handleReparationChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={!!editingFacture}
                >
                  <option value="">Sélectionner une réparation</option>
                  {(editingFacture ? completedReparations : reparationsWithoutInvoice).map(reparation => {
                    const reparationInfo = getReparationInfo(reparation.id);
                    return (
                      <option key={reparation.id} value={reparation.id}>
                        {reparationInfo.client} - {reparationInfo.appareil} - {reparationInfo.description}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant HT (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.montantHT}
                  onChange={(e) => setFormData(prev => ({ ...prev, montantHT: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TVA (20%)
                </label>
                <input
                  type="text"
                  value={`${(formData.montantHT * tvaRate).toFixed(2)}€`}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant TTC
                </label>
                <input
                  type="text"
                  value={`${(formData.montantHT * (1 + tvaRate)).toFixed(2)}€`}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut de paiement
                </label>
                <select
                  value={formData.statutPaiement}
                  onChange={(e) => setFormData(prev => ({ ...prev, statutPaiement: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="En attente">En attente</option>
                  <option value="Payé">Payé</option>
                  <option value="Partiellement payé">Partiellement payé</option>
                  <option value="Annulé">Annulé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Méthode de paiement
                </label>
                <select
                  value={formData.methodePaiement}
                  onChange={(e) => setFormData(prev => ({ ...prev, methodePaiement: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="Espèces">Espèces</option>
                  <option value="Carte bancaire">Carte bancaire</option>
                  <option value="Chèque">Chèque</option>
                  <option value="Virement">Virement</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                {editingFacture ? 'Mettre à jour' : 'Créer la facture'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Invoices List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Factures ({factures.length})</h2>
        </div>
        <div className="p-6">
          {factures.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune facture créée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {factures.map(facture => {
                const reparationInfo = getReparationInfo(facture.reparationId);
                return (
                  <div key={facture.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Facture {facture.numeroFacture}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {reparationInfo.client} - {reparationInfo.appareil}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(facture.statutPaiement)}`}>
                          {facture.statutPaiement}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {facture.montantTTC.toFixed(2)}€
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">HT:</span> {facture.montantHT.toFixed(2)}€
                      </div>
                      <div>
                        <span className="font-medium">TVA:</span> {facture.tva.toFixed(2)}€
                      </div>
                      <div>
                        <span className="font-medium">Émise le:</span> {new Date(facture.dateEmission).toLocaleDateString('fr-FR')}
                      </div>
                      {facture.datePaiement && (
                        <div>
                          <span className="font-medium">Payée le:</span> {new Date(facture.datePaiement).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                      {facture.methodePaiement && (
                        <div>
                          <span className="font-medium">Paiement:</span> {facture.methodePaiement}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(facture)}
                        className="px-3 py-1 text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4 inline mr-1" />
                        Modifier
                      </button>
                      <button
                        onClick={() => generateInvoicePDF(facture)}
                        className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                      >
                        <Download className="h-4 w-4 inline mr-1" />
                        Télécharger
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagement;