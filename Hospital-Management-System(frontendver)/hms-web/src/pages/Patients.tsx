import { useState } from "react";
import { usePatients } from "@/store/patients";
import { useSession } from "@/store/session";
import { can } from "@/lib/permissions";
import { type ColumnDef } from "@tanstack/react-table";
import type { Patient, BloodGroup } from "@/lib/types";
import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2 } from "lucide-react";
import { toast } from "sonner";

export function PatientsPage() {
  const { patients, addPatient, updatePatient, getNextId } = usePatients();
  const { user } = useSession();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: 30,
    contact: "",
    address: "",
    bloodGroup: "O+" as BloodGroup,
    medicalHistory: "None",
  });

  const canEdit = can(user?.role, "patient.edit");

  const handleOpenAdd = () => {
    setEditingPatient(null);
    setFormData({
      name: "",
      age: 30,
      contact: "",
      address: "",
      bloodGroup: "O+",
      medicalHistory: "None",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Patient) => {
    setEditingPatient(p);
    setFormData({
      name: p.name,
      age: p.age,
      contact: p.contact,
      address: p.address,
      bloodGroup: p.bloodGroup,
      medicalHistory: p.medicalHistory,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact.trim()) {
      toast.error("Please fill in required fields.");
      return;
    }

    if (editingPatient) {
      updatePatient(editingPatient.id, formData);
      toast.success(`Patient ${editingPatient.id} updated successfully.`);
    } else {
      const created = addPatient(formData);
      toast.success(`Patient registered with ID: ${created.id}`);
    }
    setModalOpen(false);
  };

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "id",
      header: "Patient ID",
      cell: ({ row }) => <span className="font-mono font-medium">{row.original.id}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-semibold text-zinc-900 dark:text-zinc-100">{row.original.name}</span>,
    },
    {
      accessorKey: "age",
      header: "Age",
    },
    {
      accessorKey: "contact",
      header: "Contact",
    },
    {
      accessorKey: "bloodGroup",
      header: "Blood Group",
      cell: ({ row }) => <Badge variant="outline">{row.original.bloodGroup}</Badge>,
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <span className="truncate max-w-[200px] inline-block" title={row.original.address}>
          {row.original.address || "-"}
        </span>
      ),
    },
    {
      accessorKey: "medicalHistory",
      header: "Medical History",
      cell: ({ row }) => (
        <span className="truncate max-w-[150px] inline-block text-xs text-zinc-500">
          {row.original.medicalHistory}
        </span>
      ),
    },
  ];

  if (canEdit) {
    columns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => handleOpenEdit(row.original)}
        >
          <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
        </Button>
      ),
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients Management"
        description="Register, search and review patient clinical profiles"
      >
        {canEdit && (
          <Button onClick={handleOpenAdd} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add Patient
          </Button>
        )}
      </PageHeader>

      <DataTable columns={columns} data={patients} searchPlaceholder="Search patients..." />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPatient ? `Edit Patient (${editingPatient.id})` : `Add New Patient`}
        description={
          editingPatient
            ? "Update existing patient details"
            : `Next auto-assigned Patient ID will be: ${getNextId()}`
        }
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Full Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ramesh Patel"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Age *</label>
              <Input
                type="number"
                min="1"
                max="130"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Blood Group</label>
              <select
                className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1 text-sm shadow-sm"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
              >
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Contact Number *</label>
            <Input
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="10-digit phone number"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Residential Address</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Address / City"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Medical History / Allergies</label>
            <textarea
              className="flex w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 text-sm shadow-sm"
              rows={3}
              value={formData.medicalHistory}
              onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
              placeholder="Past illnesses, conditions, allergies..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {editingPatient ? "Save Changes" : "Register Patient"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

