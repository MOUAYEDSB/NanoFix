import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ClientForm from './components/ClientForm';
import RepairManagement from './components/RepairManagement';
import InvoiceManagement from './components/InvoiceManagement';
import QRTracker from './components/QRTracker';
import SearchAndFilter from './components/SearchAndFilter';
import { Client, Appareil, Reparation, Facture } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [appareils, setAppareils] = useState<Appareil[]>([]);
  const [reparations, setReparations] = useState<Reparation[]>([]);
  const [factures, setFactures] = useState<Facture[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedClients = localStorage.getItem('repairpro_clients');
    const savedAppareils = localStorage.getItem('repairpro_appareils');
    const savedReparations = localStorage.getItem('repairpro_reparations');
    const savedFactures = localStorage.getItem('repairpro_factures');

    if (savedClients) setClients(JSON.parse(savedClients));
    if (savedAppareils) setAppareils(JSON.parse(savedAppareils));
    if (savedReparations) setReparations(JSON.parse(savedReparations));
    if (savedFactures) setFactures(JSON.parse(savedFactures));
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('repairpro_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('repairpro_appareils', JSON.stringify(appareils));
  }, [appareils]);

  useEffect(() => {
    localStorage.setItem('repairpro_reparations', JSON.stringify(reparations));
  }, [reparations]);

  useEffect(() => {
    localStorage.setItem('repairpro_factures', JSON.stringify(factures));
  }, [factures]);

  const handleAddClient = (client: Client, appareil: Appareil) => {
    setClients(prev => [...prev, client]);
    setAppareils(prev => [...prev, appareil]);
  };

  const handleAddReparation = (reparation: Reparation) => {
    setReparations(prev => [...prev, reparation]);
  };

  const handleUpdateReparation = (updatedReparation: Reparation) => {
    setReparations(prev => 
      prev.map(rep => rep.id === updatedReparation.id ? updatedReparation : rep)
    );
  };

  const handleAddFacture = (facture: Facture) => {
    setFactures(prev => [...prev, facture]);
  };

  const handleUpdateFacture = (updatedFacture: Facture) => {
    setFactures(prev => 
      prev.map(fact => fact.id === updatedFacture.id ? updatedFacture : fact)
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            clients={clients}
            reparations={reparations}
            factures={factures}
          />
        );
      case 'clients':
        return (
          <ClientForm 
            onAddClient={handleAddClient}
            clients={clients}
          />
        );
      case 'reparations':
        return (
          <RepairManagement
            reparations={reparations}
            clients={clients}
            appareils={appareils}
            onAddReparation={handleAddReparation}
            onUpdateReparation={handleUpdateReparation}
          />
        );
      case 'factures':
        return (
          <InvoiceManagement
            factures={factures}
            reparations={reparations}
            clients={clients}
            appareils={appareils}
            onAddFacture={handleAddFacture}
            onUpdateFacture={handleUpdateFacture}
          />
        );
      case 'suivi':
        return (
          <QRTracker
            reparations={reparations}
            factures={factures}
            clients={clients}
            appareils={appareils}
          />
        );
      case 'recherche':
        return (
          <SearchAndFilter
            clients={clients}
            reparations={reparations}
            factures={factures}
            appareils={appareils}
          />
        );
      case 'statistiques':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Statistiques</h1>
            <p className="text-gray-600">Module statistiques en développement...</p>
          </div>
        );
      case 'parametres':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Paramètres</h1>
            <p className="text-gray-600">Module paramètres en développement...</p>
          </div>
        );
      default:
        return (
          <Dashboard 
            clients={clients}
            reparations={reparations}
            factures={factures}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="ml-64 p-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;