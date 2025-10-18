import React, { useState } from 'react';
import { Course, Period, Unit, Student } from '../types';
import EditableList from './EditableList';
import { AlertTriangle, UserPlus, Edit, Trash2, Check, X } from 'lucide-react';

interface AdminPanelProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  periods: Period[];
  setPeriods: React.Dispatch<React.SetStateAction<Period[]>>;
  units: Unit[];
  onAddUnit: (name: string) => void;
  onUpdateUnit: (id: number, newName: string) => void;
  onDeleteUnit: (id: number) => void;
  onResetData: () => void;
  requestAuth: (action: () => void) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  students,
  setStudents,
  courses,
  setCourses,
  periods,
  setPeriods,
  units,
  onAddUnit,
  onUpdateUnit,
  onDeleteUnit,
  onResetData,
  requestAuth
}) => {
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [editingStudentName, setEditingStudentName] = useState('');

  const handleAddItem = <T extends { id: number; name: string }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    name: string
  ) => {
    setter(prev => [...prev, { id: Date.now(), name } as T]);
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
  
  const handleUpdateStudentName = () => {
    if (editingStudentId && editingStudentName.trim()) {
       requestAuth(() => {
          setStudents(prev => prev.map(s => s.id === editingStudentId ? { ...s, name: editingStudentName.trim() } : s));
          setEditingStudentId(null);
          setEditingStudentName('');
       });
    }
  };
  
  const handleDeleteStudent = (id: number) => {
      requestAuth(() => {
          setStudents(prev => prev.filter(s => s.id !== id));
      });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Panel de Administración</h2>

      <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Gestionar Alumnos</h3>
        <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-700 sticky top-0">
                    <tr>
                        <th scope="col" className="p-3">ID</th>
                        <th scope="col" className="p-3">Nombre</th>
                        <th scope="col" className="p-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id} className="border-b border-gray-700">
                            <td className="p-3">{student.id}</td>
                            <td className="p-3">
                                {editingStudentId === student.id ? (
                                    <input type="text" value={editingStudentName} onChange={(e) => setEditingStudentName(e.target.value)}
                                           className="bg-gray-600 text-white rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-electric-blue" autoFocus/>
                                ) : (
                                    student.name
                                )}
                            </td>
                            <td className="p-3 text-right">
                                <div className="flex items-center justify-end space-x-3">
                                {editingStudentId === student.id ? (
                                    <>
                                        <button onClick={handleUpdateStudentName} className="text-lime-green hover:text-green-400"><Check size={18} /></button>
                                        <button onClick={() => setEditingStudentId(null)} className="text-gray-400 hover:text-white"><X size={18} /></button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => { setEditingStudentId(student.id); setEditingStudentName(student.name); }} className="text-gray-400 hover:text-white"><Edit size={16} /></button>
                                        <button onClick={() => handleDeleteStudent(student.id)} className="text-coral-red hover:text-red-400"><Trash2 size={16} /></button>
                                    </>
                                )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EditableList
          title="Cursos / Grupos"
          items={courses}
          onAddItem={(name) => requestAuth(() => handleAddItem(setCourses, name))}
          onUpdateItem={(id, name) => requestAuth(() => handleUpdateItem(setCourses, id, name))}
          onDeleteItem={(id) => requestAuth(() => handleDeleteItem(setCourses, id))}
          requestAuth={requestAuth}
        />
        <EditableList
          title="Periodos"
          items={periods}
          onAddItem={(name) => requestAuth(() => handleAddItem(setPeriods, name))}
          onUpdateItem={(id, name) => requestAuth(() => handleUpdateItem(setPeriods, id, name))}
          onDeleteItem={(id) => requestAuth(() => handleDeleteItem(setPeriods, id))}
          requestAuth={requestAuth}
        />
        <EditableList
          title="Unidades de Estudio"
          items={units}
          onAddItem={(name) => requestAuth(() => onAddUnit(name))}
          onUpdateItem={(id, name) => requestAuth(() => onUpdateUnit(id, name))}
          onDeleteItem={(id) => requestAuth(() => onDeleteUnit(id))}
          requestAuth={requestAuth}
        />
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-coral-red/50">
        <h3 className="text-xl font-semibold text-coral-red flex items-center mb-4">
          <AlertTriangle className="mr-2" />
          Zona de Peligro
        </h3>
        <p className="text-gray-400 mb-4">
          Esta acción es irreversible. Reiniciará todos los datos a un estado de prueba.
        </p>
        <button
          onClick={() => requestAuth(onResetData)}
          className="px-4 py-2 font-semibold text-white bg-coral-red rounded-lg hover:bg-red-600 transition-colors duration-200"
        >
          Reiniciar Todos los Datos
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
