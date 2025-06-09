import React, { useState } from 'react';
import { Plus, Wrench, Clock, AlertCircle, CheckCircle, User, Smartphone } from 'lucide-react';
import { Reparation, Client, Appareil, categoriesProblemes } from '../types';

interface RepairManagementProps {
  reparations: Reparation[];
  clients: Client[];
  appareils: Appareil[];
  onAddReparation: (reparation: Reparation) => void;
  onUpdateReparation: (reparation: Reparation) => void;
}

const RepairManagement: React.FC<RepairManagementProps> = ({
  reparations,
  clients,
  appareils,
  onAddReparation,
  onUpdateReparation
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingReparation, setEditingReparation] = useState<Reparation | null>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    clientId: '',
    appareilId: '',
    categorieProbleme: '',
    descriptionProbleme: '',
    diagnosticTechnicien: '',
    piecesNecessaires: [''],
    coutEstime: 0,
    coutFinal: 0,
    statut: 'En attente' as const,
    priorite: 'Normale' as const,
    technicien: '',
    notes: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reparationData: Reparation = {
      id: editingReparation?.id || Date.now().toString(),
      ...formData,
      piecesNecessaires: formData.piecesNecessaires.filter(p => p.trim() !== ''),
      notes: formData.notes.filter(n => n.trim() !== ''),
      dateCreation: editingReparation?.dateCreation || new Date().toISOString(),
      dateDebutReparation: formData.statut === 'En cours' && !editingReparation?.dateDebutReparation 
        ? new Date().toISOString() 
        : editingReparation?.dateDebutReparation,
      dateFinReparation: formData.statut === 'Terminé' && !editingReparation?.dateFinReparation
        ? new Date().toISOString()
        : editingReparation?.dateFinReparation,
      dateLivraison: formData.statut === 'Livré' && !editingReparation?.dateLivraison
        ? new Date().toISOString()
        : editingReparation?.dateLivraison
    };

    if (editingReparation) {
      onUpdateReparation(reparationData);
    } else {
      onAddReparation(reparationData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      appareilId: '',
      categorieProbleme: '',
      descriptionProbleme: '',
      diagnosticTechnicien: '',
      piecesNecessaires: [''],
      coutEstime: 0,
      coutFinal: 0,
      statut: 'En attente',
      priorite: 'Normale',
      technicien: '',
      notes: ['']
    });
    setShowForm(false);
    setEditingReparation(null);
  };

  const handleEdit = (reparation: Reparation) => {
    setFormData({
      ...reparation,
      piecesNecessaires: reparation.piecesNecessaires.length > 0 ? reparation.piecesNecessaires : [''],
      notes: reparation.notes.length > 0 ? reparation.notes : ['']
    });
    setEditingReparation(reparation);
    setShowForm(true);
  };

  const addArrayField = (field: 'piecesNecessaires' | 'notes') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayField = (field: 'piecesNecessaires' | 'notes', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayField = (field: 'piecesNecessaires' | 'notes', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'Livré': return 'bg-purple-100 text-purple-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case 'Urgente': return 'text-red-600';
      case 'Haute': return 'text-orange-600';
      case 'Normale': return 'text-blue-600';
      case 'Basse': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityIcon = (priorite: string) => {
    switch (priorite) {
      case 'Urgente': return <AlertCircle className="h-4 w-4" />;
      case 'Haute': return <AlertCircle className="h-4 w-4" />;
      case 'Normale': return <Clock className="h-4 w-4" />;
      case 'Basse': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredReparations = reparations.filter(reparation => {
    const matchesCategory = !filterCategory || reparation.categorieProbleme === filterCategory;
    const matchesStatus = !filterStatus || reparation.statut === filterStatus;
    return matchesCategory && matchesStatus;
  });

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.prenom} ${client.nom}` : 'Client inconnu';
  };

  const getAppareilInfo = (appareilId: string) => {
    const appareil = appareils.find(a => a.id === appareilId);
    return appareil ? `${appareil.marque} ${appareil.modele}` : 'Appareil inconnu';
  };

  const clientAppareils = formData.clientId 
    ? appareils.filter(a => a.clientId === formData.clientId)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Réparations</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Nouvelle Réparation</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrer par catégorie
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Toutes les catégories</option>
              {categoriesProblemes.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrer par statut
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="En attente">En attente</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
              <option value="Livré">Livré</option>
              <option value="Annulé">Annulé</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              {filteredReparations.length} réparation(s) trouvée(s)
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-orange-600" />
            {editingReparation ? 'Modifier la Réparation' : 'Nouvelle Réparation'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client *
                </label>
                <select
                  required
                  value={formData.clientId}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value, appareilId: '' }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.prenom} {client.nom} - {client.telephone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appareil *
                </label>
                <select
                  required
                  value={formData.appareilId}
                  onChange={(e) => setFormData(prev => ({ ...prev, appareilId: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={!formData.clientId}
                >
                  <option value="">Sélectionner un appareil</option>
                  {clientAppareils.map(appareil => (
                    <option key={appareil.id} value={appareil.id}>
                      {appareil.marque} {appareil.modele} - {appareil.couleur}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie du problème *
                </label>
                <select
                  required
                  value={formData.categorieProbleme}
                  onChange={(e) => setFormData(prev => ({ ...prev, categorieProbleme: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categoriesProblemes.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technicien *
                </label>
                <input
                  type="text"
                  required
                  value={formData.technicien}
                  onChange={(e) => setFormData(prev => ({ ...prev, technicien: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData(prev => ({ ...prev, statut: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="En attente">En attente</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                  <option value="Livré">Livré</option>
                  <option value="Annulé">Annulé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priorité
                </label>
                <select
                  value={formData.priorite}
                  onChange={(e) => setFormData(prev => ({ ...prev, priorite: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Basse">Basse</option>
                  <option value="Normale">Normale</option>
                  <option value="Haute">Haute</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coût estimé (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.coutEstime}
                  onChange={(e) => setFormData(prev => ({ ...prev, coutEstime: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coût final (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.coutFinal}
                  onChange={(e) => setFormData(prev => ({ ...prev, coutFinal: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description du problème *
              </label>
              <textarea
                required
                value={formData.descriptionProbleme}
                onChange={(e) => setFormData(prev => ({ ...prev, descriptionProbleme: e.target.value }))}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnostic technicien
              </label>
              <textarea
                value={formData.diagnosticTechnicien}
                onChange={(e) => setFormData(prev => ({ ...prev, diagnosticTechnicien: e.target.value }))}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pièces nécessaires
              </label>
              {formData.piecesNecessaires.map((piece, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={piece}
                    onChange={(e) => updateArrayField('piecesNecessaires', index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Nom de la pièce"
                  />
                  {formData.piecesNecessaires.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('piecesNecessaires', index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('piecesNecessaires')}
                className="text-orange-600 hover:text-orange-700 text-sm"
              >
                + Ajouter une pièce
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              {formData.notes.map((note, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => updateArrayField('notes', index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Note"
                  />
                  {formData.notes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('notes', index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('notes')}
                className="text-orange-600 hover:text-orange-700 text-sm"
              >
                + Ajouter une note
              </button>
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
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
              >
                {editingReparation ? 'Mettre à jour' : 'Créer la réparation'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Repairs List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Réparations ({filteredReparations.length})</h2>
        </div>
        <div className="p-6">
          {filteredReparations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune réparation trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReparations.map(reparation => (
                <div key={reparation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getPriorityColor(reparation.priorite)}`}>
                        {getPriorityIcon(reparation.priorite)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {reparation.categorieProbleme}
                        </h3>
                        <p className="text-sm text-gray-600">
                          <User className="inline h-4 w-4 mr-1" />
                          {getClientName(reparation.clientId)} - 
                          <Smartphone className="inline h-4 w-4 ml-2 mr-1" />
                          {getAppareilInfo(reparation.appareilId)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reparation.statut)}`}>
                        {reparation.statut}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {reparation.coutFinal || reparation.coutEstime}€
                      </span>
                      <button
                        onClick={() => handleEdit(reparation)}
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                      >
                        Modifier
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Technicien:</strong> {reparation.technicien}</p>
                    <p><strong>Description:</strong> {reparation.descriptionProbleme}</p>
                    {reparation.diagnosticTechnicien && (
                      <p><strong>Diagnostic:</strong> {reparation.diagnosticTechnicien}</p>
                    )}
                    <p><strong>Créé le:</strong> {new Date(reparation.dateCreation).toLocaleString('fr-FR')}</p>
                    {reparation.piecesNecessaires.length > 0 && (
                      <p><strong>Pièces:</strong> {reparation.piecesNecessaires.join(', ')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepairManagement;