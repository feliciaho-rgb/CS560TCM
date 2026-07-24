import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

type AppointmentPayload = {
  firstName: string;
  middleName?: string;
  lastName: string;
  cell: string;
  email: string;
  appointmentType: string;
  subject: string;
  date: string;
  time: string;
  location: string;
  dob?: string;
  insuranceFront?: File | string;
  insuranceBack?: File | string;
};

type AttachmentFile = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

const getStringValue = (value: FormDataEntryValue | null | undefined) => {
  if (typeof value === 'string') {
    return value;
  }

  return '';
};

const normalizePayload = (
  payload: Record<string, FormDataEntryValue | null | undefined>
): AppointmentPayload => ({
  firstName: getStringValue(payload.firstName),
  middleName: getStringValue(payload.middleName),
  lastName: getStringValue(payload.lastName),
  cell: getStringValue(payload.cell),
  email: getStringValue(payload.email),
  appointmentType: getStringValue(payload.appointmentType),
  subject: getStringValue(payload.subject),
  date: getStringValue(payload.date),
  time: getStringValue(payload.time),
  location: getStringValue(payload.location),
  dob: getStringValue(payload.dob),
  insuranceFront: payload.insuranceFront instanceof File ? payload.insuranceFront : undefined,
  insuranceBack: payload.insuranceBack instanceof File ? payload.insuranceBack : undefined,
});

const validatePayload = (payload: AppointmentPayload) => {
  const errors: Record<string, string> = {};
  const hasInsuranceCard = payload.insuranceFront instanceof File || payload.insuranceBack instanceof File;

  if (!payload.firstName?.trim() || payload.firstName.trim().length < 2) {
    errors.firstName = 'Please enter your first name.';
  }

  if (!payload.lastName?.trim() || payload.lastName.trim().length < 2) {
    errors.lastName = 'Please enter your last name.';
  }

  if (!/^[0-9()+\-\s]{7,}$/.test(payload.cell?.trim() || '')) {
    errors.cell = 'Please enter a valid cell phone number.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email?.trim() || '')) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!payload.appointmentType?.trim()) {
    errors.appointmentType = 'Please select an appointment type.';
  }

  if (!payload.subject?.trim()) {
    errors.subject = 'Please select a consultation subject.';
  }

  if (!payload.date?.trim()) {
    errors.date = 'Please select a date.';
  } else {
    const dateValue = new Date(`${payload.date}T00:00:00`);
    if (Number.isNaN(dateValue.getTime()) || dateValue.getDay() === 0 || dateValue.getDay() === 6) {
      errors.date = 'Appointments are available on weekdays only.';
    }
  }

  if (!payload.time?.trim()) {
    errors.time = 'Please select a time.';
  }

  if (!payload.location?.trim()) {
    errors.location = 'Please select a location.';
  }

  if (hasInsuranceCard && !payload.dob?.trim()) {
    errors.dob = 'Date of birth is required when an insurance card is submitted.';
  }

  if (payload.dob?.trim()) {
    const dobValue = new Date(`${payload.dob}T00:00:00`);
    if (Number.isNaN(dobValue.getTime())) {
      errors.dob = 'Please enter a valid date of birth.';
    }
  }

  return errors;
};

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const isMultipart = contentType.includes('multipart/form-data');
    const formData = isMultipart ? await request.formData() : null;
    const payload = isMultipart
      ? normalizePayload(Object.fromEntries(formData?.entries() ?? []))
      : ((await request.json()) as AppointmentPayload);

    const errors = validatePayload(payload);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    const patient = await prisma.patient.upsert({
      where: {
        email: payload.email.trim().toLowerCase(),
      },
      update: {
        firstName: payload.firstName.trim(),
        middleName: payload.middleName?.trim() || null,
        lastName: payload.lastName.trim(),
        cellPhone: payload.cell.trim(),
        dob: payload.dob ? new Date(`${payload.dob}T00:00:00`) : null,
      },
      create: {
        firstName: payload.firstName.trim(),
        middleName: payload.middleName?.trim() || null,
        lastName: payload.lastName.trim(),
        cellPhone: payload.cell.trim(),
        email: payload.email.trim().toLowerCase(),
        dob: payload.dob ? new Date(`${payload.dob}T00:00:00`) : null,
      },
    });

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        appointmentType: payload.appointmentType.trim(),
        subject: payload.subject.trim(),
        location: payload.location.trim(),
        appointmentDate: new Date(`${payload.date}T00:00:00`),
        appointmentTime: payload.time.trim(),
        status: 'pending',
      },
    });

    await prisma.appointmentStatusHistory.create({
      data: {
        appointmentId: appointment.id,
        oldStatus: null,
        newStatus: 'pending',
      },
    });

    if (isMultipart) {
      const frontFile = formData?.get('insuranceFront');
      const backFile = formData?.get('insuranceBack');

      for (const [index, file] of [frontFile, backFile].entries()) {
        if (file instanceof File) {
          await prisma.insuranceDocument.create({
            data: {
              appointmentId: appointment.id,
              documentType: index === 0 ? 'front' : 'back',
              fileName: file.name || 'insurance-card-upload',
              filePath: 'uploaded-via-form',
              fileType: file.type || 'application/octet-stream',
            },
          });
        }
      }
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM;
    const smtpTo = process.env.SMTP_TO;

    if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom || !smtpTo) {
      return NextResponse.json(
        { error: 'Mail server is not configured. Please set SMTP environment variables.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const attachments: AttachmentFile[] = [];

    if (isMultipart) {
      const frontFile = formData?.get('insuranceFront');
      const backFile = formData?.get('insuranceBack');

      for (const file of [frontFile, backFile]) {
        if (file instanceof File) {
          const buffer = Buffer.from(await file.arrayBuffer());
          attachments.push({
            filename: file.name || 'insurance-card-upload',
            content: buffer,
            contentType: file.type || 'application/octet-stream',
          });
        }
      }
    }

    await transporter.sendMail({
      from: smtpFrom,
      to: smtpTo,
      replyTo: payload.email,
      subject: `[Appointment Request] ${payload.appointmentType} - ${payload.subject}`,
      text: [
        `First Name: ${payload.firstName}`,
        `Middle Name: ${payload.middleName || ''}`,
        `Last Name: ${payload.lastName}`,
        `Cell: ${payload.cell}`,
        `Email: ${payload.email}`,
        `Appointment Type: ${payload.appointmentType}`,
        `Subject: ${payload.subject}`,
        `Date: ${payload.date}`,
        `Time: ${payload.time}`,
        `Location: ${payload.location}`,
        `DOB: ${payload.dob || ''}`,
      ].join('\n'),
      html: `
        <h3>New appointment request</h3>
        <p><strong>First Name:</strong> ${payload.firstName}</p>
        <p><strong>Middle Name:</strong> ${payload.middleName || ''}</p>
        <p><strong>Last Name:</strong> ${payload.lastName}</p>
        <p><strong>Cell:</strong> ${payload.cell}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Appointment Type:</strong> ${payload.appointmentType}</p>
        <p><strong>Subject:</strong> ${payload.subject}</p>
        <p><strong>Date:</strong> ${payload.date}</p>
        <p><strong>Time:</strong> ${payload.time}</p>
        <p><strong>Location:</strong> ${payload.location}</p>
        <p><strong>DOB:</strong> ${payload.dob || ''}</p>
      `,
      attachments,
    });

    return NextResponse.json({ message: 'Your appointment request has been submitted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Appointment form error:', error);
    return NextResponse.json(
      { error: 'Unable to submit your appointment request right now. Please try again later.' },
      { status: 500 }
    );
  }
}
