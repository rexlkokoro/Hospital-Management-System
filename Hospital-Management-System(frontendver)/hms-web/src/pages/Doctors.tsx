import { useState } from "react";
import { useDoctors } from "@/store/doctors";
import { useSession } from "@/store/session";
import { can } from "@/lib/permissions";
import { type ColumnDef } from "@tanstack/react-table";
import type { Doctor } from "@/lib/types";
import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Plus, Edit2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export function DoctorsPage() {
  const { doctors, addDoctor, updateDoctor, toggleAvailable, getNextId } = useDoctors();
  const { user } = useSession();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: 40,
    contact: "",
    specialization: "",
    consultationFee: 500,
    available: true,
  });

  const canEdit = can(user?.role, "doctor.edit");

  const handleOpenAdd = () => {
    setEditingDoctor(null);
    setFormData({
      name: "",
      age: 40,
      contact: "",
      specialization: "",
      consultationFee: 500,
      available: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (d: Doctor) => {
    setEditingDoctor(d);
    setFormData({
      name: d.name,
      age: d.age,
      contact: d.contact,
      specialization: d.specialization,
      consultationFee: d.consultationFee,
      available: d.available,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.specialization.trim()) {
      toast.error("Please fill in required fields.");
      return;
    }

    if (editingDoctor) {
      updateDoctor(editingDoctor.id, formData);
      toast.success(`Doctor ${editingDoctor.id} updated successfully.`);
    } else {
      const created = addDoctor(formData);
      toast.success(`Doctor registered with ID: ${created.id}`);
    }
    setModalOpen(false);
  };

  const columns: ColumnDef<Doctor>[] = [
    {
      accessorKey: "id",
      header: "Doctor ID",
      cell: ({ row }) => <span className="font-mono font-medium">{row.original.id}</span>,
    },
    {
      accessorKey: "name",
      header: "Doctor Name",
      cell: ({ row }) => (
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          Dr. {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "specialization",
      header: "Specialization",
      cell: ({ row }) => (
        <span className="text-zinc-700 dark:text-zinc-300 font-medium">
          {row.original.specialization}
        </span>
      ),
    },
    {
      accessorKey: "consultationFee",
      header: "Fee",
      cell: ({ row }) => (
        <span className="font-mono">
          {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
            row.original.consultationFee
          )}
        </span>
      ),
    },
    {
      accessorKey: "contact",
      header: "Contact",
    },
    {
      accessorKey: "available",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.available ? "Available" : "Unavailable"} />
      ),
    },
  ];

  if (canEdit) {
    columns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              toggleAvailable(row.original.id);
              toast.info(
                `Dr. ${row.original.name} is now ${
                  !row.original.available ? "Available" : "Unavailable"
                }`
              );
            }}
          >
            {row.original.available ? (
              <>
                <XCircle className="w-3.5 h-3.5 mr-1 text-red-500" /> Mark Off
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Mark Active
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={() => handleOpenEdit(row.original)}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors Directory"
        description="View medical specialists, consultation fees and real-time availability"
      >
        {canEdit && (
          <Button onClick={handleOpenAdd} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add Doctor
          </Button>
        )}
      </PageHeader>

      <DataTable columns={columns} data={doctors} searchPlaceholder="Search doctors or specialty..." />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDoctor ? `Edit Doctor (${editingDoctor.id})` : `Add New Doctor`}
        description={
          editingDoctor
            ? "Update specialist information and consultation fee"
            : `Next auto-assigned Doctor ID will be: ${getNextId()}`
        }
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Doctor Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Priya Sharma"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Specialization *</label>
            <Input
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g. Cardiologist, Neurologist..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Age</label>
              <Input
                type="number"
                min="20"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Consultation Fee (INR) *</label>
              <Input
                type="number"
                min="0"
                step="50"
                value={formData.consultationFee}
                onChange={(e) =>
                  setFormData({ ...formData, consultationFee: parseFloat(e.target.value) || 0 })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Contact Number</label>
            <Input
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="10-digit phone number"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="available-check"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="rounded border-zinc-300"
            />
            <label htmlFor="available-check" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Doctor is currently available for appointments
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {editingDoctor ? "Save Changes" : "Register Doctor"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

