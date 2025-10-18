import React, { useState } from 'react';
import { Student, Course, Period, Unit } from '../types';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import EditableList from './EditableList';

interface AdminPanelProps {
  students: Student[];
  courses: Course[];
  periods: Period[];
  units: Unit[];
  onAddStudent: (student: { name: string }) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: number) => void;
  onAddCourse: (name: string) => void;
  onDeleteCourse: (id: number) => void;
  onAddPeriod: (name: string) => void;
  onDeletePeriod: (id: number) => void;
  onAddUnit: (name: string) => void;
  onUpdateUnit: (id: number, newName: string) => void;
  onDeleteUnit: (id: number) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = (props) => {
    const [newStudentName, setNewStudentName] = useState('');

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (newStudentName.trim()) {
            props.onAddStudent({ name: newStudentName.trim() });
            setNewStudentName('');
        }
    };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <EditableList
          title="Cursos / Grupos"
          items={props.courses}
          onAddItem={props.onAddCourse}
          onDeleteItem={props.onDeleteCourse}
          onUpdateItem={() => {}} // Not implemented for courses
        />
        <EditableList
          title="Períodos de Tiempo"
          items={props.periods}
          onAddItem={props.onAddPeriod}
          onDeleteItem={props.onDeletePeriod}
          onUpdateItem={() => {}} // Not implemented for periods
        />
        <EditableList
          title="Unidades Pedagógicas"
          items={props.units}
          onAddItem={props.onAddUnit}
          onDeleteItem={props.onDeleteUnit}
          onUpdateItem={props.onUpdateUnit}
        />
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Gestionar Alumnos</h2>
        
        <form onSubmit={handleAddStudent} className="flex items-center space-x-4 mb-6">
            <input 
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Nombre del nuevo alumno"
                className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-electric-blue"
            />
            <button type="submit" className="flex items-center justify-center px-4 py-2 font-semibold text-white bg-electric-blue rounded-lg hover:bg-blue-600 transition-colors">
                <PlusCircle size={20} className="mr-2"/>
                Añadir
            </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-gray-700">
              <tr>
                <th scope="col" className="p-4">ID</th>
                <th scope="col" className="p-4">Nombre</th>
                <th scope="col" className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {props.students.map(student => (
                <tr key={student.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="p-4">{student.id}</td>
                  <td className="p-4 font-medium text-white">{student.name}</td>
                  <td className="p-4 flex items-center justify-center space-x-4">
                    <button className="text-gray-400 hover:text-electric-blue" title="Editar - Ir a Perfil Individual">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => props.onDeleteStudent(student.id)} className="text-gray-400 hover:text-coral-red">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;