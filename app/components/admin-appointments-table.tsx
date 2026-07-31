'use client';

import { useMemo, useState } from 'react';

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
type AppointmentFilter = 'all' | AppointmentStatus;

type Appointment = {
  id: number;
  appointmentType: string;
  subject: string;
  location: string;
  appointmentDate: Date | string;
  appointmentTime: string;
  status: AppointmentStatus | string;
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

const statusOptions: AppointmentStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];
const visibleStatusOptions: AppointmentFilter[] = ['all', 'pending', 'confirmed', 'cancelled'];

const statusStyles: Record<AppointmentStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-sky-100 text-sky-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

export default function AdminAppointmentsTable({ appointments }: { appointments: Appointment[] }) {
  const [rows, setRows] = useState(appointments);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<AppointmentFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredRows = useMemo(() => {
    return rows.filter((appointment) => {
      const matchesFilter = activeFilter === 'all' || appointment.status === activeFilter;
      const searchableText = [
        appointment.patient.firstName,
        appointment.patient.lastName,
        appointment.patient.email,
        appointment.appointmentType,
        appointment.subject,
        appointment.location,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, normalizedSearch, rows]);

  const statusCounts = useMemo(() => {
    return visibleStatusOptions.reduce(
      (accumulator, status) => {
        if (status === 'all') {
          accumulator[status] = rows.length;
          return accumulator;
        }

        accumulator[status] = rows.filter((appointment) => appointment.status === status).length;
        return accumulator;
      },
      {} as Record<AppointmentFilter, number>
    );
  }, [rows]);

  const handleStatusChange = async (appointmentId: number, nextStatus: AppointmentStatus) => {
    setUpdatingId(appointmentId);

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unable to update appointment status.');
      }

      setRows((current) =>
        current.map((appointment) => (appointment.id === appointmentId ? { ...appointment, status: nextStatus } : appointment))
      );
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : 'Unable to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {visibleStatusOptions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setActiveFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                activeFilter === status
                  ? 'bg-forest text-ivory'
                  : 'border border-sand bg-white text-forest hover:border-forest/40'
              }`}
            >
              {status === 'all' ? 'All' : status} ({statusCounts[status]})
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 rounded-full border border-sand bg-white px-4 py-2 text-sm text-forest shadow-sm">
          <span className="text-forest/60">🔎</span>
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search patient, type, subject..."
            className="w-full bg-transparent outline-none sm:w-64"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-sand">
        <table className="min-w-full divide-y divide-sand text-left text-sm">
          <thead className="bg-sand/70 text-forest">
            <tr>
              <th className="px-4 py-3 font-semibold">Patient</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Subject</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Requested Date</th>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Submitted</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand bg-white">
            {filteredRows.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-4 py-3">
                  <div className="font-semibold">
                    {appointment.patient.firstName} {appointment.patient.lastName}
                  </div>
                  <div className="text-xs text-forest/70">{appointment.patient.email}</div>
                </td>
                <td className="px-4 py-3">{appointment.appointmentType}</td>
                <td className="px-4 py-3">{appointment.subject}</td>
                <td className="px-4 py-3">{appointment.location}</td>
                <td className="px-4 py-3">{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">{appointment.appointmentTime}</td>
                <td className="px-4 py-3">{new Date(appointment.submittedAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[(appointment.status as AppointmentStatus) || 'pending']}`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setSelectedAppointment(appointment)}
                      className="rounded-full border border-sand bg-white px-3 py-2 text-xs font-semibold text-forest transition hover:border-forest/40"
                    >
                      View Details
                    </button>
                    <select
                      value={appointment.status}
                      onChange={(event) => handleStatusChange(appointment.id, event.target.value as AppointmentStatus)}
                      disabled={updatingId === appointment.id}
                      className="rounded-full border border-sand bg-white px-3 py-2 text-xs font-semibold text-forest outline-none"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRows.length === 0 ? (
        <p className="rounded-2xl bg-sand/60 px-4 py-3 text-sm text-forest/80">
          No {activeFilter === 'all' ? '' : `${activeFilter} `}appointments found for this search.
        </p>
      ) : null}

      {selectedAppointment ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/70 p-4" onClick={() => setSelectedAppointment(null)}>
          <div className="w-full max-w-2xl rounded-[2rem] border border-sand bg-white p-6 shadow-soft" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sage">Appointment Details</p>
                <h3 className="mt-2 text-2xl font-semibold text-forest">
                  {selectedAppointment.patient.firstName} {selectedAppointment.patient.lastName}
                </h3>
              </div>
              <button type="button" onClick={() => setSelectedAppointment(null)} className="rounded-full border border-sand px-3 py-2 text-sm text-forest">
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-sand/70 bg-sand/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest/60">Contact</p>
                <div className="mt-3 space-y-2 text-sm text-forest/80">
                  <p><span className="font-semibold text-forest">Email:</span> {selectedAppointment.patient.email}</p>
                  <p><span className="font-semibold text-forest">Phone:</span> {selectedAppointment.patient.cellPhone || 'Not provided'}</p>
                  <p><span className="font-semibold text-forest">DOB:</span> {selectedAppointment.patient.dob ? new Date(selectedAppointment.patient.dob).toLocaleDateString() : 'Not provided'}</p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-sand/70 bg-sand/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest/60">Visit</p>
                <div className="mt-3 space-y-2 text-sm text-forest/80">
                  <p><span className="font-semibold text-forest">Type:</span> {selectedAppointment.appointmentType}</p>
                  <p><span className="font-semibold text-forest">Subject:</span> {selectedAppointment.subject}</p>
                  <p><span className="font-semibold text-forest">Location:</span> {selectedAppointment.location}</p>
                  <p><span className="font-semibold text-forest">Requested:</span> {new Date(selectedAppointment.appointmentDate).toLocaleDateString()} at {selectedAppointment.appointmentTime}</p>
                  <p><span className="font-semibold text-forest">Submitted:</span> {new Date(selectedAppointment.submittedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-[1.5rem] border border-sand/70 bg-white p-4">
              <div>
                <p className="text-sm font-semibold text-forest">Current Status</p>
                <p className="mt-1 text-sm text-forest/70">{selectedAppointment.status}</p>
              </div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[(selectedAppointment.status as AppointmentStatus) || 'pending']}`}>
                {selectedAppointment.status}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
