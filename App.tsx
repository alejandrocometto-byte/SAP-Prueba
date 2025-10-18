import React, { useState, useMemo, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GroupOverview from './components/GroupOverview';
import AcademicAnalysis from './components/AcademicAnalysis';
import StudentProfile from './components/StudentProfile';
import AdminPanel from './components/AdminPanel';
import AuthActionModal from './components/AuthActionModal';

import { Page, Student, Course, Period, Unit } from './types';
import { INITIAL_STUDENTS, INITIAL_COURSES, INITIAL_PERIODS, INITIAL_UNITS, generateMockStudents } from './data/mockData';

import './index.css';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('group');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [periods, setPeriods] = useState<Period[]>(INITIAL_PERIODS);
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [authAction, setAuthAction] = useState<{ action: (() => void) | null }>({ action: null });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authError, setAuthError] = useState('');

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY || '' }), []);

  const requestAuth = useCallback((actionToPerform: () => void) => {
    setAuthAction({ action: actionToPerform });
    setIsAuthModalOpen(true);
    setAuthError('');
  }, []);

  const handleAuthConfirm = (password: string) => {
    if (password === 'admin123') {
      authAction.action?.();
      setIsAuthModalOpen(false);
      setAuthAction({ action: null });
    } else {
      setAuthError('Clave de acceso incorrecta.');
    }
  };
  
  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };
  
  const handleAddUnit = (name: string) => {
    const newUnit: Unit = { id: Date.now(), name };
    setUnits(prev => [...prev, newUnit]);
    // Add a default grade for this new unit to all students
    setStudents(prev => prev.map(student => ({
      ...student,
      grades: [...student.grades, { unit: name, grade: 0, date: new Date().toISOString().split('T')[0] }]
    })));
  };

  const handleUpdateUnit = (id: number, newName: string) => {
    const oldUnit = units.find(u => u.id === id);
    if (!oldUnit) return;
    
    setUnits(prev => prev.map(unit => unit.id === id ? { ...unit, name: newName } : unit));
    // Update the unit name in every student's grades
    setStudents(prev => prev.map(student => ({
      ...student,
      grades: student.grades.map(grade => grade.unit === oldUnit.name ? { ...grade, unit: newName } : grade)
    })));
  };

  const handleDeleteUnit = (id: number) => {
    const unitToDelete = units.find(u => u.id === id);
    if (!unitToDelete) return;

    setUnits(prev => prev.filter(unit => unit.id !== id));
    // Remove the corresponding grade from every student
    setStudents(prev => prev.map(student => ({
      ...student,
      grades: student.grades.filter(grade => grade.unit !== unitToDelete.name)
    })));
  };


  const handleSelectStudent = (studentId: number) => {
    setSelectedStudentId(studentId);
    setPage('profile');
  };

  const handleResetData = () => {
    setStudents(generateMockStudents(20));
    setUnits(INITIAL_UNITS);
    setCourses(INITIAL_COURSES);
    setPeriods(INITIAL_PERIODS);
    console.log('All data has been reset.');
  };
  
  const selectedStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId);
  }, [selectedStudentId, students]);

  const renderContent = () => {
    switch (page) {
      case 'group':
        return <GroupOverview students={students} onSelectStudent={handleSelectStudent} />;
      case 'academic':
        return <AcademicAnalysis students={students} units={units} />;
      case 'profile':
        if (selectedStudent) {
          return <StudentProfile 
            student={selectedStudent} 
            units={units}
            ai={ai} 
            onUpdateStudent={handleUpdateStudent}
            requestAuth={requestAuth}
          />;
        }
        return <div className="text-center text-gray-400">Por favor, seleccione un estudiante para ver su perfil.</div>;
      case 'admin':
        return <AdminPanel
          students={students}
          setStudents={setStudents}
          courses={courses}
          setCourses={setCourses}
          periods={periods}
          setPeriods={setPeriods}
          units={units}
          onAddUnit={handleAddUnit}
          onUpdateUnit={handleUpdateUnit}
          onDeleteUnit={handleDeleteUnit}
          onResetData={handleResetData}
          requestAuth={requestAuth}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar
        currentPage={page}
        onNavigate={setPage}
        hasSelectedStudent={!!selectedStudentId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          page={page}
          students={students}
          selectedStudentId={selectedStudentId}
          onSelectStudent={(id) => setSelectedStudentId(id)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4 sm:p-6 md:p-8">
          {renderContent()}
        </main>
      </div>
      <AuthActionModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onConfirm={handleAuthConfirm}
        title="Confirmar Acción"
        description="Por favor, ingrese la clave de acceso de administrador para continuar."
        error={authError}
      />
    </div>
  );
};

export default App;
