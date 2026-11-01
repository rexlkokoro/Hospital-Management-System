export type Role = "Admin" | "Doctor" | "Receptionist";

export interface User {
  username: string;
  role: Role;
}

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface Patient {
  id: string;
  name: string;
  age: number;
  contact: string;
  address: string;
  bloodGroup: BloodGroup;
  medicalHistory: string;
}

export interface Doctor {
  id: string;
  name: string;
  age: number;
  contact: string;
  specialization: string;
  consultationFee: number;
  available: boolean;
}

export type AppointmentStatus = "Scheduled" | "Completed" | "Cancelled";

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: AppointmentStatus;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medicine: string;
  dosage: string;
  duration: string;
  createdAt?: string;
}

export type PaymentStatus = "Pending" | "Paid";

export interface Bill {
  id: string;
  patientId: string;
  amount: number;
  description: string;
  paymentStatus: PaymentStatus;
  createdAt?: string;
}

