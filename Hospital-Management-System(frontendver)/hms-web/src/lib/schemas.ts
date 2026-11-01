import { z } from "zod";

export const patientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  age: z.coerce.number().int().positive("Age must be a positive integer"),
  contact: z.string().min(1, "Contact is required"),
  address: z.string().default(""),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  medicalHistory: z.string().default("None"),
});

export type PatientFormData = z.infer<typeof patientSchema>;

export const doctorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Doctor name is required"),
  age: z.coerce.number().int().positive("Age must be a positive integer"),
  contact: z.string().min(1, "Contact is required"),
  specialization: z.string().min(1, "Specialization is required"),
  consultationFee: z.coerce.number().min(0, "Fee must be greater than or equal to 0"),
  available: z.boolean().default(true),
});

export type DoctorFormData = z.infer<typeof doctorSchema>;

export const appointmentSchema = z.object({
  id: z.string().optional(),
  patientId: z.string().min(1, "Please select a patient"),
  doctorId: z.string().min(1, "Please select a doctor"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  status: z.enum(["Scheduled", "Completed", "Cancelled"]).default("Scheduled"),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

export const prescriptionSchema = z.object({
  id: z.string().optional(),
  patientId: z.string().min(1, "Please select a patient"),
  doctorId: z.string().min(1, "Please select a doctor"),
  medicine: z.string().min(1, "Medicine name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  duration: z.string().min(1, "Duration is required"),
});

export type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

export const billSchema = z.object({
  id: z.string().optional(),
  patientId: z.string().min(1, "Please select a patient"),
  amount: z.coerce.number().min(0, "Amount must be a non-negative number"),
  description: z.string().min(1, "Description is required").default("Consultation/Treatment"),
  paymentStatus: z.enum(["Pending", "Paid"]).default("Pending"),
});

export type BillFormData = z.infer<typeof billSchema>;

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

