import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "@/store/session";
import { useTheme } from "@/context/ThemeContext";
import { can, type Action } from "@/lib/permissions";
import {
  Users,
  UserCheck,
  Calendar,
  FileText,
  CreditCard,
  LayoutDashboard,
  Settings,
  LogOut,
  Hospital,
  Sun,
  Moon,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useSession();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Patients", path: "/patients", icon: Users, action: "patient.view" as Action },
    { label: "Doctors", path: "/doctors", icon: UserCheck, action: "doctor.view" as Action },
    { label: "Appointments", path: "/appointments", icon: Calendar, action: "appointment.view" as Action },
    { label: "Prescriptions", path: "/prescriptions", icon: FileText, action: "prescription.view" as Action },
    { label: "Billing", path: "/billing", icon: CreditCard, action: "bill.view" as Action },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  const visibleNavItems = navItems.filter((item) => {
    if (!item.action) return true;
    return can(user?.role, item.action);
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Hospital className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
              HMS Portal
            </div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">Hospital Management</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-blue-600 dark:text-blue-400" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-3 border-t border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between p-2 rounded-md bg-slate-100/70 dark:bg-zinc-900">
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user?.username}
              </div>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 mt-0.5">
                {user?.role}
              </Badge>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-slate-400 hover:text-red-600 p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-6 transition-colors duration-200">
          <div className="text-sm text-slate-500 dark:text-zinc-400">
            Current Session: <span className="font-semibold text-slate-700 dark:text-zinc-200">{user?.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} theme`}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-black transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
