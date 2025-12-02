// Core types for PAUD Tunas Ceria

export type UserRole = 'parent' | 'admin' | 'teacher';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role?: UserRole;
}

export interface Child {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  address: string;
  specialConditions?: string;
  allergies?: string;
  class?: string;
  parentId: string;
  status: 'pending' | 'approved' | 'rejected';
  photoUrl?: string;
}

export interface Staff {
  id: string;
  name: string;
  position: string;
  photoUrl: string;
}

export interface DailyReport {
  id: string;
  childId: string;
  date: string;
  class: string;
  activity: string;
  specialNotes?: string;
  photoUrl?: string;
  teacherId: string;
}

export interface LearningPlan {
  id: string;
  class: string;
  date: string;
  title: string;
  description: string;
  materialsNeeded: string;
  teacherId: string;
}

export interface Billing {
  id: string;
  childId: string;
  amount: number;
  description: string;
  dueDate: string;
  status: 'pending_verification' | 'unpaid' | 'paid';
  paymentProofUrl?: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  itemName: string;
  description: string;
  photoUrl: string;
  status: 'new' | 'in_progress' | 'completed';
  createdBy: string;
  createdByRole: UserRole;
  createdAt: string;
  workProofUrl?: string;
  completionProofUrl?: string;
}

export interface SchoolProfile {
  name: string;
  vision: string;
  mission: string[];
  address: string;
  phone: string;
  email: string;
  about: string;
}
