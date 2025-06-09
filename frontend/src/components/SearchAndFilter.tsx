import React, { useState } from 'react';
import { Search, Filter, User, Smartphone, FileText, Wrench } from 'lucide-react';
import { Client, Reparation, Facture, Appareil, categoriesProblemes } from '../types';

interface SearchAndFilterProps {
  clients: Client[];
  reparations: Reparation[];
  factures: Facture[];
  appareils: Appareil[];
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  clients,
  reparations,
  factures,
  appareils
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateRange, setFilterDateRange] = useState('');

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.prenom} ${client.nom}` : 'Client inconnu';
  };

  const getAppareilInfo = (appareilId: string) => {
    const appareil = appareils.find(a => a.id === appareilId);
    return appareil ? `${appareil.marque} ${appareil.modele}` : 'Appareil inconnu';
  };

  const getReparationInfo = (reparationId: string) => {
    const reparation = reparations.find(r => r.id === reparationId);
    if (!reparation) return null;
    
    return {
      client: getClientName(reparation.clientId),
      appareil: getAppareilInfo(reparation.appareilId),
      description: reparation.categorieProbleme
    };
  };

  const filterByDate = (dateString: string) => {
    if (!filterDateRange) return true;
    
    const date = new Date(dateString);
    const now = new Date();
    
    switch (filterDateRange) {
      case 'today':
        return date.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return date >= monthAgo;
      default:
        return true;
    }
  };

  const searchInText = (text: string, term: string) => {
    return text.toLowerCase().includes(term.toLowerCase());
  };

  // Filter clients
  const filteredClients = clients.filter(client => {
    if (!searchTerm) return true;
    if (searchType !== 'all' && searchType !== 'clients') return false;
    
    return (
      searchInText(client.nom, searchTerm) ||
      searchInText(client.prenom, searchTerm) ||
      searchInText(client.telephone, searchTerm) ||
      searchInText(client.email, searchTerm)
    );
  }).filter(client => filterByDate(client.dateCreation));

  // Filter repairs
  const filteredReparations = reparations.filter(reparation => {
    if (searchType !== 'all' && searchType !== 'reparations') return false;
    
    const matchesSearch = !searchTerm || (
      searchInText(reparation.categorieProbleme, searchTerm) ||
      searchInText(reparation.descriptionProbleme, searchTerm) ||
      searchInText(reparation.technicien, searchTerm) ||
      searchInText(getClientName(reparation.clientId), searchTerm) ||
      searchInText(getAppareilInfo(reparation.appareilId), searchTerm)
    );
    
    const matchesCategory = !filterCategory || reparation.categorieProbleme === filterCategory;
    const matchesStatus = !filterStatus || reparation.statut === filterStatus;
    const matchesDate = filterByDate(reparation.dateCreation);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  // Filter invoices
  const filteredFactures = factures.filter(facture => {
    if (searchType !== 'all' && searchType !== 'factures') return false;
    
    const reparationInfo = getReparationInfo(facture.reparationId);
    
    const matchesSearch = !searchTerm || (
      searchInText(facture.numeroFacture, searchTerm) ||
      searchInText(facture.statutPaiement, searchTerm) ||
      (reparationInfo && searchInText(reparationInfo.client, searchTerm))
    );
    
    const matchesStatus = !filterStatus || facture.statutPaiement === filterStatus;
    const matchesDate = filterByDate(facture.dateEmission);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'Livré': return 'bg-purple-100 text-purple-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      case 'Payé': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalResults = filteredClients.length + filteredReparations.length + filteredFactures.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Recherche & Filtres</h1>
        <div className="text-sm text-gray-600">
          {totalResults} résultat(s) trouvé(s)
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Term */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Search className="inline h-4 w-4 mr-1" />
              Terme de recherche
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nom, téléphone, description..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Search Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de recherche
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tout</option>
              <option value="clients">Clients seulement</option>
              <option value="reparations">Réparations seulement</option>
              <option value="factures">Factures seulement</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter className="inline h-4 w-4 mr-1" />
              Catégorie
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes catégories</option>
              {categoriesProblemes.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous statuts</option>
              <option value="En attente">En attente</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
              <option value="Livré">Livré</option>
              <option value="Payé">Payé</option>
              <option value="Annulé">Annulé</option>
            </select>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Période
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterDateRange(filterDateRange === 'today' ? '' : 'today')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                filterDateRange === 'today' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => setFilterDateRange(filterDateRange === 'week' ? '' : 'week')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                filterDateRange === 'week' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              7 derniers jours
            </button>
            <button
              onClick={() => setFilterDateRange(filterDateRange === 'month' ? '' : 'month')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                filterDateRange === 'month' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              30 derniers jours
            </button>
            {filterDateRange && (
              <button
                onClick={() => setFilterDateRange('')}
                className="px-3 py-2 rounded-lg text-sm bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200"
              >
                Effacer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {/* Clients Results */}
        {(searchType === 'all' || searchType === 'clients') && filteredClients.length > 0 && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Clients ({filteredClients.length})
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map(client => (
                  <div key={client.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {client.prenom} {client.nom}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(client.dateCreation).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{client.telephone}</p>
                      {client.email && <p>{client.email}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Repairs Results */}
        {(searchType === 'all' || searchType === 'reparations') && filteredReparations.length > 0 && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center">
                <Wrench className="h-5 w-5 mr-2 text-orange-600" />
                Réparations ({filteredReparations.length})
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredReparations.map(reparation => (
                  <div key={reparation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-orange-100 p-2 rounded-full">
                          <Wrench className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {reparation.categorieProbleme}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {getClientName(reparation.clientId)} - {getAppareilInfo(reparation.appareilId)}
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
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>Technicien:</strong> {reparation.technicien}</p>
                      <p><strong>Description:</strong> {reparation.descriptionProbleme}</p>
                      <p><strong>Créé le:</strong> {new Date(reparation.dateCreation).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Invoices Results */}
        {(searchType === 'all' || searchType === 'factures') && filteredFactures.length > 0 && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                Factures ({filteredFactures.length})
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredFactures.map(facture => {
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
                            {reparationInfo && (
                              <p className="text-sm text-gray-600">
                                {reparationInfo.client} - {reparationInfo.appareil}
                              </p>
                            )}
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
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">HT:</span> {facture.montantHT.toFixed(2)}€
                        </div>
                        <div>
                          <span className="font-medium">TVA:</span> {facture.tva.toFixed(2)}€
                        </div>
                        <div>
                          <span className="font-medium">Émise le:</span> {new Date(facture.dateEmission).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {totalResults === 0 && (searchTerm || filterCategory || filterStatus || filterDateRange) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun résultat trouvé</p>
              <p className="text-sm">Essayez de modifier vos critères de recherche</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;