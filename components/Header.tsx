
import React from 'react';
import { Search, Bell } from 'lucide-react';

interface HeaderProps {
    courses: string[];
    periods: string[];
}

const Header: React.FC<HeaderProps> = ({ courses, periods }) => {
  const FilterDropdown: React.FC<{ label: string; options: string[] }> = ({ label, options }) => (
    <div className="relative">
      <select className="appearance-none bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-electric-blue focus:border-electric-blue block w-full pl-3 pr-10 py-2.5">
        <option selected>{label}</option>
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  );

  return (
    <header className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center space-x-4">
        <FilterDropdown label="Periodo" options={periods} />
        <FilterDropdown label="Curso/Grupo" options={courses} />
        <FilterDropdown label="Profesor" options={['Prof. Ramirez', 'Prof. Gonzalez']} />
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar estudiante..."
            className="bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-electric-blue"
          />
        </div>
        <button className="p-2 rounded-full hover:bg-gray-700">
          <Bell className="text-gray-400" size={20} />
        </button>
        <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-9 h-9 rounded-full" />
      </div>
    </header>
  );
};

export default Header;
