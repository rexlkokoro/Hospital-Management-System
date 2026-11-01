import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "@/store/session";
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
import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useSession();
  const location = useLocation();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("hms-theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("hms-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("hms-theme", "light");
    }
  }, [darkMode]);

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
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col shrink-0">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            <Hospital className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
              HMS Portal
            </div>
            <div className="text-xs text-zinc-500">Hospital Management</div>
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
                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-blue-600 dark:text-blue-400" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between p-2 rounded-md bg-zinc-50 dark:bg-zinc-800/50">
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {user?.username}
              </div>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 mt-0.5">
                {user?.role}
              </Badge>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-zinc-400 hover:text-red-600 p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-6">
          <div className="text-sm text-zinc-500">
            Current Session: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{user?.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

