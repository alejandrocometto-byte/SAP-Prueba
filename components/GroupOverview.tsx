
import React, { useMemo } from 'react';
import { Student } from '../types';
import DashboardCard from './DashboardCard';
import ChartContainer from './ChartContainer';
import StudentRiskTable from './StudentRiskTable';
import { Users, CheckCircle, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';

interface GroupOverviewProps {
  students: Student[];
  onSelectStudent: (studentId: number) => void;
}

const getAverage = (arr: number[]) => arr.reduce((acc, val) => acc + val, 0) / arr.length;

const GroupOverview: React.FC<GroupOverviewProps> = ({ students, onSelectStudent }) => {
  const analytics = useMemo(() => {
    if (!students.length) return { classAverage: 0, attendanceAverage: 0, approvalRate: 0, trendData: [], distributionData: [] };
    
    const allGrades = students.flatMap(s => s.grades.map(g => g.grade));
    const studentAverages = students.map(s => getAverage(s.grades.map(g => g.grade)));
    
    const classAverage = getAverage(allGrades);
    const attendanceAverage = getAverage(students.map(s => s.attendance));
    const approvedStudents = studentAverages.filter(avg => avg >= 70).length;
    const approvalRate = (approvedStudents / students.length) * 100;

    const units = students[0]?.grades.map(g => g.unit) || [];
    const trendData = units.map(unit => ({
      name: unit.replace('Unidad ', 'U'),
      promedio: getAverage(students.flatMap(s => s.grades.filter(g => g.unit === unit).map(g => g.grade))),
    }));
    
    const distributionData = [
      { name: '< 60', count: studentAverages.filter(avg => avg < 60).length },
      { name: '60-69', count: studentAverages.filter(avg => avg >= 60 && avg < 70).length },
      { name: '70-79', count: studentAverages.filter(avg => avg >= 70 && avg < 80).length },
      { name: '80-89', count: studentAverages.filter(avg => avg >= 80 && avg < 90).length },
      { name: '90-100', count: studentAverages.filter(avg => avg >= 90).length },
    ];

    return { classAverage, attendanceAverage, approvalRate, trendData, distributionData };
  }, [students]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Promedio General" value={`${analytics.classAverage.toFixed(1)}%`} icon={<TrendingUp />} colorClass="bg-electric-blue" />
        <DashboardCard title="Asistencia General" value={`${analytics.attendanceAverage.toFixed(1)}%`} icon={<Users />} colorClass="bg-lime-green" />
        <DashboardCard title="Tasa de Aprobación" value={`${analytics.approvalRate.toFixed(1)}%`} icon={<CheckCircle />} colorClass="bg-coral-red" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ChartContainer title="Rendimiento del Grupo (Promedio)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
                <XAxis dataKey="name" stroke="#EAEAEA" />
                <YAxis stroke="#EAEAEA" />
                <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #2C2C2C' }} />
                <Line type="monotone" dataKey="promedio" stroke="#007BFF" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="lg:col-span-2">
            <ChartContainer title="Distribución de Promedios">
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.distributionData} layout="vertical" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
                        <XAxis type="number" stroke="#EAEAEA" />
                        <YAxis type="category" dataKey="name" stroke="#EAEAEA" width={60}/>
                        <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #2C2C2C' }} />
                        <Bar dataKey="count" fill="#32CD32" name="N° de Alumnos" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
      </div>

      <div>
        <StudentRiskTable students={students} onSelectStudent={onSelectStudent} />
      </div>
    </div>
  );
};

export default GroupOverview;
