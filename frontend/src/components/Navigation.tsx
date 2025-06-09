import React from 'react';
import { 
  Home, 
  Users, 
  Wrench, 
  FileText, 
  QrCode, 
  Search,
  Settings,
  TrendingUp
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'reparations', label: 'Réparations', icon: Wrench },
    { id: 'factures', label: 'Factures', icon: FileText },
    { id: 'suivi', label: 'Suivi QR', icon: QrCode },
    { id: 'recherche', label: 'Recherche', icon: Search },
    { id: 'statistiques', label: 'Statistiques', icon: TrendingUp },
    { id: 'parametres', label: 'Paramètres', icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-lg border-r border-gray-200 h-screen w-64 fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">RepairPro</h1>
            <p className="text-sm text-gray-600">Gestion Réparations</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <IconComponent className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;