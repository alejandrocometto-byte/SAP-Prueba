
import React, { useMemo } from 'react';
import { Student } from '../types';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StudentRiskTableProps {
  students: Student[];
  onSelectStudent: (studentId: number) => void;
}

const getAverageGrade = (student: Student) => {
  const total = student.grades.reduce((sum, g) => sum + g.grade, 0);
  return student.grades.length > 0 ? total / student.grades.length : 0;
};

const StatusIndicator: React.FC<{ average: number }> = ({ average }) => {
  const color = average >= 70 ? 'bg-lime-green' : average >= 60 ? 'bg-yellow-500' : 'bg-coral-red';
  return <span className={`w-3 h-3 rounded-full inline-block ${color}`}></span>;
};

const StudentRow: React.FC<{student: Student, onSelect: (id: number) => void}> = ({ student, onSelect }) => {
  const average = getAverageGrade(student);
  return (
    <tr
      className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
      onClick={() => onSelect(student.id)}
    >
      <td className="p-4 flex items-center">
        <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full mr-3" />
        <span className="font-medium text-white">{student.name}</span>
      </td>
      <td className="p-4 text-center">{average.toFixed(1)}%</td>
      <td className="p-4 text-center">{student.attendance}%</td>
      <td className="p-4 text-center"><StatusIndicator average={average} /></td>
    </tr>
  );
};

const StudentRiskTable: React.FC<StudentRiskTableProps> = ({ students, onSelectStudent }) => {
  const { topStudents, bottomStudents } = useMemo(() => {
    const sortedStudents = [...students].sort((a, b) => getAverageGrade(b) - getAverageGrade(a));
    return {
      topStudents: sortedStudents.slice(0, 5),
      bottomStudents: sortedStudents.slice(-5).reverse(),
    };
  }, [students]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center"><ArrowUp className="text-lime-green mr-2"/>Mejor Rendimiento</h3>
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="p-4">Estudiante</th>
              <th scope="col" className="p-4 text-center">Promedio</th>
              <th scope="col" className="p-4 text-center">Asistencia</th>
              <th scope="col" className="p-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {topStudents.map(student => <StudentRow key={student.id} student={student} onSelect={onSelectStudent} />)}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center"><ArrowDown className="text-coral-red mr-2"/>Rendimiento a Mejorar</h3>
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="p-4">Estudiante</th>
              <th scope="col" className="p-4 text-center">Promedio</th>
              <th scope="col" className="p-4 text-center">Asistencia</th>
              <th scope="col" className="p-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {bottomStudents.map(student => <StudentRow key={student.id} student={student} onSelect={onSelectStudent} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentRiskTable;
