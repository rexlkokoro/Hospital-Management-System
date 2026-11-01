import { usePatients } from "./patients";
import { useDoctors } from "./doctors";
import { useAppointments } from "./appointments";
import { usePrescriptions } from "./prescriptions";
import { useBills } from "./bills";
import type { Patient, Doctor, Appointment, Prescription, Bill } from "@/lib/types";

export const initialPatients: Patient[] = [
  {
    id: "250001",
    name: "Aarav Mehta",
    age: 29,
    contact: "9876543210",
    address: "Flat 402, Shanti Heights, Andheri West, Mumbai",
    bloodGroup: "B+",
    medicalHistory: "Hypertension",
  },
  {
    id: "250002",
    name: "Kavita Deshmukh",
    age: 42,
    contact: "9876512340",
    address: "12B, Green Park Extension, New Delhi",
    bloodGroup: "O+",
    medicalHistory: "Type 2 Diabetes",
  },
  {
    id: "250003",
    name: "Rohan Kulkarni",
    age: 35,
    contact: "9765432109",
    address: "Plot 45, Shivaji Nagar, Pune",
    bloodGroup: "A+",
    medicalHistory: "Mild Asthma",
  },
  {
    id: "250004",
    name: "Sneha Nambiar",
    age: 27,
    contact: "9654321098",
    address: "74, Indiranagar 1st Stage, Bengaluru",
    bloodGroup: "AB+",
    medicalHistory: "None",
  },
  {
    id: "250005",
    name: "Manish Tiwari",
    age: 58,
    contact: "9543210987",
    address: "8/2A, Gomti Nagar, Lucknow",
    bloodGroup: "O-",
    medicalHistory: "Post CABG Follow-up",
  },
];

export const initialDoctors: Doctor[] = [
  {
    id: "D101",
    name: "Rajesh Sharma",
    age: 48,
    contact: "9811223344",
    specialization: "Cardiologist",
    consultationFee: 800,
    available: true,
  },
  {
    id: "D102",
    name: "Priya Iyer",
    age: 41,
    contact: "9822334455",
    specialization: "Neurologist",
    consultationFee: 900,
    available: true,
  },
  {
    id: "D103",
    name: "Amitabh Verma",
    age: 52,
    contact: "9833445566",
    specialization: "Orthopedic Surgeon",
    consultationFee: 750,
    available: true,
  },
  {
    id: "D104",
    name: "Sunita Patel",
    age: 38,
    contact: "9844556677",
    specialization: "Pediatrician",
    consultationFee: 600,
    available: true,
  },
  {
    id: "D105",
    name: "Vikram Malhotra",
    age: 45,
    contact: "9855667788",
    specialization: "General Physician",
    consultationFee: 500,
    available: true,
  },
];

export const initialAppointments: Appointment[] = [
  {
    id: "A1001",
    patientId: "250001",
    doctorId: "D101",
    date: "2026-11-05",
    time: "10:00",
    status: "Scheduled",
  },
  {
    id: "A1002",
    patientId: "250002",
    doctorId: "D105",
    date: "2026-11-05",
    time: "11:30",
    status: "Scheduled",
  },
  {
    id: "A1003",
    patientId: "250003",
    doctorId: "D105",
    date: "2026-11-06",
    time: "09:30",
    status: "Scheduled",
  },
  {
    id: "A1004",
    patientId: "250004",
    doctorId: "D102",
    date: "2026-11-06",
    time: "14:00",
    status: "Cancelled",
  },
];

export const initialPrescriptions: Prescription[] = [
  {
    id: "RX1001",
    patientId: "250001",
    doctorId: "D101",
    medicine: "Telmisartan 40mg",
    dosage: "Once daily after breakfast",
    duration: "30 days",
    createdAt: "2026-11-01T10:00:00Z",
  },
  {
    id: "RX1002",
    patientId: "250002",
    doctorId: "D105",
    medicine: "Metformin 500mg",
    dosage: "Twice daily before meals",
    duration: "60 days",
    createdAt: "2026-11-01T10:30:00Z",
  },
];

export const initialBills: Bill[] = [
  {
    id: "B1001",
    patientId: "250001",
    amount: 800,
    description: "Cardiology Consultation & ECG",
    paymentStatus: "Paid",
    createdAt: "2026-11-01T10:15:00Z",
  },
  {
    id: "B1002",
    patientId: "250002",
    amount: 500,
    description: "General Consultation",
    paymentStatus: "Pending",
    createdAt: "2026-11-01T10:45:00Z",
  },
];

export function seedDemoDataIfEmpty() {
  const pStore = usePatients.getState();
  const dStore = useDoctors.getState();
  const aStore = useAppointments.getState();
  const rxStore = usePrescriptions.getState();
  const bStore = useBills.getState();

  if (pStore.patients.length === 0) {
    usePatients.setState({ patients: initialPatients });
  }
  if (dStore.doctors.length === 0) {
    useDoctors.setState({ doctors: initialDoctors });
  }
  if (aStore.appointments.length === 0) {
    useAppointments.setState({ appointments: initialAppointments });
  }
  if (rxStore.prescriptions.length === 0) {
    usePrescriptions.setState({ prescriptions: initialPrescriptions });
  }
  if (bStore.bills.length === 0) {
    useBills.setState({ bills: initialBills });
  }
}

export function resetDemoData() {
  localStorage.removeItem("hms-patients");
  localStorage.removeItem("hms-doctors");
  localStorage.removeItem("hms-appointments");
  localStorage.removeItem("hms-prescriptions");
  localStorage.removeItem("hms-bills");

  usePatients.setState({ patients: initialPatients });
  useDoctors.setState({ doctors: initialDoctors });
  useAppointments.setState({ appointments: initialAppointments });
  usePrescriptions.setState({ prescriptions: initialPrescriptions });
  useBills.setState({ bills: initialBills });
}

