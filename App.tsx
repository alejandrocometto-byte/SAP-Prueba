import React, { useState, useMemo } from 'react';
import { Page, Student, Course, Period, Unit } from './types';
import { INITIAL_STUDENTS, INITIAL_COURSES, INITIAL_PERIODS, INITIAL_UNITS } from './data/mockData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GroupOverview from './components/GroupOverview';
import AcademicAnalysis from './components/AcademicAnalysis';
import StudentProfile from './components/StudentProfile';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>('group');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [periods, setPeriods] = useState<Period[]>(INITIAL_PERIODS);
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);
  
  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleSelectStudent = (studentId: number) => {
    setSelectedStudentId(studentId);
    setCurrentPage('profile');
  };
  
  const handleNavigation = (page: Page) => {
    if (page === 'profile' && selectedStudentId === null && students.length > 0) {
      setSelectedStudentId(students[0].id);
    }
    setCurrentPage(page);
  }
  
  // Admin CRUD functions
  const addStudent = (student: Omit<Student, 'id' | 'avatar' | 'grades' | 'behavior'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now(),
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      attendance: 100,
      grades: units.map(u => ({ unit: u.name, grade: 0, date: new Date().toISOString().split('T')[0] })), 
      behavior: { participation: 3, punctuality: 3, initiative: 3, collaboration: 3, attendanceCompliance: 3 }
    };
    setStudents(prev => [...prev, newStudent]);
  };
  
  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };
  
  const deleteStudent = (studentId: number) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    if (selectedStudentId === studentId) {
        setSelectedStudentId(null);
        setCurrentPage('group');
    }
  };

  const addCourse = (name: string) => setCourses(prev => [...prev, { id: Date.now(), name }]);
  const deleteCourse = (id: number) => setCourses(prev => prev.filter(c => c.id !== id));
  
  const addPeriod = (name: string) => setPeriods(prev => [...prev, { id: Date.now(), name }]);
  const deletePeriod = (id: number) => setPeriods(prev => prev.filter(p => p.id !== id));

  const addUnit = (name: string) => {
    const newUnit = { id: Date.now(), name };
    setUnits(prev => [...prev, newUnit]);
    // Add a grade for this new unit to all existing students
    setStudents(prev => prev.map(s => ({
      ...s,
      grades: [...s.grades, { unit: name, grade: 0, date: new Date().toISOString().split('T')[0] }]
    })));
  };

  const updateUnit = (id: number, newName: string) => {
    const oldUnit = units.find(u => u.id === id);
    if (!oldUnit) return;

    setUnits(prev => prev.map(u => (u.id === id ? { ...u, name: newName } : u)));
    setStudents(prev => prev.map(s => ({
      ...s,
      grades: s.grades.map(g => (g.unit === oldUnit.name ? { ...g, unit: newName } : g))
    })));
  };

  const deleteUnit = (id: number) => {
    const unitToDelete = units.find(u => u.id === id);
    if (!unitToDelete) return;

    setUnits(prev => prev.filter(u => u.id !== id));
    setStudents(prev => prev.map(s => ({
      ...s,
      grades: s.grades.filter(g => g.unit !== unitToDelete.name)
    })));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'group':
        return <GroupOverview students={students} onSelectStudent={handleSelectStudent} />;
      case 'academic':
        return <AcademicAnalysis students={students} units={units.map(u => u.name)} />;
      case 'profile':
        return <StudentProfile students={students} selectedStudentId={selectedStudentId} setSelectedStudentId={setSelectedStudentId} onUpdateStudent={updateStudent} />;
      case 'admin':
        return <AdminPanel
          students={students}
          courses={courses}
          periods={periods}
          units={units}
          onAddStudent={addStudent}
          onUpdateStudent={updateStudent}
          onDeleteStudent={deleteStudent}
          onAddCourse={addCourse}
          onDeleteCourse={deleteCourse}
          onAddPeriod={addPeriod}
          onDeletePeriod={deletePeriod}
          onAddUnit={addUnit}
          onUpdateUnit={updateUnit}
          onDeleteUnit={deleteUnit}
        />;
      default:
        return <GroupOverview students={students} onSelectStudent={handleSelectStudent} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-900 font-sans">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigation} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header courses={courses.map(c => c.name)} periods={periods.map(p => p.name)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4 md:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;