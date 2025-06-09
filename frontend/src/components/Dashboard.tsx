import React from 'react';
import { 
  Users, 
  Wrench, 
  FileText, 
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign
} from 'lucide-react';

interface DashboardProps {
  clients: any[];
  reparations: any[];
  factures: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ clients, reparations, factures }) => {
  const statsCards = [
    {
      title: 'Total Clients',
      value: clients.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Réparations Actives',
      value: reparations.filter(r => ['En attente', 'En cours'].includes(r.statut)).length,
      icon: Wrench,
      color: 'bg-orange-500',
      change: '+8%'
    },
    {
      title: 'Factures Impayées',
      value: factures.filter(f => f.statutPaiement === 'En attente').length,
      icon: FileText,
      color: 'bg-red-500',
      change: '-3%'
    },
    {
      title: 'Revenus du Mois',
      value: `${factures.filter(f => f.statutPaiement === 'Payé').reduce((sum, f) => sum + f.montantTTC, 0).toFixed(2)}€`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+15%'
    }
  ];

  const recentReparations = reparations
    .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
    .slice(0, 5);

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

  const getPriorityIcon = (priorite: string) => {
    switch (priorite) {
      case 'Urgente': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'Haute': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'Normale': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Basse': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-600">
          Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{card.change}</span>
                  </div>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Repairs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-blue-600" />
            Réparations Récentes
          </h2>
          <div className="space-y-4">
            {recentReparations.map((reparation) => (
              <div key={reparation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getPriorityIcon(reparation.priorite)}
                  <div>
                    <p className="font-medium text-gray-900">
                      {reparation.categorieProbleme}
                    </p>
                    <p className="text-sm text-gray-600">
                      {reparation.technicien} - {new Date(reparation.dateCreation).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reparation.statut)}`}>
                    {reparation.statut}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {reparation.coutEstime}€
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Actions Rapides</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-700">Nouveau Client</p>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200 text-center">
              <Wrench className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-orange-700">Nouvelle Réparation</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 text-center">
              <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-700">Nouvelle Facture</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-700">Voir Statistiques</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;