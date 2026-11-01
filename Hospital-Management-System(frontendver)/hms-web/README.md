# HMS Web (Hospital Management System)

A web frontend for the Hospital Management System built with React, TypeScript, Tailwind CSS, Zustand, and TanStack Table. Persists entirely to `localStorage`.

---

## Features

- **Role-Based Access Control (RBAC):** Admin, Doctor, and Receptionist roles with specific action permissions.
- **Auto-Incrementing IDs:** Automatic ID generation matching the C++ HMS conventions (`250001+` for Patients, `D101+` for Doctors, `A1001+` for Appointments, `RX1001+` for Prescriptions, `B1001+` for Bills).
- **Patient Management:** Full CRUD/editing, medical history tracking, and contact details.
- **Doctor Directory & Scheduling:** Doctor specialization, consultation fee, and real-time availability toggle.
- **Appointment Scheduling:** Conflict detection preventing double-booking of a doctor at the same date and time.
- **Prescription System:** Medication formulation, dosage, course duration, and a printable slip.
- **Billing & Invoices:** Consultation and treatment invoicing, fee pre-filling, and payment settlements.
- **Data Tools:** JSON data backup, export, and restore, plus a one-click database reset with default Indian mock data.
- **Dark Mode:** Built-in theme switcher with persistent preference.

---

## Demo Credentials

| Role | Username | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Full access across all modules and settings |
| **Doctor** | `doctor` | `doc123` | Patient View, Doctor View, Appointment View, Prescription View & Add |
| **Receptionist** | `reception` | `rec123` | Patient Add & Edit, Doctor View, Appointment Booking & Cancel, Invoicing |

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
npm run preview
```
