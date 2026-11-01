import { useSession } from "@/store/session";
import { can, type Action } from "@/lib/permissions";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface RequireCanProps {
  action: Action;
  children: React.ReactNode;
}

export function RequireCan({ action, children }: RequireCanProps) {
  const { user } = useSession();

  if (!can(user?.role, action)) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 mt-6">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Access Denied</h2>
        <p className="text-sm text-zinc-500 max-w-sm mt-1 mb-6">
          Your current role (<span className="font-semibold">{user?.role}</span>) does not have
          permission to access this section ({action}).
        </p>
        <Link to="/">
          <Button variant="outline" size="sm">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}

