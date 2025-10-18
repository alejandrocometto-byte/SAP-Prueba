import React, { useMemo, useState, useEffect } from 'react';
import { Student } from '../types';
import DashboardCard from './DashboardCard';
import ChartContainer from './ChartContainer';
import { TrendingUp, UserCheck, Activity, Users, Edit, X, Save } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

interface StudentProfileProps {
  students: Student[];
  selectedStudentId: number | null;
  setSelectedStudentId: (id: number | null) => void;
  onUpdateStudent: (student: Student) => void;
}

const getAverage = (arr: number[]) => arr.length > 0 ? arr.reduce((acc, val) => acc + val, 0) / arr.length : 0;

const StudentProfile: React.FC<StudentProfileProps> = ({ students, selectedStudentId, setSelectedStudentId, onUpdateStudent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student | null>(null);

  const student = useMemo(() => students.find(s => s.id === selectedStudentId), [students, selectedStudentId]);

  useEffect(() => {
    if (student) {
      // Create a deep copy for editing to avoid mutating original state
      setEditedStudent(JSON.parse(JSON.stringify(student)));
    } else {
      setEditedStudent(null);
    }
    setIsEditing(false); // Reset editing mode when student changes
  }, [student]);

  const { classAverage, studentAverage, behaviorData, progressData } = useMemo(() => {
    const allGrades = students.flatMap(s => s.grades.map(g => g.grade));
    const classAvg = getAverage(allGrades);

    if (!student) return { classAverage: classAvg, studentAverage: 0, behaviorData: [], progressData: [] };

    const studentAvg = getAverage(student.grades.map(g => g.grade));
    
    const currentData = isEditing ? editedStudent : student;

    const behaviorData = [
      { subject: 'Participación', A: currentData.behavior.participation, fullMark: 5 },
      { subject: 'Puntualidad', A: currentData.behavior.punctuality, fullMark: 5 },
      { subject: 'Iniciativa', A: currentData.behavior.initiative, fullMark: 5 },
      { subject: 'Colaboración', A: currentData.behavior.collaboration, fullMark: 5 },
      { subject: 'Asistencia', A: currentData.behavior.attendanceCompliance, fullMark: 5 },
    ];

    const progressData = currentData.grades.map(g => ({
      name: g.unit.replace('Unidad ', 'U'),
      nota: g.grade,
    }));
    
    return { classAverage: classAvg, studentAverage: studentAvg, behaviorData, progressData };
  }, [students, student, isEditing, editedStudent]);
  
  const handleSave = () => {
    if (editedStudent) {
        onUpdateStudent(editedStudent);
        setIsEditing(false);
    }
  };

  const handleCancel = () => {
     if (student) setEditedStudent(JSON.parse(JSON.stringify(student)));
     setIsEditing(false);
  };

  const handleBehaviorChange = (field: keyof Student['behavior'], value: string) => {
    const numValue = parseInt(value, 10);
    if (editedStudent && !isNaN(numValue) && numValue >= 0 && numValue <= 5) {
        setEditedStudent({
            ...editedStudent,
            behavior: {
                ...editedStudent.behavior,
                [field]: numValue
            }
        });
    }
  };

  const handleGradeChange = (unitName: string, value: string) => {
    const numValue = parseInt(value, 10);
     if (editedStudent && !isNaN(numValue) && numValue >= 0 && numValue <= 100) {
        setEditedStudent({
            ...editedStudent,
            grades: editedStudent.grades.map(g => g.unit === unitName ? {...g, grade: numValue} : g)
        })
     }
  };

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center bg-gray-800 rounded-xl p-8">
        <UserCheck size={64} className="text-gray-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Seleccione un Estudiante</h2>
        <p className="text-gray-400">Elija un estudiante para ver su perfil detallado.</p>
        <select
          onChange={(e) => setSelectedStudentId(parseInt(e.target.value))}
          className="mt-6 appearance-none bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-electric-blue focus:border-electric-blue block w-full max-w-xs p-2.5"
        >
          <option>Elegir de la lista...</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-800 p-4 rounded-xl shadow-lg">
            <div className="flex items-center space-x-4">
                <img src={student.avatar} alt={student.name} className="w-20 h-20 rounded-full" />
                <div>
                <h2 className="text-3xl font-bold text-white">{student.name}</h2>
                <select
                    value={selectedStudentId ?? ''}
                    onChange={(e) => setSelectedStudentId(parseInt(e.target.value))}
                    className="mt-1 text-sm bg-transparent text-gray-400 hover:text-white focus:outline-none"
                >
                    {students.map(s => <option key={s.id} value={s.id} className="bg-gray-800 text-white">{s.name}</option>)}
                </select>
                </div>
            </div>
            {isEditing ? (
                 <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <button onClick={handleSave} className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-lime-green rounded-lg hover:bg-green-600 transition-colors"><Save size={16} className="mr-2"/>Guardar</button>
                    <button onClick={handleCancel} className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-coral-red rounded-lg hover:bg-red-600 transition-colors"><X size={16} className="mr-2"/>Cancelar</button>
                 </div>
            ) : (
                <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-electric-blue rounded-lg hover:bg-blue-600 transition-colors mt-4 md:mt-0"><Edit size={16} className="mr-2"/>Modo Edición</button>
            )}
        </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Promedio del Alumno" value={`${studentAverage.toFixed(1)}%`} icon={<TrendingUp />} colorClass="bg-electric-blue" />
        <DashboardCard title="Promedio de la Clase" value={`${classAverage.toFixed(1)}%`} icon={<Users />} colorClass="bg-lime-green" />
        <DashboardCard title="Asistencia del Alumno" value={`${student.attendance}%`} icon={<Activity />} colorClass="bg-coral-red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Variables de Comportamiento">
            {isEditing && editedStudent ? (
                <div className="space-y-3 p-4">
                    {behaviorData.map(b => (
                        <div key={b.subject} className="flex items-center justify-between">
                            <label className="text-gray-300 font-medium">{b.subject}</label>
                            <input 
                                type="number" 
                                min="0" 
                                max="5" 
                                value={editedStudent.behavior[b.subject.toLowerCase() as keyof Student['behavior']]}
                                onChange={(e) => handleBehaviorChange(b.subject.toLowerCase() as keyof Student['behavior'], e.target.value)}
                                className="bg-gray-700 text-white w-20 text-center rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-electric-blue"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={behaviorData}>
                    <PolarGrid stroke="#3A3A3A" />
                    <PolarAngleAxis dataKey="subject" stroke="#EAEAEA" />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                    <Radar name={student.name} dataKey="A" stroke="#007BFF" fill="#007BFF" fillOpacity={0.6} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #2C2C2C' }} />
                    </RadarChart>
                </ResponsiveContainer>
            )}
        </ChartContainer>
        <ChartContainer title="Progreso Académico por Unidad">
          {isEditing && editedStudent ? (
             <div className="space-y-3 p-4 overflow-y-auto max-h-[250px]">
                {editedStudent.grades.map(g => (
                    <div key={g.unit} className="flex items-center justify-between">
                        <label className="text-gray-300 font-medium truncate pr-4">{g.unit}</label>
                        <input 
                            type="number" 
                            min="0" 
                            max="100"
                            value={g.grade}
                            onChange={e => handleGradeChange(g.unit, e.target.value)}
                            className="bg-gray-700 text-white w-24 text-center rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-electric-blue"
                        />
                    </div>
                ))}
             </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
                <XAxis dataKey="name" stroke="#EAEAEA" />
                <YAxis stroke="#EAEAEA" />
                <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #2C2C2C' }} />
                <Legend />
                <Line type="monotone" dataKey="nota" stroke="#32CD32" name="Nota" />
                </LineChart>
            </ResponsiveContainer>
           )}
        </ChartContainer>
      </div>
    </div>
  );
};

export default StudentProfile;