import { Student, Course, Period, Unit } from '../types';

const firstNames = ['Alejandro', 'Valentina', 'Mateo', 'Sofia', 'Santiago', 'Camila', 'Sebastián', 'Isabella', 'Leonardo', 'Valeria', 'Diego', 'Mariana', 'Nicolás', 'Luciana', 'Daniel', 'Gabriela', 'Javier', 'Adriana', 'Emiliano', 'Martina'];
const lastNames = ['García', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres', 'Flores', 'Rivera', 'Gomez', 'Diaz', 'Cruz', 'Morales', 'Reyes', 'Gutierrez', 'Ortiz', 'Jimenez'];

export const INITIAL_UNITS: Unit[] = [
    { id: 1, name: 'Unidad 1: Fundamentos' },
    { id: 2, name: 'Unidad 2: Marketing' },
    { id: 3, name: 'Unidad 3: Finanzas' },
    { id: 4, name: 'Unidad 4: RRHH' },
    { id: 5, name: 'Unidad 5: Operaciones' },
];

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateMockStudents = (count: number): Student[] => {
  const students: Student[] = [];
  for (let i = 1; i <= count; i++) {
    const name = `${firstNames[getRandomInt(0, firstNames.length - 1)]} ${lastNames[getRandomInt(0, lastNames.length - 1)]}`;
    const basePerformance = getRandomInt(40, 95);

    students.push({
      id: Date.now() + i,
      name,
      avatar: `https://i.pravatar.cc/150?u=${i}`,
      attendance: getRandomInt(75, 100),
      grades: INITIAL_UNITS.map((unit, index) => ({
        unit: unit.name,
        grade: Math.min(100, Math.max(0, basePerformance + getRandomInt(-15, 15))),
        date: `2024-0${index + 2}-15`,
      })),
      behavior: {
        participation: getRandomInt(1, 5),
        punctuality: getRandomInt(1, 5),
        initiative: getRandomInt(1, 5),
        collaboration: getRandomInt(1, 5),
        attendanceCompliance: getRandomInt(1, 5),
      },
    });
  }
  return students;
};

export const INITIAL_STUDENTS: Student[] = generateMockStudents(20);

export const INITIAL_COURSES: Course[] = [
    { id: 1, name: '6° A' },
    { id: 2, name: '6° B' },
    { id: 3, name: '6° C' },
];

export const INITIAL_PERIODS: Period[] = [
    { id: 1, name: 'Últimos 30 días' },
    { id: 2, name: 'Semestre 1' },
    { id: 3, name: 'Semestre 2' },
];