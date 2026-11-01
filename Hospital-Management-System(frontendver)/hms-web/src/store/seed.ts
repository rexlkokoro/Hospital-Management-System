import { usePatients } from "./patients";
import { useDoctors } from "./doctors";
import { useAppointments } from "./appointments";
import { usePrescriptions } from "./prescriptions";
import { useBills } from "./bills";
import type { Patient, Doctor, Appointment, Prescription, Bill } from "@/lib/types";

export const initialPatients: Patient[] = [
  {
    id: "250001",
    name: "Aarav Kumar",
    age: 29,
    contact: "9876543210",
    address: "Flat 402, Shanti Heights, Kankarbagh, Patna",
    bloodGroup: "B+",
    medicalHistory: "Hypertension",
  },
  {
    id: "250002",
    name: "Kavita Kumari",
    age: 42,
    contact: "9876512340",
    address: "12B, Green Park Extension, New Delhi",
    bloodGroup: "O+",
    medicalHistory: "Type 2 Diabetes",
  },
  {
    id: "250003",
    name: "Rohan Singh",
    age: 35,
    contact: "9765432109",
    address: "Plot 45, Gomti Nagar, Lucknow",
    bloodGroup: "A+",
    medicalHistory: "Mild Asthma",
  },
  {
    id: "250004",
    name: "Sneha Kumari",
    age: 27,
    contact: "9654321098",
    address: "74, Circular Road, Ranchi",
    bloodGroup: "AB+",
    medicalHistory: "None",
  },
  {
    id: "250005",
    name: "Manish Kumar",
    age: 58,
    contact: "9543210987",
    address: "8/2A, Boring Road, Patna",
    bloodGroup: "O-",
    medicalHistory: "Post CABG Follow-up",
  },
  {
    id: "250006",
    name: "Pooja Kumari",
    age: 31,
    contact: "9432109876",
    address: "21, Civil Lines, Prayagraj",
    bloodGroup: "A-",
    medicalHistory: "Allergic Rhinitis",
  },
  {
    id: "250007",
    name: "Aditya Singh",
    age: 46,
    contact: "9321098765",
    address: "55/1, Sector 4, Bokaro Steel City",
    bloodGroup: "B-",
    medicalHistory: "Fatty Liver Grade 1",
  },
  {
    id: "250008",
    name: "Meera Kumari",
    age: 23,
    contact: "9210987654",
    address: "Flat 101, Ashok Nagar, Varanasi",
    bloodGroup: "O+",
    medicalHistory: "None",
  },
  {
    id: "250009",
    name: "Devendra Singh",
    age: 34,
    contact: "9123456780",
    address: "14, Bailey Road, Patna",
    bloodGroup: "AB+",
    medicalHistory: "Gastritis",
  },
];

