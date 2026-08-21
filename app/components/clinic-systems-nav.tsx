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
        Log in
        <span className="text-base">▾</span>
      </button>

      {isOpen ? (
        <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-sand bg-white p-3 shadow-soft">
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-sage">Clinic Office Administration</p>
              <Link
                href="/clinic-system"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-forest transition hover:bg-sage/10"
              >
                Clinic Office Administration
              </Link>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-sage">Existing Patient</p>
              <Link
                href="/clinic-system"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-forest transition hover:bg-sage/10"
              >
                Existing Patient
              </Link>
            </div>
          </div>

          <div className="mt-4 border-t border-sand pt-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-sage">Identification</p>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-forest/75">
              <span className="rounded-full border border-sand bg-sage/5 px-2.5 py-1.5">Google</span>
              <span className="rounded-full border border-sand bg-sage/5 px-2.5 py-1.5">Email</span>
              <span className="rounded-full border border-sand bg-sage/5 px-2.5 py-1.5">Face</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
