import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Bill, PaymentStatus } from "@/lib/types";
import { generateNextId } from "@/lib/ids";

interface BillState {
  bills: Bill[];
  addBill: (data: Omit<Bill, "id" | "paymentStatus"> & { id?: string; paymentStatus?: PaymentStatus }) => Bill;
  markPaid: (id: string) => void;
  deleteBill: (id: string) => void;
  getNextId: () => string;
}

export const useBills = create<BillState>()(
  persist(
    (set, get) => ({
      bills: [],
      getNextId: () => {
        const ids = get().bills.map((b) => b.id);
        return generateNextId(ids, "B", 1001);
      },
      addBill: (data) => {
        const id = data.id || get().getNextId();
        const newBill: Bill = {
          ...data,
          id,
          paymentStatus: data.paymentStatus || "Pending",
          createdAt: data.createdAt || new Date().toISOString(),
        };
        set((state) => ({ bills: [newBill, ...state.bills] }));
        return newBill;
      },
      markPaid: (id) =>
        set((state) => ({
          bills: state.bills.map((b) => (b.id === id ? { ...b, paymentStatus: "Paid" } : b)),
        })),
      deleteBill: (id) =>
        set((state) => ({
          bills: state.bills.filter((b) => b.id !== id),
        })),
    }),
    { name: "hms-bills" }
  )
);

