'use client';

import { useMemo, useState } from 'react';

type FormState = {
  firstName: string;
  middleName: string;
  lastName: string;
  cell: string;
  email: string;
  appointmentType: string;
  subject: string;
  date: string;
  time: string;
  location: string;
  dob: string;
  insuranceFront: File | null;
  insuranceBack: File | null;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

type StatusState = {
  type: 'success' | 'error' | null;
  message: string;
};

const initialForm: FormState = {
  firstName: '',
  middleName: '',
  lastName: '',
  cell: '',
  email: '',
  appointmentType: '',
  subject: '',
  date: '',
  time: '',
  location: '',
  dob: '',
  insuranceFront: null,
  insuranceBack: null,
};

const subjectOptions = [
  'Sport Injury',
  'Dermatitis Skin disorders',
  'Digestive Disorders',
  'Post-Stroke Recovery',
  'Prostate & Men’s Health',
  'Reproductive Optimization',
  'Other',
];

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<StatusState>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allowedTimes = useMemo(() => {
    if (form.location === 'Sunnyvale') {
      return [
        '12:30 PM',
        '1:00 PM',
        '1:30 PM',
        '2:00 PM',
        '2:30 PM',
        '3:00 PM',
        '3:30 PM',
        '4:00 PM',
        '4:30 PM',
        '5:00 PM',
        '5:30 PM',
        '6:00 PM',
        '6:30 PM',
      ];
    }

    if (form.location === 'Palo Alto') {
      return [
        '11:30 AM',
        '12:00 PM',
        '12:30 PM',
        '1:00 PM',
        '1:30 PM',
        '2:00 PM',
        '2:30 PM',
        '3:00 PM',
        '3:30 PM',
        '4:00 PM',
        '4:30 PM',
        '5:00 PM',
        '5:30 PM',
        '6:00 PM',
        '6:30 PM',
        '7:00 PM',
      ];
    }

    return [];
  }, [form.location]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    if (status.message) {
      setStatus({ type: null, message: '' });
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, files } = event.target;
    const nextFile = files?.[0] ?? null;
    setForm((current) => ({ ...current, [name]: nextFile }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    if (status.message) {
      setStatus({ type: null, message: '' });
    }
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    const dateValue = form.date ? new Date(`${form.date}T00:00:00`) : null;
    const hasInsuranceCard = Boolean(form.insuranceFront || form.insuranceBack);

    if (!form.firstName.trim() || form.firstName.trim().length < 2) {
      nextErrors.firstName = 'Please enter your first name.';
    }

    if (!form.lastName.trim() || form.lastName.trim().length < 2) {
      nextErrors.lastName = 'Please enter your last name.';
    }

    if (!/^[0-9()+\-\s]{7,}$/.test(form.cell.trim())) {
      nextErrors.cell = 'Please enter a valid cell phone number.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!form.appointmentType.trim()) {
      nextErrors.appointmentType = 'Please select an appointment type.';
    }

    if (!form.subject.trim()) {
      nextErrors.subject = 'Please select a consultation subject.';
    }

    if (!form.date.trim()) {
      nextErrors.date = 'Please select a date.';
    } else if (dateValue && (dateValue.getDay() === 0 || dateValue.getDay() === 6)) {
      nextErrors.date = 'Appointments are available on weekdays only.';
    }

    if (!form.time.trim()) {
      nextErrors.time = 'Please select a time.';
    }

    if (!form.location.trim()) {
      nextErrors.location = 'Please select a location.';
    }

    if (form.location === 'Sunnyvale' && form.date) {
      const day = new Date(`${form.date}T00:00:00`).getDay();
      if (day !== 1 && day !== 3) {
        nextErrors.date = 'Sunnyvale appointments are available on Monday and Wednesday only.';
      }
    }

    if (form.location === 'Palo Alto' && form.date) {
      const day = new Date(`${form.date}T00:00:00`).getDay();
      if (day !== 2 && day !== 5) {
        nextErrors.date = 'Palo Alto appointments are available on Tuesday and Friday only.';
      }
    }

    if (hasInsuranceCard && !form.dob.trim()) {
      nextErrors.dob = 'Date of birth is required when an insurance card is submitted.';
    }

    if (form.dob.trim()) {
      const dob = new Date(`${form.dob}T00:00:00`);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDifference = today.getMonth() - dob.getMonth();
      const dayDifference = today.getDate() - dob.getDate();
      const hasReachedAge = age > 0 || (age === 0 && monthDifference >= 0 && dayDifference >= 0);

      if (Number.isNaN(dob.getTime()) || !hasReachedAge) {
        nextErrors.dob = 'Please enter a valid date of birth.';
      }
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus({ type: 'error', message: 'Please fix the highlighted fields and try again.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'insuranceFront' || key === 'insuranceBack') {
          if (value instanceof File) {
            formData.append(key, value);
          }
          return;
        }

        formData.append(key, value as string);
      });

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unable to submit your appointment request right now.');
      }

      setStatus({
        type: 'success',
        message: result.message || 'Thanks! Your appointment request has been submitted.',
      });
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error.';
      setStatus({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border border-sand bg-ivory/90 p-8 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold text-forest">
            First Name <span className="text-red-600">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60"
          />
          {errors.firstName ? <p className="mt-2 text-sm text-red-600">{errors.firstName}</p> : null}
        </div>

        <div>
          <label htmlFor="middleName" className="block text-sm font-semibold text-forest">
            Middle Name (optional)
          </label>
          <input
            id="middleName"
            name="middleName"
            type="text"
            value={form.middleName}
            onChange={handleChange}
            className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold text-forest">
            Last Name <span className="text-red-600">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
            className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60"
          />
          {errors.lastName ? <p className="mt-2 text-sm text-red-600">{errors.lastName}</p> : null}
        </div>

        <div>
          <label htmlFor="cell" className="block text-sm font-semibold text-forest">
            Cell <span className="text-red-600">*</span>
          </label>
          <input
            id="cell"
            name="cell"
            type="tel"
            value={form.cell}
            onChange={handleChange}
            className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60"
          />
          {errors.cell ? <p className="mt-2 text-sm text-red-600">{errors.cell}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-forest">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60"
        />
        {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="appointmentType" className="block text-sm font-semibold text-forest">
            Appointment Type <span className="text-red-600">*</span>
          </label>
          <select
            id="appointmentType"
            name="appointmentType"
            value={form.appointmentType}
            onChange={handleChange}
            className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60"
          >
            <option value="">Select</option>
            <option value="New Patient Consultation">New Patient / Consultation</option>
            <option value="Follow Up Patient">Follow Up Patient</option>
            <option value="Cash Patient">Cash Patient</option>
          </select>
          {errors.appointmentType ? <p className="mt-2 text-sm text-red-600">{errors.appointmentType}</p> : null}
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-forest">
            Subjects <span className="text-red-600">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60"
          >
            <option value="">Select</option>
            {subjectOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.subject ? <p className="mt-2 text-sm text-red-600">{errors.subject}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-semibold text-forest">
          Location <span className="text-red-600">*</span>
        </label>
        <select
          id="location"
          name="location"
          value={form.location}
          onChange={(event) => {
            setForm((current) => ({ ...current, location: event.target.value, time: '' }));
            setErrors((current) => ({ ...current, location: undefined, time: undefined }));
            if (status.message) {
              setStatus({ type: null, message: '' });
            }
          }}
          className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60"
        >
          <option value="">Select</option>
          <option value="Sunnyvale">Sunnyvale</option>
          <option value="Palo Alto">Palo Alto</option>
        </select>
        {errors.location ? <p className="mt-2 text-sm text-red-600">{errors.location}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="date" className="block text-sm font-semibold text-forest">
            Date <span className="text-red-600">*</span>
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={(event) => {
              setForm((current) => ({ ...current, date: event.target.value, time: '' }));
              setErrors((current) => ({ ...current, date: undefined, time: undefined }));
              if (status.message) {
                setStatus({ type: null, message: '' });
              }
            }}
            min={new Date().toISOString().split('T')[0]}
            className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60"
          />
          <p className="mt-2 text-xs text-forest/70">
            {form.location === 'Sunnyvale'
              ? 'Sunnyvale appointments are available on Monday and Wednesday only.'
              : form.location === 'Palo Alto'
                ? 'Palo Alto appointments are available on Tuesday and Friday only.'
                : 'Weekday-only appointments are available.'}
          </p>
          {errors.date ? <p className="mt-2 text-sm text-red-600">{errors.date}</p> : null}
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-semibold text-forest">
            Select Time <span className="text-red-600">*</span>
          </label>
          <select
            id="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            disabled={!form.location || allowedTimes.length === 0}
            className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60 disabled:cursor-not-allowed disabled:bg-sand/50"
          >
            <option value="">Select</option>
            {allowedTimes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.time ? <p className="mt-2 text-sm text-red-600">{errors.time}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="insuranceFront" className="block text-sm font-semibold text-forest">
            Insurance Card Front (optional)
          </label>
          <input
            id="insuranceFront"
            name="insuranceFront"
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60"
          />
        </div>

        <div>
          <label htmlFor="insuranceBack" className="block text-sm font-semibold text-forest">
            Insurance Card Back (optional)
          </label>
          <input
            id="insuranceBack"
            name="insuranceBack"
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60"
          />
        </div>
      </div>

      <div>
        <label htmlFor="dob" className="block text-sm font-semibold text-forest">
          Date of Birth <span className="text-red-600">*</span>
          <span className="ml-2 text-xs font-normal text-forest/70">Required if insurance card is submitted</span>
        </label>
        <input
          id="dob"
          name="dob"
          type="date"
          value={form.dob}
          onChange={handleChange}
          className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60"
        />
        {errors.dob ? <p className="mt-2 text-sm text-red-600">{errors.dob}</p> : null}
      </div>

      {status.message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            status.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
          aria-live="polite"
        >
          {status.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-forest px-6 py-3 text-base font-semibold text-ivory transition hover:bg-sage disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? 'Submitting...' : 'Request Appointment'}
      </button>
    </form>
  );
}
