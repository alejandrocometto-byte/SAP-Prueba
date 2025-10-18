import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import ChartContainer from './ChartContainer';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface AcademicAnalysisProps {
  students: Student[];
  units: string[];
}

const getGradeColor = (grade: number) => {
  if (grade >= 90) return 'bg-lime-green/50';
  if (grade >= 70) return 'bg-lime-green/30';
  if (grade >= 60) return 'bg-yellow-500/30';
  return 'bg-coral-red/40';
};

const AcademicAnalysis: React.FC<AcademicAnalysisProps> = ({ students, units }) => {
  const [selectedUnit, setSelectedUnit] = useState<string>(units[0] || '');

  const performanceData = useMemo(() => {
    return students.map(student => {
      const gradesByUnit = student.grades.reduce((acc, grade) => {
        acc[grade.unit] = grade.grade;
        return acc;
      }, {} as { [key: string]: number });
      return {
        name: student.name,
        ...gradesByUnit,
      };
    });
  }, [students]);
  
  const comparisonData = useMemo(() => {
    if (students.length === 0) return [];
    const historicalAverage = 75; // Mock historical average
    const currentAverage = students.reduce((sum, s) => {
        const unitGrade = s.grades.find(g => g.unit === selectedUnit);
        return sum + (unitGrade?.grade || 0);
    }, 0) / students.length;

    return [
        { name: selectedUnit, 'Promedio Actual': currentAverage, 'Promedio Histórico': historicalAverage }
    ];
  }, [selectedUnit, students]);


  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex items-center space-x-4">
        <label htmlFor="unit-filter" className="font-medium text-white">Unidad de Estudio:</label>
        <select
          id="unit-filter"
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          className="appearance-none bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-electric-blue focus:border-electric-blue block w-full md:w-1/3 p-2.5"
        >
          {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <ChartContainer title="Mapa de Calor de Rendimiento por Unidad">
                <div className="overflow-x-auto h-[500px]">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-700 sticky top-0">
                            <tr>
                                <th scope="col" className="p-3">Estudiante</th>
                                {units.map(unit => <th key={unit} scope="col" className="p-3 text-center">{unit.replace('Unidad ', 'U')}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {performanceData.map((studentData) => (
                                <tr key={studentData.name} className="border-b border-gray-700 hover:bg-gray-700">
                                    <td className="p-3 font-medium text-white whitespace-nowrap">{studentData.name}</td>
                                    {units.map(unit => (
                                        <td key={unit} className={`p-3 text-center font-bold text-white ${getGradeColor(studentData[unit] ?? 0)}`}>
                                            {studentData[unit] ?? 'N/A'}%
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartContainer>
        </div>
        <div className="lg:col-span-1">
             <ChartContainer title="Comparativa de Rendimiento">
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={comparisonData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
                        <XAxis type="number" domain={[0, 100]} stroke="#EAEAEA" />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #2C2C2C' }} />
                        <Legend />
                        <Bar dataKey="Promedio Actual" fill="#007BFF" />
                        <Bar dataKey="Promedio Histórico" fill="#FF6F61" />
                    </BarChart>
                </ResponsiveContainer>
             </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default AcademicAnalysis;