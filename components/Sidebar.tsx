import React from 'react';
import { Page } from '../types';
import { BarChart3, BookOpen, User, Settings, X } from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  hasSelectedStudent: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}> = ({ icon, label, isActive, onClick, disabled }) => {
  const baseClasses = "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200";
  const activeClasses = "bg-electric-blue text-white";
  const inactiveClasses = "text-gray-400 hover:bg-gray-700 hover:text-white";
  const disabledClasses = "text-gray-600 cursor-not-allowed";

  const getClasses = () => {
    if (disabled) return `${baseClasses} ${disabledClasses}`;
    if (isActive) return `${baseClasses} ${activeClasses}`;
    return `${baseClasses} ${inactiveClasses}`;
  };

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <li>
      <button onClick={handleClick} disabled={disabled} className={`w-full text-left ${getClasses()}`}>
        <span className="mr-3">{icon}</span>
        {label}
      </button>
    </li>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, hasSelectedStudent, isOpen, onClose }) => {
  const handleNavigate = (page: Page) => {
    onNavigate(page);
    onClose();
  };
  
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 p-4 flex flex-col border-r border-gray-700
    transform transition-transform duration-300 ease-in-out
    md:relative md:translate-x-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={onClose}></div>}
      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center">
            <BarChart3 size={32} className="text-electric-blue mr-3" />
            <h1 className="text-xl font-bold text-white">AdminTrack</h1>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X size={24}/>
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            <NavItem
              icon={<BarChart3 size={20} />}
              label="Vista de Grupo"
              isActive={currentPage === 'group'}
              onClick={() => handleNavigate('group')}
            />
            <NavItem
              icon={<BookOpen size={20} />}
              label="Análisis Académico"
              isActive={currentPage === 'academic'}
              onClick={() => handleNavigate('academic')}
            />
            <NavItem
              icon={<User size={20} />}
              label="Perfil del Estudiante"
              isActive={currentPage === 'profile'}
              onClick={() => handleNavigate('profile')}
              disabled={!hasSelectedStudent}
            />
          </ul>
        </nav>
        <div className="mt-auto">
          <ul className="space-y-2">
             <NavItem
              icon={<Settings size={20} />}
              label="Administración"
              isActive={currentPage === 'admin'}
              onClick={() => handleNavigate('admin')}
            />
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
