import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { resetDemoData } from "@/store/seed";
import { usePatients } from "@/store/patients";
import { useDoctors } from "@/store/doctors";
import { useAppointments } from "@/store/appointments";
import { usePrescriptions } from "@/store/prescriptions";
import { useBills } from "@/store/bills";
import { RotateCcw, Download, Upload } from "lucide-react";
import { toast } from "sonner";

export function SettingsPage() {
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleReset = () => {
    resetDemoData();
    toast.success("Demo dataset has been reset to initial state.");
    setResetModalOpen(false);
  };

  const handleExport = () => {
    const data = {
      patients: usePatients.getState().patients,
      doctors: useDoctors.getState().doctors,
      appointments: useAppointments.getState().appointments,
      prescriptions: usePrescriptions.getState().prescriptions,
      bills: useBills.getState().bills,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hms-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Hospital database exported to JSON.");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.patients) usePatients.setState({ patients: json.patients });
        if (json.doctors) useDoctors.setState({ doctors: json.doctors });
        if (json.appointments) useAppointments.setState({ appointments: json.appointments });
        if (json.prescriptions) usePrescriptions.setState({ prescriptions: json.prescriptions });
        if (json.bills) useBills.setState({ bills: json.bills });
        toast.success("Dataset successfully imported!");
      } catch {
        toast.error("Invalid JSON format. Import aborted.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Settings & System Tools"
        description="Manage local storage persistence, backup datasets, or reset demonstration state"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Backup & Migration</CardTitle>
          <CardDescription className="text-xs">
            Export all hospital records as a single JSON file, or restore previously backed up states.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export JSON
          </Button>

          <label className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 h-8 rounded-md px-3 text-xs cursor-pointer">
            <Upload className="w-4 h-4 mr-2" /> Import JSON
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-900/50">
        <CardHeader>
          <CardTitle className="text-base text-red-600 dark:text-red-400">
            Reset Demo Database
          </CardTitle>
          <CardDescription className="text-xs">
            Clears all locally stored records and restores the pristine Indian mock dataset.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setResetModalOpen(true)}
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Reset to Demo Data
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={resetModalOpen}
        title="Reset Entire Database?"
        description="This will restore all default mock patients, doctors, appointments, prescriptions, and bills from scratch. Any newly added records will be replaced."
        confirmLabel="Yes, Reset Everything"
        onConfirm={handleReset}
        onCancel={() => setResetModalOpen(false)}
      />
    </div>
  );
}

