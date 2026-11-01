import { useState } from "react";
import { useBills } from "@/store/bills";
import { usePatients } from "@/store/patients";
import { useDoctors } from "@/store/doctors";
import { useSession } from "@/store/session";
import { can } from "@/lib/permissions";
import { type ColumnDef } from "@tanstack/react-table";
import type { Bill } from "@/lib/types";
import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function BillingPage() {
  const { bills, addBill, markPaid, getNextId } = useBills();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const { user } = useSession();

  const [modalOpen, setModalOpen] = useState(false);
  const [payTargetId, setPayTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    patientId: "",
    amount: 500,
    description: "Consultation / Treatment Fee",
  });

  const canManage = can(user?.role, "bill.manage");

  const handleOpenAdd = () => {
    const defaultDoctor = doctors[0];
    setFormData({
      patientId: patients[0]?.id || "",
      amount: defaultDoctor ? defaultDoctor.consultationFee : 500,
      description: defaultDoctor
        ? `${defaultDoctor.specialization} Consultation`
        : "Consultation / Treatment Fee",
    });
    setModalOpen(true);
  };

  const handleDoctorPrefill = (docId: string) => {
    const doc = doctors.find((d) => d.id === docId);
    if (doc) {
      setFormData((prev) => ({
        ...prev,
        amount: doc.consultationFee,
        description: `Dr. ${doc.name} (${doc.specialization}) Consultation`,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId) {
      toast.error("Please select a patient.");
      return;
    }

    const created = addBill({
      patientId: formData.patientId,
      amount: formData.amount,
      description: formData.description,
      paymentStatus: "Pending",
    });

    toast.success(`Bill generated with ID: ${created.id}`);
    setModalOpen(false);
  };

  const handleConfirmPay = () => {
    if (payTargetId) {
      markPaid(payTargetId);
      toast.success(`Bill ${payTargetId} marked as Paid!`);
      setPayTargetId(null);
    }
  };

  const columns: ColumnDef<Bill>[] = [
    {
      accessorKey: "id",
      header: "Bill ID",
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
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-zinc-700 dark:text-zinc-300 font-medium">
          {row.original.description}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
          {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
            row.original.amount
          )}
        </span>
      ),
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment Status",
      cell: ({ row }) => <StatusBadge status={row.original.paymentStatus} />,
    },
  ];

  if (canManage) {
    columns.push({
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const b = row.original;
        if (b.paymentStatus === "Paid") return null;

        return (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs text-emerald-600 hover:text-emerald-700"
            onClick={() => setPayTargetId(b.id)}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Paid
          </Button>
        );
      },
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Invoicing"
        description="Generate patient medical invoices, collect fees and monitor settlement statuses"
      >
        {canManage && (
          <Button onClick={handleOpenAdd} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Generate Bill
          </Button>
        )}
      </PageHeader>

      <DataTable columns={columns} data={bills} searchPlaceholder="Search invoices..." />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Generate Invoice"
        description={`Next Invoice ID will be: ${getNextId()}`}
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
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Quick autofill by Doctor fee (optional)
            </label>
            <select
              className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1 text-sm shadow-sm"
              onChange={(e) => handleDoctorPrefill(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                -- Choose doctor to prefill consultation fee --
              </option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.name} ({d.specialization} - ₹{d.consultationFee})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Invoice Description *</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Cardiology OPD & Lab tests"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Total Amount (INR) *</label>
            <Input
              type="number"
              min="0"
              step="50"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Invoice
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(payTargetId)}
        title="Receive Payment"
        description="Confirm that the patient has completed the payment for this bill? It will be marked as Paid."
        variant="default"
        confirmLabel="Confirm Payment"
        onConfirm={handleConfirmPay}
        onCancel={() => setPayTargetId(null)}
      />
    </div>
  );
}

