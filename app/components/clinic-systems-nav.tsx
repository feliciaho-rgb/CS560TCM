'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function ClinicSystemsNav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-sage/30 bg-sage/10 px-4 py-2 text-sm font-semibold text-forest transition hover:border-sage hover:bg-sage/20"
      >
        Clinic Office Administration
        <span className="text-base">▾</span>
      </button>

      {isOpen ? (
        <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-sand bg-white p-3 shadow-soft">
          <Link
            href="/clinic-system"
            onClick={() => setIsOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm font-medium text-forest transition hover:bg-sage/10"
          >
            Patient Management
          </Link>
          <Link
            href="/clinic-system"
            onClick={() => setIsOpen(false)}
            className="mt-2 block rounded-xl px-3 py-2 text-sm font-medium text-forest transition hover:bg-sage/10"
          >
            Appointment Management
          </Link>
          <Link
            href="/clinic-system/billing"
            onClick={() => setIsOpen(false)}
            className="mt-2 block rounded-xl px-3 py-2 text-sm font-medium text-forest transition hover:bg-sage/10"
          >
            Clinic Billing & Payment
          </Link>
          <Link
            href="/clinic-system"
            onClick={() => setIsOpen(false)}
            className="mt-2 block rounded-xl px-3 py-2 text-sm font-medium text-forest transition hover:bg-sage/10"
          >
            Staff Management
          </Link>
          <Link
            href="/clinic-system"
            onClick={() => setIsOpen(false)}
            className="mt-2 block rounded-xl px-3 py-2 text-sm font-medium text-forest transition hover:bg-sage/10"
          >
            CE Management
          </Link>
          <Link
            href="/clinic-system"
            onClick={() => setIsOpen(false)}
            className="mt-2 block rounded-xl px-3 py-2 text-sm font-medium text-forest transition hover:bg-sage/10"
          >
            Herbs Inventory Management
          </Link>
        </div>
      ) : null}
    </div>
  );
}
