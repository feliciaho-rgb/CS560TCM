import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../generated/prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const appointmentId = Number(id);
    const { status } = await request.json();

    if (!appointmentId || Number.isNaN(appointmentId)) {
      return NextResponse.json({ error: 'Invalid appointment id.' }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: { status: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 });
    }

    const nextStatus = typeof status === 'string' ? status : appointment.status;

    const updatedAppointment = await prisma.$transaction(async (tx) => {
      const updated = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: nextStatus },
      });

      await tx.appointmentStatusHistory.create({
        data: {
          appointmentId,
          oldStatus: appointment.status,
          newStatus: nextStatus,
        },
      });

      return updated;
    });

    return NextResponse.json({ appointment: updatedAppointment }, { status: 200 });
  } catch (error) {
    console.error('Appointment status update error:', error);
    return NextResponse.json(
      { error: 'Unable to update appointment status right now.' },
      { status: 500 }
    );
  }
}
