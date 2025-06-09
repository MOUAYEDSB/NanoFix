import React, { useState, useEffect } from 'react';
import { QrCode, Search, Eye, Download } from 'lucide-react';
import QRCode from 'qrcode';
import { Reparation, Facture, Client, Appareil } from '../types';

interface QRTrackerProps {
  reparations: Reparation[];
  factures: Facture[];
  clients: Client[];
  appareils: Appareil[];
}

const QRTracker: React.FC<QRTrackerProps> = ({
  reparations,
  factures,
  clients,
  appareils
}) => {
  const [searchId, setSearchId] = useState('');
  const [foundItem, setFoundItem] = useState<any>(null);
  const [itemType, setItemType] = useState<'reparation' | 'facture' | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const generateQRCode = async (data: string) => {
    try {
      const url = await QRCode.toDataURL(data, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });
      setQrDataUrl(url);
    } catch (error) {
      console.error('Erreur génération QR code:', error);
    }
  };

  const handleSearch = () => {
    if (!searchId.trim()) {
      setFoundItem(null);
      setItemType(null);
      setQrDataUrl('');
      return;
    }

    // Recherche dans les réparations
    const reparation = reparations.find(r => r.id === searchId);
    if (reparation) {
      setFoundItem(reparation);
      setItemType('reparation');
      
      const trackingData = {
        type: 'reparation',
        id: reparation.id,
        url: `${window.location.origin}/tracking/repair/${reparation.id}`
      };
      
      generateQRCode(JSON.stringify(trackingData));
      return;
    }

    // Recherche dans les factures
    const facture = factures.find(f => f.id === searchId || f.numeroFacture === searchId);
    if (facture) {
      setFoundItem(facture);
      setItemType('facture');
      
      const trackingData = {
        type: 'facture',
        id: facture.id,
        numero: facture.numeroFacture,
        url: `${window.location.origin}/tracking/invoice/${facture.id}`
      };
      
      generateQRCode(JSON.stringify(trackingData));
      return;
    }

    // Rien trouvé
    setFoundItem(null);
    setItemType(null);
    setQrDataUrl('');
  };

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

  const downloadQRCode = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `qr-code-${itemType}-${foundItem?.id || 'unknown'}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const generateAllQRCodes = () => {
    // Dans un vrai projet, ceci générerait tous les QR codes
    alert('Génération en lot des QR codes pour toutes les réparations et factures...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Suivi par QR Code</h1>
        <button
          onClick={generateAllQRCodes}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <QrCode className="h-5 w-5" />
          <span>Générer tous les QR</span>
        </button>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Search className="h-5 w-5 mr-2 text-purple-600" />
          Rechercher et Générer QR Code
        </h2>
        
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID de réparation ou numéro de facture
            </label>
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Entrez l'ID ou le numéro..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span>Rechercher</span>
          </button>
        </div>
      </div>

      {/* Results Section */}
      {foundItem && itemType && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Item Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-blue-600" />
              Détails {itemType === 'reparation' ? 'Réparation' : 'Facture'}
            </h2>
            
            {itemType === 'reparation' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{foundItem.categorieProbleme}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(foundItem.statut)}`}>
                    {foundItem.statut}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Client:</span>
                    <p>{getClientName(foundItem.clientId)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Appareil:</span>
                    <p>{getAppareilInfo(foundItem.appareilId)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Technicien:</span>
                    <p>{foundItem.technicien}</p>
                  </div>
                  <div>
                    <span className="font-medium">Priorité:</span>
                    <p>{foundItem.priorite}</p>
                  </div>
                  <div>
                    <span className="font-medium">Coût:</span>
                    <p>{foundItem.coutFinal || foundItem.coutEstime}€</p>
                  </div>
                  <div>
                    <span className="font-medium">Créé le:</span>
                    <p>{new Date(foundItem.dateCreation).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-sm text-gray-600">Description:</span>
                  <p className="text-sm text-gray-800 mt-1">{foundItem.descriptionProbleme}</p>
                </div>

                {foundItem.diagnosticTechnicien && (
                  <div>
                    <span className="font-medium text-sm text-gray-600">Diagnostic:</span>
                    <p className="text-sm text-gray-800 mt-1">{foundItem.diagnosticTechnicien}</p>
                  </div>
                )}

                {foundItem.piecesNecessaires.length > 0 && (
                  <div>
                    <span className="font-medium text-sm text-gray-600">Pièces:</span>
                    <p className="text-sm text-gray-800 mt-1">{foundItem.piecesNecessaires.join(', ')}</p>
                  </div>
                )}

                {/* Timeline */}
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Chronologie</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Créé le {new Date(foundItem.dateCreation).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {foundItem.dateDebutReparation && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Démarré le {new Date(foundItem.dateDebutReparation).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                    {foundItem.dateFinReparation && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Terminé le {new Date(foundItem.dateFinReparation).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                    {foundItem.dateLivraison && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Livré le {new Date(foundItem.dateLivraison).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {itemType === 'facture' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Facture {foundItem.numeroFacture}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(foundItem.statutPaiement)}`}>
                    {foundItem.statutPaiement}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Montant HT:</span>
                    <p>{foundItem.montantHT.toFixed(2)}€</p>
                  </div>
                  <div>
                    <span className="font-medium">TVA:</span>
                    <p>{foundItem.tva.toFixed(2)}€</p>
                  </div>
                  <div>
                    <span className="font-medium">Montant TTC:</span>
                    <p className="text-lg font-bold text-gray-900">{foundItem.montantTTC.toFixed(2)}€</p>
                  </div>
                  <div>
                    <span className="font-medium">Émise le:</span>
                    <p>{new Date(foundItem.dateEmission).toLocaleDateString('fr-FR')}</p>
                  </div>
                  {foundItem.datePaiement && (
                    <div>
                      <span className="font-medium">Payée le:</span>
                      <p>{new Date(foundItem.datePaiement).toLocaleDateString('fr-FR')}</p>
                    </div>
                  )}
                  {foundItem.methodePaiement && (
                    <div>
                      <span className="font-medium">Méthode:</span>
                      <p>{foundItem.methodePaiement}</p>
                    </div>
                  )}
                </div>

                {/* Réparation associée */}
                {(() => {
                  const reparationInfo = getReparationInfo(foundItem.reparationId);
                  return reparationInfo && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium text-gray-900 mb-2">Réparation associée</h4>
                      <div className="text-sm text-gray-600">
                        <p><strong>Client:</strong> {reparationInfo.client}</p>
                        <p><strong>Appareil:</strong> {reparationInfo.appareil}</p>
                        <p><strong>Service:</strong> {reparationInfo.description}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <QrCode className="h-5 w-5 mr-2 text-purple-600" />
              QR Code de Suivi
            </h2>
            
            {qrDataUrl && (
              <div className="text-center">
                <div className="inline-block p-4 bg-gray-50 rounded-lg mb-4">
                  <img src={qrDataUrl} alt="QR Code" className="mx-auto" />
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Scannez ce QR code pour accéder aux informations de suivi
                </p>
                
                <div className="space-y-2">
                  <button
                    onClick={downloadQRCode}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Télécharger QR Code</span>
                  </button>
                  
                  <p className="text-xs text-gray-500">
                    Format PNG - 256x256 pixels
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchId && !foundItem && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun résultat trouvé pour "{searchId}"</p>
            <p className="text-sm">Vérifiez l'ID de réparation ou le numéro de facture</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 mb-2">Instructions d'utilisation</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Entrez l'ID d'une réparation ou le numéro d'une facture pour générer son QR code</li>
          <li>• Le QR code contient un lien vers une page de suivi détaillée</li>
          <li>• Vous pouvez télécharger le QR code pour l'imprimer ou l'envoyer au client</li>
          <li>• Les clients peuvent scanner le code avec leur téléphone pour suivre l'avancement</li>
          <li>• Utilisez "Générer tous les QR" pour créer les codes de tous les éléments en une fois</li>
        </ul>
      </div>
    </div>
  );
};

export default QRTracker;