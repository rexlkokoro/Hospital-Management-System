import type { Role } from "./types";

export type Action =
  | "patient.view"
  | "patient.edit"
  | "doctor.view"
  | "doctor.edit"
  | "appointment.view"
  | "appointment.manage"
  | "prescription.view"
  | "prescription.add"
  | "bill.view"
  | "bill.manage";

export function can(role: Role | null | undefined, action: Action): boolean {
  if (!role) return false;

  // Admin has complete access
  if (role === "Admin") {
    return true;
  }

  // Doctor access
  if (role === "Doctor") {
    return (
      action === "patient.view" ||
      action === "doctor.view" ||
      action === "appointment.view" ||
      action === "prescription.view" ||
      action === "prescription.add"
    );
  }

  // Receptionist access
  if (role === "Receptionist") {
    return (
      action === "patient.view" ||
      action === "patient.edit" ||
      action === "doctor.view" ||
      action === "appointment.view" ||
      action === "appointment.manage" ||
      action === "bill.view" ||
      action === "bill.manage"
    );
  }

  return false;
}