export const initialDoctors: Doctor[] = [
  {
    id: "D101",
    name: "Rajesh Kumar",
    age: 48,
    contact: "9811223344",
    specialization: "Cardiologist",
    consultationFee: 800,
    available: true,
  },
  {
    id: "D102",
    name: "Anita Kumari",
    age: 41,
    contact: "9822334455",
    specialization: "Neurologist",
    consultationFee: 900,
    available: true,
  },
  {
    id: "D103",
    name: "Vikram Singh",
    age: 52,
    contact: "9833445566",
    specialization: "Orthopedic Surgeon",
    consultationFee: 750,
    available: true,
  },
  {
    id: "D104",
    name: "Sunita Kumari",
    age: 38,
    contact: "9844556677",
    specialization: "Pediatrician",
    consultationFee: 600,
    available: true,
  },
  {
    id: "D105",
    name: "Amit Kumar",
    age: 45,
    contact: "9855667788",
    specialization: "General Physician",
    consultationFee: 500,
    available: true,
  },
  {
    id: "D106",
    name: "Pooja Singh",
    age: 36,
    contact: "9866778899",
    specialization: "Dermatologist",
    consultationFee: 650,
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
    doctorId: "D106",
    date: "2026-11-06",
    time: "14:00",
    status: "Scheduled",
  },
  {
    id: "A1005",
    patientId: "250005",
    doctorId: "D101",
    date: "2026-11-07",
    time: "16:00",
    status: "Scheduled",
  },
  {
    id: "A1006",
    patientId: "250006",
    doctorId: "D103",
    date: "2026-11-07",
    time: "11:00",
    status: "Scheduled",
  },
  {
    id: "A1007",
    patientId: "250007",
    doctorId: "D102",
    date: "2026-11-08",
    time: "15:30",
    status: "Scheduled",
  },
  {
    id: "A1008",
    patientId: "250008",
    doctorId: "D104",
    date: "2026-11-08",
    time: "10:30",
    status: "Cancelled",
  },
  {
    id: "A1009",
    patientId: "250009",
    doctorId: "D105",
    date: "2026-11-09",
    time: "12:00",
    status: "Scheduled",
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
    medicine: "Metformin 500mg + Glimepiride 1mg",
    dosage: "Twice daily before meals",
    duration: "60 days",
    createdAt: "2026-11-01T10:30:00Z",
  },
  {
    id: "RX1003",
    patientId: "250003",
    doctorId: "D105",
    medicine: "Levocetirizine 5mg + Montelukast 10mg",
    dosage: "Once daily at bedtime",
    duration: "14 days",
    createdAt: "2026-11-01T11:00:00Z",
  },
  {
    id: "RX1004",
    patientId: "250005",
    doctorId: "D101",
    medicine: "Atorvastatin 20mg + Aspirin 75mg",
    dosage: "Once daily after dinner",
    duration: "90 days",
    createdAt: "2026-11-01T11:15:00Z",
  },
  {
    id: "RX1005",
    patientId: "250006",
    doctorId: "D103",
    medicine: "Aceclofenac 100mg + Paracetamol 325mg",
    dosage: "Twice daily after food",
    duration: "5 days",
    createdAt: "2026-11-01T11:45:00Z",
  },
  {
    id: "RX1006",
    patientId: "250007",
    doctorId: "D102",
    medicine: "Ursodeoxycholic acid 300mg",
    dosage: "Twice daily with meals",
    duration: "30 days",
    createdAt: "2026-11-01T12:00:00Z",
  },
  {
    id: "RX1007",
    patientId: "250009",
    doctorId: "D105",
    medicine: "Pantoprazole 40mg",
    dosage: "Once daily empty stomach",
    duration: "15 days",
    createdAt: "2026-11-01T12:30:00Z",
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
    description: "General Physician Consultation & HbA1c screening",
    paymentStatus: "Paid",
    createdAt: "2026-11-01T10:45:00Z",
  },
  {
    id: "B1003",
    patientId: "250003",
    amount: 500,
    description: "General Consultation & Allergy check",
    paymentStatus: "Paid",
    createdAt: "2026-11-01T11:00:00Z",
  },
  {
    id: "B1004",
    patientId: "250004",
    amount: 650,
    description: "Dermatology Consultation",
    paymentStatus: "Pending",
    createdAt: "2026-11-01T11:30:00Z",
  },
  {
    id: "B1005",
    patientId: "250005",
    amount: 1250,
    description: "Cardiology Consultation & 2D Echo",
    paymentStatus: "Paid",
    createdAt: "2026-11-01T11:45:00Z",
  },
  {
    id: "B1006",
    patientId: "250006",
    amount: 750,
    description: "Orthopedic Consultation & Knee X-Ray",
    paymentStatus: "Paid",
    createdAt: "2026-11-01T12:00:00Z",
  },
  {
    id: "B1007",
    patientId: "250007",
    amount: 900,
    description: "Neurology Consultation",
    paymentStatus: "Pending",
    createdAt: "2026-11-01T12:15:00Z",
  },
  {
    id: "B1008",
    patientId: "250008",
    amount: 600,
    description: "Pediatric Consultation",
    paymentStatus: "Pending",
    createdAt: "2026-11-01T12:30:00Z",
  },
  {
    id: "B1009",
    patientId: "250009",
    amount: 500,
    description: "General Physician Consultation",
    paymentStatus: "Paid",
    createdAt: "2026-11-01T12:45:00Z",
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
