import React from 'react';
import { Page, Student } from '../types';
import { ChevronDown, Bell, Menu } from 'lucide-react';

interface HeaderProps {
  page: Page;
  students: Student[];
  selectedStudentId: number | null;
  onSelectStudent: (id: number) => void;
  onToggleSidebar: () => void;
}

const pageTitles: Record<Page, string> = {
  group: 'Vista General del Grupo',
  academic: 'Análisis Académico Detallado',
  profile: 'Perfil Individual del Estudiante',
  admin: 'Panel de Administración',
};

const Header: React.FC<HeaderProps> = ({ page, students, selectedStudentId, onSelectStudent, onToggleSidebar }) => {

  return (
    <header className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="md:hidden mr-4 text-gray-300 hover:text-white">
            <Menu size={24} />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold text-white truncate">{pageTitles[page]}</h2>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-6">
        {page === 'profile' && (
           <div className="relative">
             <select
                value={selectedStudentId || ''}
                onChange={(e) => onSelectStudent(Number(e.target.value))}
                className="appearance-none bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-electric-blue focus:border-electric-blue block w-full p-2.5 pr-8"
             >
                <option value="" disabled>Seleccionar estudiante...</option>
                {students.map(student => (
                    <option key={student.id} value={student.id}>{student.name}</option>
                ))}
             </select>
             <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
           </div>
        )}

        <button className="text-gray-400 hover:text-white relative hidden sm:block">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-coral-red rounded-full"></span>
        </button>

        <div className="hidden sm:flex items-center space-x-3">
            <img 
                src="https://i.pravatar.cc/150?u=admin" 
                alt="Admin" 
                className="w-9 h-9 rounded-full"
            />
            <div>
                <p className="text-sm font-medium text-white">Prof. Ana Castillo</p>
                <p className="text-xs text-gray-400">Administrador</p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
