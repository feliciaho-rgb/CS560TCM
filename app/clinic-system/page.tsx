import { PrismaPg } from '@prisma/adapter-pg';
import ClinicSystemPortal from '../components/clinic-system-portal';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export default async function ClinicSystemPage() {
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
      <ClinicSystemPortal appointments={appointments} />
    </main>
  );
}
