import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Patient } from "@/lib/types";
import { generateNextId } from "@/lib/ids";

interface PatientState {
  patients: Patient[];
  addPatient: (data: Omit<Patient, "id"> & { id?: string }) => Patient;
  updatePatient: (id: string, data: Partial<Omit<Patient, "id">>) => void;
  deletePatient: (id: string) => void;
  getNextId: () => string;
}

export const usePatients = create<PatientState>()(
  persist(
    (set, get) => ({
      patients: [],
      getNextId: () => {
        const ids = get().patients.map((p) => p.id);
        return generateNextId(ids, "", 250001, 6);
      },
      addPatient: (data) => {
        const id = data.id || get().getNextId();
        const newPatient: Patient = {
          ...data,
          id,
          medicalHistory: data.medicalHistory || "None",
        };
        set((state) => ({ patients: [newPatient, ...state.patients] }));
        return newPatient;
      },
      updatePatient: (id, data) =>
        set((state) => ({
          patients: state.patients.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),
      deletePatient: (id) =>
        set((state) => ({
          patients: state.patients.filter((p) => p.id !== id),
        })),
    }),
    { name: "hms-patients" }
  )
);

