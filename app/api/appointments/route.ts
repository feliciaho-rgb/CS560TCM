import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export async function GET() {
  try {
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

    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    console.error('Appointments list error:', error);
    return NextResponse.json(
      { error: 'Unable to load appointments right now.' },
      { status: 500 }
    );
  }
}
