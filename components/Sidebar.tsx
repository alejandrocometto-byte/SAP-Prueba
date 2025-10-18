
import React from 'react';
import { Page } from '../types';
import { LayoutDashboard, BarChart3, UserCircle, Settings } from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-electric-blue text-white rounded-lg'
        : 'text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg'
    }`}
  >
    {icon}
    <span className="ml-4">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-10 px-2">
          <BarChart3 size={32} className="text-electric-blue" />
          <h1 className="text-xl font-bold text-white ml-3">AdminTrack</h1>
        </div>
        <nav className="space-y-2">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Panorama Grupal"
            isActive={currentPage === 'group'}
            onClick={() => onNavigate('group')}
          />
          <NavItem
            icon={<BarChart3 size={20} />}
            label="Análisis Académico"
            isActive={currentPage === 'academic'}
            onClick={() => onNavigate('academic')}
          />
          <NavItem
            icon={<UserCircle size={20} />}
            label="Perfil Individual"
            isActive={currentPage === 'profile'}
            onClick={() => onNavigate('profile')}
          />
        </nav>
      </div>
       <div className="mt-auto">
         <NavItem
            icon={<Settings size={20} />}
            label="Configuración"
            isActive={currentPage === 'admin'}
            onClick={() => onNavigate('admin')}
          />
      </div>
    </aside>
  );
};

export default Sidebar;
