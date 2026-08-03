'use client';

import { useMemo, useState } from 'react';

type Visit = {
  date: string;
  type: string;
  notes: string;
};

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  membershipId: string;
  phone: string;
  status: string;
  lastVisit: string;
  visits: Visit[];
};

const patients: Patient[] = [
  {
    id: 'p-101',
    firstName: 'Maya',
    lastName: 'Lopez',
    membershipId: 'MEM-1042',
    phone: '(650) 555-0149',
    status: 'Active',
    lastVisit: '2026-07-18',
    visits: [
      { date: '2026-07-18', type: 'Acupuncture Follow-up', notes: 'Improved energy and reduced shoulder tension.' },
      { date: '2026-06-10', type: 'Herbal Consultation', notes: 'Adjusted formula for digestion and sleep support.' },
    ],
  },
  {
    id: 'p-102',
    firstName: 'Daniel',
    lastName: 'Nguyen',
    membershipId: 'MEM-2087',
    phone: '(408) 555-0132',
    status: 'Active',
    lastVisit: '2026-07-21',
    visits: [
      { date: '2026-07-21', type: 'Wellness Visit', notes: 'Discussed stress management and seasonal wellness plan.' },
      { date: '2026-05-14', type: 'Pain Relief Session', notes: 'Progress seen in lower back discomfort.' },
    ],
  },
  {
    id: 'p-103',
    firstName: 'Ava',
    lastName: 'Patel',
    membershipId: 'MEM-3104',
    phone: '(925) 555-0175',
    status: 'Pending Review',
    lastVisit: '2026-07-12',
    visits: [
      { date: '2026-07-12', type: 'Initial Intake', notes: 'Collected health history and treatment goals.' },
    ],
  },
  {
    id: 'p-104',
    firstName: 'Noah',
    lastName: 'Kim',
    membershipId: 'MEM-4021',
    phone: '(415) 555-0188',
    status: 'Active',
    lastVisit: '2026-07-25',
    visits: [
      { date: '2026-07-25', type: 'Acupuncture Session', notes: 'Improved mobility and reduced tension after travel.' },
      { date: '2026-06-18', type: 'Nutrition Review', notes: 'Recommended dietary adjustments for recovery.' },
    ],
  },
];

export default function PatientManagementPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'firstName' | 'lastName' | 'membershipId'>('lastName');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0].id);

  const filteredPatients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const matches = patients.filter((patient) => {
      if (!query) return true;
      return [patient.firstName, patient.lastName, patient.membershipId].some((value) =>
        value.toLowerCase().includes(query),
      );
    });

    return [...matches].sort((a, b) => {
      const left = a[sortBy].toLowerCase();
      const right = b[sortBy].toLowerCase();
      return left.localeCompare(right);
    });
  }, [searchTerm, sortBy]);

  const selectedPatient = filteredPatients.find((patient) => patient.id === selectedPatientId) ?? filteredPatients[0] ?? null;

  return (
    <section className="mt-10 rounded-[2rem] border border-sand bg-[#F9F4EC] p-6 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sage">Patient Management</p>
          <h3 className="mt-3 text-2xl font-semibold text-forest">Search and review patient records</h3>
          <p className="mt-2 text-sm leading-7 text-forest/70">Find a patient by name or membership ID, then open the selected profile to review visit history.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="text-sm font-medium text-forest">
            <span className="sr-only">Search patients</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name or ID"
              className="w-full rounded-full border border-sand bg-white px-4 py-3 text-sm text-forest shadow-sm sm:min-w-[240px]"
            />
          </label>

          <label className="text-sm font-medium text-forest">
            <span className="sr-only">Sort patients</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as 'firstName' | 'lastName' | 'membershipId')}
              className="rounded-full border border-sand bg-white px-4 py-3 text-sm text-forest shadow-sm"
            >
              <option value="firstName">Sort by First Name</option>
              <option value="lastName">Sort by Last Name</option>
              <option value="membershipId">Sort by Membership ID</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-3">
          {filteredPatients.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-sand bg-white p-6 text-sm text-forest/70">
              No patients match your search. Try another name or membership ID.
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <button
                key={patient.id}
                type="button"
                onClick={() => setSelectedPatientId(patient.id)}
                className={`w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition ${selectedPatient?.id === patient.id ? 'border-forest bg-sage/10' : 'border-sand hover:border-sage'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-forest">{patient.firstName} {patient.lastName}</p>
                    <p className="mt-1 text-sm text-forest/70">{patient.membershipId}</p>
                  </div>
                  <span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                    {patient.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-forest/70">
                  <span>{patient.phone}</span>
                  <span>•</span>
                  <span>Last visit: {patient.lastVisit}</span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="rounded-[2rem] border border-sand bg-white p-6 shadow-sm">
          {selectedPatient ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sage">Visit History</p>
                  <h4 className="mt-2 text-2xl font-semibold text-forest">{selectedPatient.firstName} {selectedPatient.lastName}</h4>
                </div>
                <span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                  {selectedPatient.membershipId}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {selectedPatient.visits.map((visit) => (
                  <div key={`${selectedPatient.id}-${visit.date}`} className="rounded-2xl border border-sand bg-[#F9F4EC] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-forest">{visit.type}</p>
                      <p className="text-sm text-forest/70">{visit.date}</p>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-forest/70">{visit.notes}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-sand bg-[#F9F4EC] p-8 text-sm text-forest/70">
              Select a patient to view their visit history.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
