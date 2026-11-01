import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Role } from "@/lib/types";

interface SessionState {
  user: User | null;
  login: (username: string, role?: Role) => void;
  logout: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      login: (username, role = "Admin") => set({ user: { username, role } }),
      logout: () => set({ user: null }),
    }),
    { name: "hms-session" }
  )
);

