import { useState } from "react";
import { usePrescriptions } from "@/store/prescriptions";
import { usePatients } from "@/store/patients";
import { useDoctors } from "@/store/doctors";
import { useSession } from "@/store/session";
import { can } from "@/lib/permissions";
import { type ColumnDef } from "@tanstack/react-table";
import type { Prescription } from "@/lib/types";
import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Plus, Printer } from "lucide-react";
import { toast } from "sonner";

export function PrescriptionsPage() {
  const { prescriptions, addPrescription, getNextId } = usePrescriptions();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const { user } = useSession();

  const [modalOpen, setModalOpen] = useState(false);
  const [printTarget, setPrintTarget] = useState<Prescription | null>(null);

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    medicine: "",
    dosage: "",
    duration: "",
  });

  const canAdd = can(user?.role, "prescription.add");

  const handleOpenAdd = () => {
    setFormData({
      patientId: patients[0]?.id || "",
      doctorId: doctors[0]?.id || "",
      medicine: "",
      dosage: "",
      duration: "",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.medicine.trim() || !formData.dosage.trim()) {
      toast.error("Please fill in medication details.");
      return;
    }

    const created = addPrescription(formData);
    toast.success(`Prescription issued with ID: ${created.id}`);
    setModalOpen(false);
  };

  const handlePrint = (rx: Prescription) => {
    setPrintTarget(rx);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const columns: ColumnDef<Prescription>[] = [
    {
      accessorKey: "id",
      header: "Rx ID",
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
      header: "Prescribing Doctor",
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
      accessorKey: "medicine",
      header: "Medication",
      cell: ({ row }) => (
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {row.original.medicine}
        </span>
      ),
    },
    {
      accessorKey: "dosage",
      header: "Dosage",
    },
    {
      accessorKey: "duration",
      header: "Duration",
    },
    {
      id: "actions",
      header: "Print",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => handlePrint(row.original)}
        >
          <Printer className="w-4 h-4 mr-1 text-zinc-600" /> Print
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prescriptions Management"
        description="Issue medical prescriptions, clinical dosages and print official pharmacy slips"
      >
        {canAdd && (
          <Button onClick={handleOpenAdd} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add Prescription
          </Button>
        )}
      </PageHeader>

      <DataTable columns={columns} data={prescriptions} searchPlaceholder="Search prescriptions or medicines..." />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Issue Prescription"
        description={`Next Prescription ID will be: ${getNextId()}`}
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
                  {p.name} (ID: {p.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Doctor *</label>
            <select
              className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1 text-sm shadow-sm"
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              required
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.name} ({d.specialization})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Medicine & Formulation *</label>
            <Input
              value={formData.medicine}
              onChange={(e) => setFormData({ ...formData, medicine: e.target.value })}
              placeholder="e.g. Paracetamol 650mg, Amoxicillin 500mg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Dosage Instructions *</label>
              <Input
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g. Twice daily after meals"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Duration *</label>
              <Input
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 5 days, 1 month"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Prescription
            </Button>
          </div>
        </form>
      </Modal>

      {/* Hidden Print Slip */}
      {printTarget && (
        <div id="print-slip" className="hidden print:block p-8 font-sans max-w-xl mx-auto">
          <div className="border-b-2 border-zinc-900 pb-4 mb-6">
            <h1 className="text-xl font-bold uppercase tracking-wider">Hospital Management System</h1>
            <p className="text-xs text-zinc-600">Official Medical Prescription</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs mb-6">
            <div>
              <p><strong>Prescription ID:</strong> {printTarget.id}</p>
              <p>
                <strong>Patient:</strong>{" "}
                {patients.find((p) => p.id === printTarget.patientId)?.name} (ID: {printTarget.patientId})
              </p>
            </div>
            <div>
              <p>
                <strong>Doctor:</strong> Dr.{" "}
                {doctors.find((d) => d.id === printTarget.doctorId)?.name}
              </p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="border border-zinc-300 rounded p-4 mb-8">
            <h3 className="font-bold text-sm mb-2">Rx Medication Details:</h3>
            <p className="text-sm font-semibold">{printTarget.medicine}</p>
            <p className="text-xs text-zinc-700 mt-1">Dosage: {printTarget.dosage}</p>
            <p className="text-xs text-zinc-700">Course Duration: {printTarget.duration}</p>
          </div>
          <div className="mt-12 flex justify-between items-end text-xs">
            <div>Generated via HMS Portal</div>
            <div className="border-t border-zinc-400 pt-1 w-48 text-center">Doctor's Signature</div>
          </div>
        </div>
      )}
    </div>
  );
}

