import Image from 'next/image';

const services = [
  { title: 'Pain Relief', description: 'Gentle acupuncture and integrative care for lasting comfort.' },
  { title: 'Sports Injury Recovery', description: 'Targeted treatment to restore strength and mobility.' },
  { title: 'Digestive Health', description: 'Balance digestion with expert TCM protocols.' },
  { title: 'Skin Health', description: 'Nurturing skin vitality with natural healing methods.' },
  { title: "Men's Health", description: 'Personalized wellness for vitality and balance.' },
  { title: 'Healthy Aging', description: 'Premium care for longevity and sustained wellness.' },
  { title: 'Reproductive Wellness', description: 'Holistic support for fertility and hormonal health.' },
  { title: 'Stroke Recovery Support', description: 'Comprehensive recovery with restorative therapies.' },
];

export default function Home() {
  return (
    <main className="bg-ivory text-forest selection:bg-sage selection:text-ivory">
      <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(247,241,233,0.9)_60%),_linear-gradient(180deg,#F7F1E9_0%,#E8D8C0_100%)]">
        <div className="absolute inset-0 bg-[url('/hero.png')] bg-cover bg-center opacity-100" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
          <p className="mb-6 inline-flex rounded-full border border-sage/30 bg-white/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-forest shadow-soft backdrop-blur-sm">
            Natural Healing • Longevity • Personalized Care
          </p>
          <div className="max-w-3xl rounded-3xl border border-white/60 bg-white/85 p-10 shadow-soft backdrop-blur-sm sm:p-12">
            <h1 className="text-4xl font-semibold leading-tight text-forest sm:text-5xl md:text-6xl">
              Experience Natural Healing & Lasting Wellness
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-forest/85 sm:text-xl">
              Over 20 years of clinical experience in Traditional Chinese Medicine and acupuncture, crafted for executives, professionals, and health-conscious adults seeking elevated longevity care.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="#book" className="inline-flex items-center justify-center rounded-full bg-forest px-8 py-3 text-base font-semibold text-ivory transition hover:bg-sage">
                Book Your Consultation
              </a>
              <a href="#services" className="inline-flex items-center justify-center rounded-full border border-forest/20 bg-white/90 px-8 py-3 text-base font-semibold text-forest transition hover:border-forest hover:bg-forest/5">
                Explore Services
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sage">About Us</p>
            <h2 className="mt-4 text-3xl font-semibold text-forest sm:text-4xl">Whole Body Wellness through Healthy Aging & Longevity</h2>
            <p className="mt-6 max-w-2xl leading-8 text-forest/80">
              At Heal & Harmony, we guide professionals and discerning adults toward refined, integrative care that restores balance and improves vitality. Our evidence-informed practice blends ancient wisdom with modern clinical precision to help you move with greater ease and confidence.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              <li className="rounded-3xl border border-sand bg-white/90 p-6 shadow-soft">
                <p className="font-semibold text-forest">Trusted Experience</p>
                <p className="mt-3 text-sm text-forest/75">20+ years of clinical care in China, Taiwan, and California.</p>
              </li>
              <li className="rounded-3xl border border-sand bg-white/90 p-6 shadow-soft">
                <p className="font-semibold text-forest">Personalized Care</p>
                <p className="mt-3 text-sm text-forest/75">Tailored treatment plans focused on lasting wellness and comfort.</p>
              </li>
            </ul>
          </div>
          <div className="rounded-[2rem] bg-sand/80 p-8 shadow-soft">
            <div className="space-y-6">
              <div className="rounded-3xl bg-forest p-6 text-ivory shadow-soft">
                <p className="text-sm uppercase tracking-[0.22em] text-sand">Healing Atmosphere</p>
                <p className="mt-4 text-lg leading-8 text-white/90">A calm, luxurious space designed for privacy, gentle renewal, and a premium wellness experience.</p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/85 p-6">
                <p className="font-semibold text-forest">Keywords that resonate</p>
                <p className="mt-3 text-sm text-forest/75">Natural Healing, Healthy Aging, Longevity, Whole Body Wellness, Restore Balance, Improve Vitality, Trusted Experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="border-t border-sand/70 bg-[#F9F4EC] px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sage">Specialized TCM Services</p>
            <h2 className="mt-4 text-3xl font-semibold text-forest sm:text-4xl">Premium integrative wellness for every phase of life.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <article key={service.title} className="rounded-3xl border border-white/80 bg-white/90 p-8 shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
                <h3 className="text-xl font-semibold text-forest">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-forest/75">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_0.8fr] lg:items-center">
          <div className="rounded-[2rem] bg-forest/5 p-10 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sage">Meet Dr. Felicia Ho</p>
            <h2 className="mt-4 text-3xl font-semibold text-forest sm:text-4xl">Trusted care led by a seasoned practitioner.</h2>
            <p className="mt-6 text-forest/80 leading-8">
              Dr. Felicia Ho blends compassionate attention with evidence-informed Traditional Chinese Medicine. Her practice emphasizes personalized plans, premium patient support, and a serene healing journey.
            </p>
            <ul className="mt-8 space-y-4 text-forest/75">
              <li>20+ years clinical experience</li>
              <li>China • Taiwan • California</li>
              <li>Personalized Care</li>
              <li>Evidence-Informed Practice</li>
              <li>Healing Atmosphere</li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
            <div className="h-full min-h-[24rem] bg-[url('/doctor-portrait.jpg')] bg-cover bg-center" />
          </div>
        </div>
      </section>

      <section id="book" className="border-t border-sand/70 bg-[#F4EEE5] px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-white/95 p-10 shadow-soft sm:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sage">Begin Your Journey</p>
              <h2 className="mt-4 text-3xl font-semibold text-forest sm:text-4xl">Reserve a premium consultation today.</h2>
              <p className="mt-6 max-w-xl text-forest/80 leading-8">
                Experience an inviting clinic atmosphere where every detail is crafted to support health, renewal, and elevated wellbeing.
              </p>
              <div className="mt-8 space-y-4 text-forest/75">
                <p><span className="font-semibold text-forest">Location:</span> 1230 Serenity Drive, Suite 409, Silicon Valley, CA 94025</p>
                <p><span className="font-semibold text-forest">Hours:</span> Mon – Fri 9:00 AM – 6:00 PM</p>
                <p><span className="font-semibold text-forest">Contact:</span> concierge@healharmony.com</p>
              </div>
            </div>
            <form className="space-y-5 rounded-[2rem] border border-sand bg-ivory/90 p-8 shadow-soft">
              <div>
                <label className="block text-sm font-semibold text-forest">Full Name</label>
                <input type="text" placeholder="Enter your name" className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-forest">Email Address</label>
                <input type="email" placeholder="Enter your email" className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-forest">Primary Concern</label>
                <select className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60">
                  <option>Longevity & Wellness</option>
                  <option>Pain Relief</option>
                  <option>Digestive Health</option>
                  <option>Healthy Aging</option>
                </select>
              </div>
              <button type="submit" className="w-full rounded-full bg-forest px-6 py-3 text-base font-semibold text-ivory transition hover:bg-sage">
                Request Appointment
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-sand/70 bg-ivory px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-semibold text-forest">Heal & Harmony</p>
            <p className="mt-4 max-w-md text-sm leading-7 text-forest/75">Luxury traditional Chinese medicine and acupuncture care for professionals and adults looking for premium integrative wellness.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-semibold text-forest">Quick Links</p>
              <ul className="mt-4 space-y-2 text-sm text-forest/75">
                <li>Locations</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-forest">Newsletter</p>
              <p className="mt-4 text-sm text-forest/75">Receive wellness insights and clinic updates.</p>
            </div>
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-forest/50">© 2026 Heal & Harmony TCM Clinic. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
