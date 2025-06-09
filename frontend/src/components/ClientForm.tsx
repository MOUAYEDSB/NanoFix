import React, { useState } from 'react';
import { Plus, User, Phone, Mail, MapPin, Smartphone } from 'lucide-react';
import { Client, Appareil, marquesTelephones } from '../types';

interface ClientFormProps {
  onAddClient: (client: Client, appareil: Appareil) => void;
  clients: Client[];
}

const ClientForm: React.FC<ClientFormProps> = ({ onAddClient, clients }) => {
  const [showForm, setShowForm] = useState(false);
  const [clientData, setClientData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: ''
  });
  
  const [appareilData, setAppareilData] = useState({
    marque: '',
    modele: '',
    imei: '',
    couleur: '',
    motDePasseEcran: '',
    accessoires: [] as string[]
  });

  const accessoiresList = [
    'Chargeur',
    'Écouteurs',
    'Coque de protection',
    'Protège-écran',
    'Carte SIM',
    'Carte mémoire',
    'Manuel d\'utilisation',
    'Boîte d\'origine'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newClient: Client = {
      id: Date.now().toString(),
      ...clientData,
      dateCreation: new Date().toISOString()
    };

    const newAppareil: Appareil = {
      id: Date.now().toString() + '_appareil',
      clientId: newClient.id,
      ...appareilData
    };

    onAddClient(newClient, newAppareil);
    
    // Reset forms
    setClientData({
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
      adresse: ''
    });
    setAppareilData({
      marque: '',
      modele: '',
      imei: '',
      couleur: '',
      motDePasseEcran: '',
      accessoires: []
    });
    setShowForm(false);
  };

  const handleAccessoireChange = (accessoire: string) => {
    setAppareilData(prev => ({
      ...prev,
      accessoires: prev.accessoires.includes(accessoire)
        ? prev.accessoires.filter(a => a !== accessoire)
        : [...prev.accessoires, accessoire]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Nouveau Client</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Informations Client & Appareil
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">Informations Client</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientData.nom}
                    onChange={(e) => setClientData(prev => ({ ...prev, nom: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientData.prenom}
                    onChange={(e) => setClientData(prev => ({ ...prev, prenom: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientData.telephone}
                    onChange={(e) => setClientData(prev => ({ ...prev, telephone: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Adresse
                  </label>
                  <textarea
                    value={clientData.adresse}
                    onChange={(e) => setClientData(prev => ({ ...prev, adresse: e.target.value }))}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Device Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2 flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Informations Appareil
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marque *
                  </label>
                  <select
                    required
                    value={appareilData.marque}
                    onChange={(e) => setAppareilData(prev => ({ ...prev, marque: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une marque</option>
                    {marquesTelephones.map(marque => (
                      <option key={marque} value={marque}>{marque}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modèle *
                  </label>
                  <input
                    type="text"
                    required
                    value={appareilData.modele}
                    onChange={(e) => setAppareilData(prev => ({ ...prev, modele: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IMEI
                  </label>
                  <input
                    type="text"
                    value={appareilData.imei}
                    onChange={(e) => setAppareilData(prev => ({ ...prev, imei: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Couleur
                  </label>
                  <input
                    type="text"
                    value={appareilData.couleur}
                    onChange={(e) => setAppareilData(prev => ({ ...prev, couleur: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe écran
                  </label>
                  <input
                    type="text"
                    value={appareilData.motDePasseEcran}
                    onChange={(e) => setAppareilData(prev => ({ ...prev, motDePasseEcran: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accessoires fournis
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {accessoiresList.map(accessoire => (
                      <label key={accessoire} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={appareilData.accessoires.includes(accessoire)}
                          onChange={() => handleAccessoireChange(accessoire)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{accessoire}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Enregistrer Client
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Clients List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Clients Enregistrés ({clients.length})</h2>
        </div>
        <div className="p-6">
          {clients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun client enregistré</p>
              <p className="text-sm">Commencez par ajouter votre premier client</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map(client => (
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
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {client.telephone}
                    </p>
                    {client.email && (
                      <p className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {client.email}
                      </p>
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

export default ClientForm;