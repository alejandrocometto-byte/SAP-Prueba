import React, { useState } from 'react';
import { Course, Period, Unit } from '../types';
import EditableList from './EditableList';
import AuthActionModal from './AuthActionModal';
import { AlertTriangle } from 'lucide-react';

interface AdminPanelProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  periods: Period[];
  setPeriods: React.Dispatch<React.SetStateAction<Period[]>>;
  units: Unit[];
  setUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
  onResetData: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  courses,
  setCourses,
  periods,
  setPeriods,
  units,
  setUnits,
  onResetData
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');

  const handleAddItem = <T extends { id: number; name: string }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    name: string
  ) => {
    setter(prev => [...prev, { id: Date.now(), name }]);
  };

  const handleUpdateItem = <T extends { id: number; name: string }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    id: number,
    newName: string
  ) => {
    setter(prev => prev.map(item => item.id === id ? { ...item, name: newName } : item));
  };

  const handleDeleteItem = <T extends { id: number; name: string }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    id: number
  ) => {
    setter(prev => prev.filter(item => item.id !== id));
  };

  const handleResetConfirm = (password: string) => {
    if (password === 'admin123') {
      onResetData();
      setIsModalOpen(false);
      setModalError('');
    } else {
      setModalError('Clave de acceso incorrecta.');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Panel de Administración</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EditableList
          title="Cursos / Grupos"
          items={courses}
          onAddItem={(name) => handleAddItem(setCourses, name)}
          onUpdateItem={(id, name) => handleUpdateItem(setCourses, id, name)}
          onDeleteItem={(id) => handleDeleteItem(setCourses, id)}
        />
        <EditableList
          title="Periodos"
          items={periods}
          onAddItem={(name) => handleAddItem(setPeriods, name)}
          onUpdateItem={(id, name) => handleUpdateItem(setPeriods, id, name)}
          onDeleteItem={(id) => handleDeleteItem(setPeriods, id)}
        />
        <EditableList
          title="Unidades de Estudio"
          items={units}
          onAddItem={(name) => handleAddItem(setUnits, name)}
          onUpdateItem={(id, name) => handleUpdateItem(setUnits, id, name)}
          onDeleteItem={(id) => handleDeleteItem(setUnits, id)}
        />
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-coral-red/50">
        <h3 className="text-xl font-semibold text-coral-red flex items-center mb-4">
          <AlertTriangle className="mr-2" />
          Zona de Peligro
        </h3>
        <p className="text-gray-400 mb-4">
          Esta acción es irreversible. Reiniciará todos los datos de los estudiantes a un estado de prueba.
        </p>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setModalError('');
          }}
          className="px-4 py-2 font-semibold text-white bg-coral-red rounded-lg hover:bg-red-600 transition-colors duration-200"
        >
          Reiniciar Datos de Estudiantes
        </button>
      </div>

      <AuthActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleResetConfirm}
        title="Confirmar Acción"
        description="Para reiniciar los datos, por favor ingrese la clave de acceso de administrador."
        error={modalError}
      />
    </div>
  );
};

export default AdminPanel;
