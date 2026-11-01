import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { RequireAuth } from "@/components/RequireAuth";
import { RequireCan } from "@/components/RequireCan";
import { LoginPage } from "@/pages/Login";
import { DashboardPage } from "@/pages/Dashboard";
import { PatientsPage } from "@/pages/Patients";
import { DoctorsPage } from "@/pages/Doctors";
import { AppointmentsPage } from "@/pages/Appointments";
import { PrescriptionsPage } from "@/pages/Prescriptions";
import { BillingPage } from "@/pages/Billing";
import { SettingsPage } from "@/pages/Settings";
import { seedDemoDataIfEmpty } from "@/store/seed";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "sonner";

export function App() {
  useEffect(() => {
    seedDemoDataIfEmpty();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <RequireAuth>
                <Layout>
                  <DashboardPage />
                </Layout>
              </RequireAuth>
            }
          />

          <Route
            path="/patients"
            element={
              <RequireAuth>
                <Layout>
                  <RequireCan action="patient.view">
                    <PatientsPage />
                  </RequireCan>
                </Layout>
              </RequireAuth>
            }
          />

          <Route
            path="/doctors"
            element={
              <RequireAuth>
                <Layout>
                  <RequireCan action="doctor.view">
                    <DoctorsPage />
                  </RequireCan>
                </Layout>
              </RequireAuth>
            }
          />

          <Route
            path="/appointments"
            element={
              <RequireAuth>
                <Layout>
                  <RequireCan action="appointment.view">
                    <AppointmentsPage />
                  </RequireCan>
                </Layout>
              </RequireAuth>
            }
          />

          <Route
            path="/prescriptions"
            element={
              <RequireAuth>
                <Layout>
                  <RequireCan action="prescription.view">
                    <PrescriptionsPage />
                  </RequireCan>
                </Layout>
              </RequireAuth>
            }
          />

          <Route
            path="/billing"
            element={
              <RequireAuth>
                <Layout>
                  <RequireCan action="bill.view">
                    <BillingPage />
                  </RequireCan>
                </Layout>
              </RequireAuth>
            }
          />

          <Route
            path="/settings"
            element={
              <RequireAuth>
                <Layout>
                  <SettingsPage />
                </Layout>
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
