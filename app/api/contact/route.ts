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
  maritalStatus?: string;
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
  maritalStatus: getStringValue(payload.maritalStatus),
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

  if (payload.appointmentType?.trim() !== 'Telehealth' && !payload.location?.trim()) {
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

const isConfiguredSmtpValue = (value: string | undefined) => {
  if (!value) {
    return false;
  }

  const normalized = value.trim();

  if (!normalized) {
    return false;
  }

  return !/(YOUR_|your_|replace_with|example\.com|smtp\.example)/i.test(normalized);
};

const getFailureMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown server error';
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('database') || lowerMessage.includes('prisma') || lowerMessage.includes('connect') || lowerMessage.includes('econnrefused')) {
    return 'The appointment database is unavailable. Please check DATABASE_URL and the PostgreSQL service, then try again.';
  }

  if (lowerMessage.includes('smtp') || lowerMessage.includes('nodemailer') || lowerMessage.includes('authentication')) {
    return 'The appointment request was saved, but email notifications could not be sent. Please try again later.';
  }

  if (lowerMessage.includes('validation')) {
    return 'The appointment details could not be validated. Please review the form and try again.';
  }

  return `Unable to submit your appointment request right now. Details: ${message}`;
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

    const appointmentLocation = payload.appointmentType?.trim() === 'Telehealth' ? 'Online Visit' : payload.location.trim();

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        appointmentType: payload.appointmentType.trim(),
        subject: payload.subject.trim(),
        location: appointmentLocation,
        appointmentDate: new Date(`${payload.date}T00:00:00`),
        appointmentTime: payload.time.trim(),
        status: 'pending',
        submittedAt: new Date(),
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

    const smtpUser = (process.env.SMTP_USER || '').trim();
    const smtpPass = (process.env.SMTP_PASS || '').trim();
    const smtpHost = ((process.env.SMTP_HOST || '').trim() || (smtpUser.toLowerCase().endsWith('@wuc.edu') ? 'smtp.office365.com' : 'smtp.gmail.com')).trim();
    const smtpFrom = (process.env.SMTP_FROM || smtpUser || '').trim();
    const smtpTo = (process.env.SMTP_TO || smtpFrom || '').trim();
    const smtpConfigured = [smtpHost, smtpUser, smtpPass, smtpFrom, smtpTo].every(isConfiguredSmtpValue);

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

    if (smtpConfigured) {
      try {
        const smtpPort = Number(process.env.SMTP_PORT || 587);
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: false,
          requireTLS: true,
          tls: {
            ciphers: 'SSLv3',
          },
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

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
            `Location: ${payload.appointmentType?.trim() === 'Telehealth' ? 'Online Visit' : payload.location}`,
            `DOB: ${payload.dob || ''}`,
            `Marital Status: ${payload.maritalStatus || ''}`,
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
            <p><strong>Location:</strong> ${payload.appointmentType?.trim() === 'Telehealth' ? 'Online Visit' : payload.location}</p>
            <p><strong>DOB:</strong> ${payload.dob || ''}</p>
            <p><strong>Marital Status:</strong> ${payload.maritalStatus || ''}</p>
          `,
          attachments,
        });
      } catch (mailError) {
        console.error('Appointment email notification failed:', mailError);
      }
    }

    return NextResponse.json(
      {
        message: smtpConfigured
          ? 'Your appointment request has been submitted successfully.'
          : 'Your appointment request has been saved successfully. Email notifications are currently disabled because SMTP is not configured.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Appointment form error:', error);
    const message = getFailureMessage(error);

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
