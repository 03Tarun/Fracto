export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  userId: number;
}

export interface User {
  userId: number;
  username: string;
  email: string;
  role: string;
  profileImagePath?: string;
  createdAt: string;
}

export interface Specialization {
  specializationId: number;
  specializationName: string;
  doctorCount: number;
}

export interface Doctor {
  doctorId: number;
  name: string;
  specializationName: string;
  specializationId: number;
  city: string;
  rating: number;
  profileImagePath?: string;
  email?: string;
  phone?: string;
  about?: string;
  experienceYears: number;
  consultationFee: number;
}

export interface Appointment {
  appointmentId: number;
  userId: number;
  username: string;
  doctorId: number;
  doctorName: string;
  specializationName: string;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  createdAt: string;
}

export interface Rating {
  ratingId: number;
  doctorId: number;
  userId: number;
  username: string;
  ratingValue: number;
  review?: string;
  createdAt: string;
}

export interface TimeSlot {
  timeSlot: string;
  isAvailable: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalAppointments: number;
  activeAppointments: number;
  cancelledAppointments: number;
  totalSpecializations: number;
}
