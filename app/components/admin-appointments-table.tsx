'use client';

import { useMemo, useState } from 'react';

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
type AppointmentFilter = 'pending' | 'confirmed' | 'cancelled';

type Appointment = {
  id: number;
  appointmentType: string;
  subject: string;
  location: string;
  appointmentDate: Date | string;
  appointmentTime: string;
  status: string;
  patient: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

const statusOptions: AppointmentStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];
const visibleStatusOptions: AppointmentFilter[] = ['pending', 'confirmed', 'cancelled'];

export default function AdminAppointmentsTable({ appointments }: { appointments: Appointment[] }) {
  const [rows, setRows] = useState(appointments);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<AppointmentFilter>('pending');

  const filteredRows = useMemo(() => {
    return rows.filter((appointment) => appointment.status === activeFilter);
  }, [activeFilter, rows]);

  const statusCounts = useMemo(() => {
    return visibleStatusOptions.reduce(
      (accumulator, status) => {
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
        current.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, status: nextStatus } : appointment
        )
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
            {status} ({statusCounts[status]})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-3xl border border-sand">
        <table className="min-w-full divide-y divide-sand text-left text-sm">
          <thead className="bg-sand/70 text-forest">
            <tr>
              <th className="px-4 py-3 font-semibold">Patient</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Subject</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Status</th>
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
                <td className="px-4 py-3">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRows.length === 0 ? (
        <p className="rounded-2xl bg-sand/60 px-4 py-3 text-sm text-forest/80">
          No {activeFilter} appointments found.
        </p>
      ) : null}
    </div>
  );
}
