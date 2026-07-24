import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import AdminAppointmentsTable from '../components/admin-appointments-table';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export default async function AdminAppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    include: {
      patient: true,
      statusHistory: {
        orderBy: {
          changedAt: 'desc',
        },
      },
      insuranceDocuments: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="min-h-screen bg-ivory px-6 py-12 text-forest sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-sand bg-white p-8 shadow-soft">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sage">Admin</p>
            <h1 className="mt-3 text-3xl font-semibold text-forest">Appointment List</h1>
            <p className="mt-2 text-sm text-forest/70">Local development admin access is enabled for this workspace. No Google login is required.</p>
          </div>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-forest/20 bg-white px-4 py-2 text-sm font-semibold text-forest transition hover:border-forest hover:bg-forest/5"
          >
            Back to Site
          </a>
        </div>

        <AdminAppointmentsTable appointments={appointments} />

        {appointments.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-sand/60 px-4 py-3 text-sm text-forest/80">No appointments have been submitted yet.</p>
        ) : null}
      </div>
    </main>
  );
}
