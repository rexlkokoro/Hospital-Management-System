import { useState } from "react";
import { useAppointments } from "@/store/appointments";
import { usePatients } from "@/store/patients";
import { useDoctors } from "@/store/doctors";
import { useSession } from "@/store/session";
import { can } from "@/lib/permissions";
import { type ColumnDef } from "@tanstack/react-table";
import type { Appointment } from "@/lib/types";
import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Plus, Check, X } from "lucide-react";
import { toast } from "sonner";

export function AppointmentsPage() {
  const { appointments, addAppointment, setStatus, getNextId } = useAppointments();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const { user } = useSession();

  const [modalOpen, setModalOpen] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
  });

  const canManage = can(user?.role, "appointment.manage");

  const handleOpenAdd = () => {
    setFormData({
      patientId: patients[0]?.id || "",
      doctorId: doctors.find((d) => d.available)?.id || doctors[0]?.id || "",
      date: new Date().toISOString().split("T")[0],
      time: "10:00",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patientId || !formData.doctorId) {
      toast.error("Please select a valid patient and doctor.");
      return;
    }

    const doc = doctors.find((d) => d.id === formData.doctorId);
    if (!doc) {
      toast.error("Selected doctor does not exist.");
      return;
    }
    if (!doc.available) {
      toast.error(`Dr. ${doc.name} is currently marked unavailable.`);
      return;
    }

    // Double booking check: same doctor, same date, same time and not cancelled
    const conflict = appointments.find(
      (a) =>
        a.doctorId === formData.doctorId &&
        a.date === formData.date &&
        a.time === formData.time &&
        a.status !== "Cancelled"
    );

    if (conflict) {
      toast.error(`Slot already booked with Dr. ${doc.name} at ${formData.date} ${formData.time}`);
      return;
    }

    const created = addAppointment({
      patientId: formData.patientId,
      doctorId: formData.doctorId,
      date: formData.date,
      time: formData.time,
      status: "Scheduled",
    });

    toast.success(`Appointment booked (${created.id})`);
    setModalOpen(false);
  };

  const handleConfirmCancel = () => {
    if (cancelTargetId) {
      setStatus(cancelTargetId, "Cancelled");
      toast.info(`Appointment ${cancelTargetId} cancelled.`);
      setCancelTargetId(null);
    }
  };

  const columns: ColumnDef<Appointment>[] = [
    {
      accessorKey: "id",
      header: "Appt ID",
      cell: ({ row }) => <span className="font-mono font-medium">{row.original.id}</span>,
    },
    {
      accessorKey: "patientId",
      header: "Patient",
      cell: ({ row }) => {
        const p = patients.find((pat) => pat.id === row.original.patientId);
        return (
          <div>
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">
              {p ? p.name : "Unknown"}
            </div>
            <div className="text-xs text-zinc-500 font-mono">ID: {row.original.patientId}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "doctorId",
      header: "Doctor",
      cell: ({ row }) => {
        const d = doctors.find((doc) => doc.id === row.original.doctorId);
        return (
          <div>
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">
              {d ? `Dr. ${d.name}` : "Unknown"}
            </div>
            <div className="text-xs text-zinc-500">{d?.specialization}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date & Time",
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.date} at {row.original.time}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];

  if (canManage) {
    columns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const a = row.original;
        if (a.status !== "Scheduled") return null;

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs text-emerald-600 hover:text-emerald-700"
              onClick={() => {
                setStatus(a.id, "Completed");
                toast.success(`Appointment ${a.id} marked as Completed.`);
              }}
            >
              <Check className="w-3.5 h-3.5 mr-1" /> Complete
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs text-red-600 hover:text-red-700"
              onClick={() => setCancelTargetId(a.id)}
            >
              <X className="w-3.5 h-3.5 mr-1" /> Cancel
            </Button>
          </div>
        );
      },
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments Scheduling"
        description="Book consultations, manage schedule queues and detect booking conflicts"
      >
        {canManage && (
          <Button onClick={handleOpenAdd} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Book Appointment
          </Button>
        )}
      </PageHeader>

      <DataTable columns={columns} data={appointments} searchPlaceholder="Search appointments..." />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule Appointment"
        description={`Next Appointment ID will be: ${getNextId()}`}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Select Patient *</label>
            <select
              className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1 text-sm shadow-sm"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (ID: {p.id}) - {p.contact}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Select Doctor *</label>
            <select
              className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1 text-sm shadow-sm"
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              required
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id} disabled={!d.available}>
                  Dr. {d.name} ({d.specialization}) - {d.available ? "Available" : "Unavailable"}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Date *</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Time *</label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(cancelTargetId)}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action frees the doctor's time slot."
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelTargetId(null)}
      />
    </div>
  );
}

