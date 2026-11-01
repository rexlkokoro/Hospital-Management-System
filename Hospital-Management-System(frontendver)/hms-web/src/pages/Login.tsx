import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/store/session";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Hospital, Lock, User as UserIcon } from "lucide-react";
import type { Role } from "@/lib/types";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const accounts: { u: string; p: string; r: Role }[] = [
    { u: "admin", p: "admin123", r: "Admin" },
    { u: "doctor", p: "doc123", r: "Doctor" },
    { u: "reception", p: "rec123", r: "Receptionist" },
    { u: "dr_sharma", p: "doc123", r: "Doctor" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const matched = accounts.find((a) => a.u === username && a.p === password);
    if (matched) {
      login(matched.u, matched.r);
      navigate("/");
    } else {
      setError("Invalid username or password. Please use demo credentials.");
    }
  };

  const handleQuickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    const matched = accounts.find((a) => a.u === u);
    if (matched) {
      login(matched.u, matched.r);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-100 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-1 mb-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-md mb-2">
            <Hospital className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Hospital Management System
          </h1>
          <p className="text-xs text-zinc-500">Sign in to access medical records and operations</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Staff Login</CardTitle>
            <CardDescription className="text-xs">
              Enter your assigned hospital credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs rounded-md bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Username
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin, doctor, reception"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-2">
                Sign In
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Quick Demo Logins
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => handleQuickLogin("admin", "admin123")}
                >
                  Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => handleQuickLogin("doctor", "doc123")}
                >
                  Doctor
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => handleQuickLogin("reception", "rec123")}
                >
                  Reception
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

