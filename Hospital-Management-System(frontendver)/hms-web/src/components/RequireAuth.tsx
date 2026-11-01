import { Navigate } from "react-router-dom";
import { useSession } from "@/store/session";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useSession();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

