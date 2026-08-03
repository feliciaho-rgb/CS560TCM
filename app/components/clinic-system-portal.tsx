'use client';

import Link from 'next/link';
import { useState } from 'react';
import AdminAppointmentsTable from './admin-appointments-table';
import ClinicSystemAuth from './clinic-system-auth';
import PatientManagementPanel from './patient-management-panel';

type Appointment = {
  id: number;
  appointmentType: string;
  subject: string;
  location: string;
  appointmentDate: Date | string;
  appointmentTime: string;
  status: string;
  submittedAt: Date | string;
  patient: {
    firstName: string;
    lastName: string;
    email: string;
    middleName?: string | null;
    cellPhone?: string | null;
    dob?: Date | string | null;
    createdAt?: Date | string;
  };
};

export default function ClinicSystemPortal({ appointments }: { appointments: Appointment[] }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-sand bg-white p-6 shadow-soft">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sage">Clinic Office Administration</p>
          <h1 className="mt-3 text-3xl font-semibold text-forest">Secure management portal</h1>
          <p className="mt-2 text-sm leading-7 text-forest/70">Access billing, appointments, staff tools, and operational workflows from one protected hub.</p>
        </div>
        <Link href="/" className="inline-flex items-center justify-center rounded-full border border-forest/20 bg-white px-4 py-2 text-sm font-semibold text-forest transition hover:border-forest hover:bg-forest/5">
          Back to home
        </Link>
      </div>

      <ClinicSystemAuth onAuthStateChange={setIsSignedIn} />

      {isSignedIn ? (
        <>
          <section className="rounded-[2rem] border border-sand bg-white p-8 shadow-soft">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sage">Appointment Management</p>
                <h2 className="mt-3 text-3xl font-semibold text-forest">Booked appointments and requests</h2>
                <p className="mt-2 text-sm leading-7 text-forest/70">Appointment bookings submitted from the site now appear here for staff review and status updates.</p>
              </div>
              <Link href="/admin" className="inline-flex items-center justify-center rounded-full border border-forest/20 bg-white px-4 py-2 text-sm font-semibold text-forest transition hover:border-forest hover:bg-forest/5">
                Open full admin view
              </Link>
            </div>

            <div className="mt-8">
              <AdminAppointmentsTable appointments={appointments} />
            </div>
          </section>

          <PatientManagementPanel />
        </>
      ) : (
        <section className="rounded-[2rem] border border-sand bg-white p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sage">Access Required</p>
          <h2 className="mt-3 text-3xl font-semibold text-forest">Please log in to access management tools</h2>
          <p className="mt-2 text-sm leading-7 text-forest/70">You can use Google, your email address and password, or face recognition to unlock the administration portal.</p>
        </section>
      )}
    </div>
  );
}
