export interface BehavioralData {
  participation: number;
  punctuality: number;
  initiative: number;
  collaboration: number;
  attendanceCompliance: number;
}

export interface UnitGrade {
  unit: string;
  grade: number;
  date: string;
}

export interface Student {
  id: number;
  name: string;
  avatar: string;
  attendance: number;
  grades: UnitGrade[];
  behavior: BehavioralData;
}

export interface Course {
  id: number;
  name: string;
}

export interface Period {
  id: number;
  name: string;
}

export interface Unit {
  id: number;
  name: string;
}

export type Page = 'group' | 'academic' | 'profile' | 'admin';