import React, { useState, useMemo, useEffect } from 'react';
import { Student, Unit, UnitGrade, BehavioralData } from '../types';
import DashboardCard from './DashboardCard';
import ChartContainer from './ChartContainer';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, CheckCircle, Star, AlertCircle, Sparkle, Edit, X, Save } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface StudentProfileProps {
  student: Student;
  units: Unit[];
  ai: GoogleGenAI;
  onUpdateStudent: (student: Student) => void;
  requestAuth: (action: () => void) => void;
}

const getAverageGrade = (grades: { grade: number }[]) => {
  if (!grades.length) return 0;
  return grades.reduce((sum, g) => sum + g.grade, 0) / grades.length;
};

const StudentProfile: React.FC<StudentProfileProps> = ({ student, units, ai, onUpdateStudent, requestAuth }) => {
  const [aiSummary, setAiSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editedGrades, setEditedGrades] = useState<UnitGrade[]>(student.grades);
  const [editedBehavior, setEditedBehavior] = useState<BehavioralData>(student.behavior);

  useEffect(() => {
    setEditedGrades(student.grades);
    setEditedBehavior(student.behavior);
    setIsEditing(false);
    setAiSummary('');
  }, [student]);

  const averageGrade = useMemo(() => getAverageGrade(student.grades), [student.grades]);
  const behaviorScore = useMemo(() => {
    const behaviorValues = Object.values(student.behavior);
    return getAverageGrade(behaviorValues.map(v => ({ grade: v }))) * 20; // Scale to 100
  }, [student.behavior]);

  const trendData = useMemo(() => {
    return student.grades.map(g => ({
      name: g.unit.replace('Unidad ', 'U'),
      calificacion: g.grade
    }));
  }, [student.grades]);

  const behaviorData = useMemo(() => {
    const data = isEditing ? editedBehavior : student.behavior;
    return [
      { subject: 'Participación', value: data.participation, fullMark: 5 },
      { subject: 'Puntualidad', value: data.punctuality, fullMark: 5 },
      { subject: 'Iniciativa', value: data.initiative, fullMark: 5 },
      { subject: 'Colaboración', value: data.collaboration, fullMark: 5 },
      { subject: 'Asistencia', value: data.attendanceCompliance, fullMark: 5 },
    ];
  }, [student.behavior, editedBehavior, isEditing]);
  
  const handleGradeChange = (unitName: string, value: string) => {
    const gradeValue = Math.max(0, Math.min(100, Number(value)));
    setEditedGrades(prev => prev.map(g => g.unit === unitName ? { ...g, grade: gradeValue } : g));
  };
  
  const handleBehaviorChange = (key: keyof BehavioralData, value: string) => {
    const behaviorValue = Math.max(0, Math.min(5, Number(value)));
    setEditedBehavior(prev => ({ ...prev, [key]: behaviorValue }));
  };
  
  const handleSave = () => {
    requestAuth(() => {
      onUpdateStudent({
        ...student,
        grades: editedGrades,
        behavior: editedBehavior,
      });
      setIsEditing(false);
    });
  };

  const handleCancel = () => {
    setEditedGrades(student.grades);
    setEditedBehavior(student.behavior);
    setIsEditing(false);
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setError('');
    setAiSummary('');

    const prompt = `
      Analiza el perfil del siguiente estudiante y genera un resumen conciso en español.
      El resumen debe tener los siguientes puntos en formato de viñetas (markdown):
      - **Resumen General:** Una descripción general del rendimiento académico y conductual del estudiante.
      - **Fortalezas:** Identifica las áreas donde el estudiante se destaca.
      - **Áreas de Oportunidad:** Señala dónde puede mejorar el estudiante.
      - **Recomendación:** Proporciona una recomendación accionable para el estudiante o el profesor.

      **Datos del Estudiante:**
      - **Nombre:** ${student.name}
      - **Promedio General:** ${averageGrade.toFixed(1)}%
      - **Asistencia General:** ${student.attendance}%
      - **Calificaciones por Unidad:**
      ${student.grades.map(g => `  - ${g.unit}: ${g.grade}%`).join('\n')}
      - **Comportamiento (escala 1-5):**
        - Participación: ${student.behavior.participation}
        - Puntualidad: ${student.behavior.punctuality}
        - Iniciativa: ${student.behavior.initiative}
        - Colaboración: ${student.behavior.collaboration}
      
      Genera el análisis en español.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      setAiSummary(response.text);
    } catch (e) {
      console.error(e);
      setError('Error al generar el resumen. Por favor, intente de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-6 bg-gray-800 p-6 rounded-xl">
        <div className="flex items-center space-x-6">
            <img src={student.avatar} alt={student.name} className="w-24 h-24 rounded-full border-4 border-electric-blue" />
            <div>
              <h2 className="text-3xl font-bold text-white">{student.name}</h2>
              <p className="text-gray-400">ID: {student.id}</p>
            </div>
        </div>
        <div>
            {isEditing ? (
                <div className="flex items-center space-x-2">
                    <button onClick={handleSave} className="flex items-center px-4 py-2 font-semibold text-white bg-lime-green rounded-lg hover:bg-green-600 transition-colors"><Save size={18} className="mr-2"/>Guardar</button>
                    <button onClick={handleCancel} className="flex items-center px-4 py-2 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"><X size={18} className="mr-2"/>Cancelar</button>
                </div>
            ) : (
                <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 font-semibold text-white bg-electric-blue rounded-lg hover:bg-blue-600 transition-colors"><Edit size={18} className="mr-2"/>Modo Edición</button>
            )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Promedio General" value={`${averageGrade.toFixed(1)}%`} icon={<TrendingUp />} colorClass="bg-electric-blue" />
        <DashboardCard title="Asistencia" value={`${student.attendance}%`} icon={<CheckCircle />} colorClass="bg-lime-green" />
        <DashboardCard title="Comportamiento" value={`${behaviorScore.toFixed(1)}/100`} icon={<Star />} colorClass="bg-coral-red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer title="Evolución de Calificaciones">
            {!isEditing ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
                  <XAxis dataKey="name" stroke="#EAEAEA" />
                  <YAxis domain={[0, 100]} stroke="#EAEAEA" />
                  <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #2C2C2C' }} />
                  <Line type="monotone" dataKey="calificacion" name="Calificación" stroke="#007BFF" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="space-y-2 pr-4 max-h-[300px] overflow-y-auto">
                {editedGrades.map(grade => (
                  <div key={grade.unit} className="flex items-center justify-between">
                    <label className="text-gray-300 w-2/3">{grade.unit}</label>
                    <input type="number" value={grade.grade} onChange={(e) => handleGradeChange(grade.unit, e.target.value)}
                           className="bg-gray-700 text-white rounded-md p-1 w-1/3 text-center focus:outline-none focus:ring-2 focus:ring-electric-blue"/>
                  </div>
                ))}
              </div>
            )}
          </ChartContainer>
          <ChartContainer title="Perfil de Comportamiento">
            {!isEditing ? (
             <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={behaviorData}>
                    <PolarGrid stroke="#4A4A4A"/>
                    <PolarAngleAxis dataKey="subject" stroke="#EAEAEA" tick={{fontSize: 12}}/>
                    <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#4A4A4A" />
                    <Radar name={student.name} dataKey="value" stroke="#32CD32" fill="#32CD32" fillOpacity={0.6} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #2C2C2C' }} />
                </RadarChart>
            </ResponsiveContainer>
            ) : (
                <div className="space-y-2 pr-4 max-h-[300px] overflow-y-auto">
                    {Object.keys(editedBehavior).map(key => (
                         <div key={key} className="flex items-center justify-between">
                            <label className="text-gray-300 w-2/3 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                            <input type="number" value={editedBehavior[key as keyof BehavioralData]} 
                                   onChange={(e) => handleBehaviorChange(key as keyof BehavioralData, e.target.value)}
                                   className="bg-gray-700 text-white rounded-md p-1 w-1/3 text-center focus:outline-none focus:ring-2 focus:ring-electric-blue"/>
                        </div>
                    ))}
                </div>
            )}
          </ChartContainer>
      </div>
      
      <ChartContainer title="Análisis con IA Gemini">
        <div className="space-y-4">
          <button
            onClick={handleGenerateSummary}
            disabled={isGenerating || isEditing}
            className="flex items-center justify-center px-4 py-2 font-semibold text-white bg-electric-blue rounded-lg hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Sparkle className="mr-2" size={18}/>
            {isGenerating ? 'Generando...' : 'Generar Análisis de Rendimiento'}
          </button>
          {isGenerating && <div className="text-center text-gray-300">Analizando datos...</div>}
          {error && <div className="text-coral-red flex items-center"><AlertCircle className="mr-2" />{error}</div>}
          {aiSummary && (
            <div className="prose prose-invert max-w-none bg-gray-900/50 p-4 rounded-lg whitespace-pre-wrap font-sans">
              {aiSummary}
            </div>
          )}
        </div>
      </ChartContainer>

    </div>
  );
};

export default StudentProfile;
