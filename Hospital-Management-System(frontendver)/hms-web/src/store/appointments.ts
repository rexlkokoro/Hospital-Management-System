import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { generateNextId } from "@/lib/ids";

interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (data: Omit<Appointment, "id" | "status"> & { id?: string; status?: AppointmentStatus }) => Appointment;
  setStatus: (id: string, status: AppointmentStatus) => void;
  deleteAppointment: (id: string) => void;
  getNextId: () => string;
}

export const useAppointments = create<AppointmentState>()(
  persist(
    (set, get) => ({
      appointments: [],
      getNextId: () => {
        const ids = get().appointments.map((a) => a.id);
        return generateNextId(ids, "A", 1001);
      },
      addAppointment: (data) => {
        const id = data.id || get().getNextId();
        const newAppt: Appointment = {
          ...data,
          id,
          status: data.status || "Scheduled",
        };
        set((state) => ({ appointments: [newAppt, ...state.appointments] }));
        return newAppt;
      },
      setStatus: (id, status) =>
        set((state) => ({
          appointments: state.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
        })),
      deleteAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        })),
    }),
    { name: "hms-appointments" }
  )
);

