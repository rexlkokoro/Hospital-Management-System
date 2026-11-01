import { usePatients } from "@/store/patients";
import { useDoctors } from "@/store/doctors";
import { useAppointments } from "@/store/appointments";
import { useBills } from "@/store/bills";
import { useSession } from "@/store/session";
import { can } from "@/lib/permissions";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Users, UserCheck, Calendar, CreditCard, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const { appointments } = useAppointments();
  const { bills } = useBills();
  const { user } = useSession();

  const activeDoctors = doctors.filter((d) => d.available).length;
  const scheduledAppointments = appointments.filter((a) => a.status === "Scheduled").length;

  const pendingBills = bills.filter((b) => b.paymentStatus === "Pending");
  const pendingTotal = pendingBills.reduce((acc, curr) => acc + curr.amount, 0);

  const upcomingAppts = appointments
    .filter((a) => a.status === "Scheduled")
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.username}`}
        description="Overview of hospital patient flow, active specialist doctors, and clinic operations"
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {can(user?.role, "patient.view") && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Total Patients
              </CardTitle>
              <Users className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
              <p className="text-xs text-zinc-500 mt-1">Registered health records</p>
            </CardContent>
          </Card>
        )}

        {can(user?.role, "doctor.view") && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Available Doctors
              </CardTitle>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeDoctors} <span className="text-xs font-normal text-zinc-500">/ {doctors.length}</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">Currently on duty</p>
            </CardContent>
          </Card>
        )}

        {can(user?.role, "appointment.view") && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Scheduled Appts
              </CardTitle>
              <Calendar className="w-4 h-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledAppointments}</div>
              <p className="text-xs text-zinc-500 mt-1">Pending consultations</p>
            </CardContent>
          </Card>
        )}

        {can(user?.role, "bill.view") && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Pending Dues
              </CardTitle>
              <CreditCard className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">
                {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
                  pendingTotal
                )}
              </div>
              <p className="text-xs text-zinc-500 mt-1">{pendingBills.length} unpaid invoice(s)</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upcoming Consultations Table */}
      {can(user?.role, "appointment.view") && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base">Upcoming Appointments Queue</CardTitle>
              <p className="text-xs text-zinc-500 mt-0.5">Next scheduled patient visits</p>
            </div>
            <Link to="/appointments" className="text-xs font-semibold text-blue-600 hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingAppts.length > 0 ? (
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {upcomingAppts.map((appt) => {
                  const patient = patients.find((p) => p.id === appt.patientId);
                  const doctor = doctors.find((d) => d.id === appt.doctorId);
                  return (
                    <div
                      key={appt.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {patient?.name?.charAt(0) || "P"}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {patient?.name || "Unknown Patient"}
                          </div>
                          <div className="text-xs text-zinc-500">
                            Consulting Dr. {doctor?.name || "Unknown"} ({doctor?.specialization})
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono">
                        <span className="flex items-center gap-1 text-zinc-500">
                          <Clock className="w-3.5 h-3.5" /> {appt.date} at {appt.time}
                        </span>
                        <StatusBadge status={appt.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-zinc-400">
                No scheduled consultations upcoming today.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

