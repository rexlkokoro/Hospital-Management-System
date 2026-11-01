import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Doctor } from "@/lib/types";
import { generateNextId } from "@/lib/ids";

interface DoctorState {
  doctors: Doctor[];
  addDoctor: (data: Omit<Doctor, "id"> & { id?: string }) => Doctor;
  updateDoctor: (id: string, data: Partial<Omit<Doctor, "id">>) => void;
  toggleAvailable: (id: string) => void;
  deleteDoctor: (id: string) => void;
  getNextId: () => string;
}

export const useDoctors = create<DoctorState>()(
  persist(
    (set, get) => ({
      doctors: [],
      getNextId: () => {
        const ids = get().doctors.map((d) => d.id);
        return generateNextId(ids, "D", 101);
      },
      addDoctor: (data) => {
        const id = data.id || get().getNextId();
        const newDoctor: Doctor = {
          ...data,
          id,
          available: data.available ?? true,
        };
        set((state) => ({ doctors: [newDoctor, ...state.doctors] }));
        return newDoctor;
      },
      updateDoctor: (id, data) =>
        set((state) => ({
          doctors: state.doctors.map((d) => (d.id === id ? { ...d, ...data } : d)),
        })),
      toggleAvailable: (id) =>
        set((state) => ({
          doctors: state.doctors.map((d) =>
            d.id === id ? { ...d, available: !d.available } : d
          ),
        })),
      deleteDoctor: (id) =>
        set((state) => ({
          doctors: state.doctors.filter((d) => d.id !== id),
        })),
    }),
    { name: "hms-doctors" }
  )
);

