import Link from 'next/link';

export default function BillingPage() {
  return (
    <main className="min-h-screen bg-ivory px-6 py-12 text-forest sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-sand bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sage">Billing</p>
            <h1 className="mt-3 text-3xl font-semibold text-forest">Billing overview</h1>
            <p className="mt-2 text-sm leading-7 text-forest/70">Track invoices, payments, and insurance claims from the clinic system.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/clinic-system" className="inline-flex items-center justify-center rounded-full border border-forest/20 bg-white px-4 py-2 text-sm font-semibold text-forest transition hover:border-forest hover:bg-forest/5">
              Back to portal
            </Link>
            <Link href="/" className="inline-flex items-center justify-center rounded-full bg-forest px-4 py-2 text-sm font-semibold text-ivory transition hover:bg-sage">
              Home
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-sand bg-[#F9F4EC] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Outstanding</p>
            <p className="mt-3 text-3xl font-semibold text-forest">$4,280</p>
            <p className="mt-2 text-sm text-forest/70">Invoices waiting for payment.</p>
          </div>
          <div className="rounded-2xl border border-sand bg-[#F9F4EC] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Paid Today</p>
            <p className="mt-3 text-3xl font-semibold text-forest">$1,120</p>
            <p className="mt-2 text-sm text-forest/70">Payments received from patients.</p>
          </div>
          <div className="rounded-2xl border border-sand bg-[#F9F4EC] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Insurance</p>
            <p className="mt-3 text-3xl font-semibold text-forest">82%</p>
            <p className="mt-2 text-sm text-forest/70">Claims filed successfully this month.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
