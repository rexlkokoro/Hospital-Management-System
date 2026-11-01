import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Prescription } from "@/lib/types";
import { generateNextId } from "@/lib/ids";

interface PrescriptionState {
  prescriptions: Prescription[];
  addPrescription: (data: Omit<Prescription, "id"> & { id?: string }) => Prescription;
  deletePrescription: (id: string) => void;
  getNextId: () => string;
}

export const usePrescriptions = create<PrescriptionState>()(
  persist(
    (set, get) => ({
      prescriptions: [],
      getNextId: () => {
        const ids = get().prescriptions.map((pr) => pr.id);
        return generateNextId(ids, "RX", 1001);
      },
      addPrescription: (data) => {
        const id = data.id || get().getNextId();
        const newPrescription: Prescription = {
          ...data,
          id,
          createdAt: data.createdAt || new Date().toISOString(),
        };
        set((state) => ({ prescriptions: [newPrescription, ...state.prescriptions] }));
        return newPrescription;
      },
      deletePrescription: (id) =>
        set((state) => ({
          prescriptions: state.prescriptions.filter((pr) => pr.id !== id),
        })),
    }),
    { name: "hms-prescriptions" }
  )
);

