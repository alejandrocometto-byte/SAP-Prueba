import React, { useState, useMemo, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GroupOverview from './components/GroupOverview';
import AcademicAnalysis from './components/AcademicAnalysis';
import StudentProfile from './components/StudentProfile';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import { Page, Student, Course, Period, Unit } from './types';
import { INITIAL_STUDENTS, INITIAL_COURSES, INITIAL_PERIODS, INITIAL_UNITS, generateMockStudents } from './data/mockData';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('group');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [periods, setPeriods] = useState<Period[]>(INITIAL_PERIODS);
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  // Fix: Initialize GoogleGenAI instance. Assume process.env.API_KEY is available.
  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY as string }), []);

  const handleLogin = (password: string): boolean => {
    // In a real app, this would be a proper authentication check.
    if (password === 'admin123') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setSelectedStudentId(null);
  };

  const handleSelectStudent = (studentId: number) => {
    setSelectedStudentId(studentId);
    setCurrentPage('profile');
  };

  const selectedStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || null;
  }, [selectedStudentId, students]);
  
  const resetData = useCallback(() => {
    setStudents(generateMockStudents(20));
  }, []);

  if (!isAuthenticated) {
    return <LoginModal onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'group':
        return <GroupOverview students={students} onSelectStudent={handleSelectStudent} />;
      case 'academic':
        return <AcademicAnalysis students={students} units={units.map(u => u.name)} />;
      case 'profile':
        if (selectedStudent) {
          return <StudentProfile student={selectedStudent} units={units.map(u => u.name)} ai={ai} />;
        }
        return <div className="text-white text-center p-10">Seleccione un estudiante para ver su perfil.</div>;
       case 'admin':
        return <AdminPanel 
          courses={courses}
          setCourses={setCourses}
          periods={periods}
          setPeriods={setPeriods}
          units={units}
          setUnits={setUnits}
          onResetData={resetData}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header courses={courses.map(c => c.name)} periods={periods.map(p => p.name)} />
        <main className="flex-1 overflow-y-auto p-8 bg-gray-900">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
