'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

type ClinicSystemAuthProps = {
  onAuthStateChange?: (isSignedIn: boolean) => void;
};

type AuthMethod = 'google' | 'email' | 'face';

type FaceOption = 'Face Lite' | 'Liveness Check' | 'Secure Match';

export default function ClinicSystemAuth({ onAuthStateChange }: ClinicSystemAuthProps) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [activeMethod, setActiveMethod] = useState<AuthMethod>('google');
  const [selectedFaceOption, setSelectedFaceOption] = useState<FaceOption>('Face Lite');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const notifyAuthState = useCallback((signedIn: boolean) => {
    onAuthStateChange?.(signedIn);
  }, [onAuthStateChange]);

  useEffect(() => {
    const storedSession = window.localStorage.getItem('clinic-system-session');
    const signedIn = storedSession === 'active';
    setIsSignedIn(signedIn);
    notifyAuthState(signedIn);
  }, [notifyAuthState]);

  const handleSignIn = (method: AuthMethod, label: string) => {
    if (method === 'email' && (!email || !password)) {
      setMessage('Please enter your email and password to continue.');
      return;
    }

    window.localStorage.setItem('clinic-system-session', 'active');
    setIsSignedIn(true);
    notifyAuthState(true);
    setMessage(`${label} access granted. Welcome to the clinic system.`);
  };

  const handleSignOut = () => {
    window.localStorage.removeItem('clinic-system-session');
    setIsSignedIn(false);
    notifyAuthState(false);
    setEmail('');
    setPassword('');
    setMessage('');
  };

  if (isSignedIn) {
    return (
      <section className="rounded-[2rem] border border-sand bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sage">Clinic Portal</p>
            <h2 className="mt-3 text-3xl font-semibold text-forest">Management dashboard ready</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-forest/75">{message}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center justify-center rounded-full border border-forest/20 bg-white px-5 py-3 text-sm font-semibold text-forest transition hover:border-forest hover:bg-forest/5"
          >
            Sign out
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-sand bg-[#F9F4EC] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Appointments</p>
            <p className="mt-3 text-3xl font-semibold text-forest">24</p>
            <p className="mt-2 text-sm text-forest/70">Pending confirmations for today.</p>
          </div>
          <div className="rounded-2xl border border-sand bg-[#F9F4EC] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Billing</p>
            <p className="mt-3 text-3xl font-semibold text-forest">$12,480</p>
            <p className="mt-2 text-sm text-forest/70">Collected this week.</p>
          </div>
          <div className="rounded-2xl border border-sand bg-[#F9F4EC] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Staff</p>
            <p className="mt-3 text-3xl font-semibold text-forest">8</p>
            <p className="mt-2 text-sm text-forest/70">Online and available.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/clinic-system/billing" className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-ivory transition hover:bg-sage">Open billing</Link>
          <Link href="/" className="rounded-full border border-forest/20 bg-white px-5 py-3 text-sm font-semibold text-forest transition hover:border-forest hover:bg-forest/5">Back to site</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-sand bg-white p-8 shadow-soft">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sage">Secure Access</p>
        <h2 className="mt-3 text-3xl font-semibold text-forest">Log in to the clinic administration portal</h2>
        <p className="mt-3 text-sm leading-7 text-forest/75">Choose one of the secure login options below to access billing, schedules, and clinic operations.</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { id: 'google', label: 'Google', description: 'Use your Google Workspace account' },
          { id: 'email', label: 'Email & Password', description: 'Use your clinic credentials' },
          { id: 'face', label: 'Face Recognition', description: 'Confirm identity with a scan' },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setActiveMethod(option.id as AuthMethod)}
            className={`rounded-2xl border px-4 py-4 text-left transition ${activeMethod === option.id ? 'border-forest bg-sage/10' : 'border-sand bg-white hover:border-sage'}`}
          >
            <p className="font-semibold text-forest">{option.label}</p>
            <p className="mt-2 text-sm text-forest/70">{option.description}</p>
          </button>
        ))}
      </div>

      {activeMethod === 'google' ? (
        <div className="mt-8 rounded-2xl border border-sand bg-[#F9F4EC] p-6">
          <p className="text-lg font-semibold text-forest">Log in with Google</p>
          <p className="mt-2 text-sm leading-7 text-forest/70">Use your organization account to access the full clinic administration portal.</p>
          <button
            type="button"
            onClick={() => handleSignIn('google', 'Google sign-in')}
            className="mt-5 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-ivory transition hover:bg-sage"
          >
            Log in with Google
          </button>
        </div>
      ) : null}

      {activeMethod === 'email' ? (
        <div className="mt-8 rounded-2xl border border-sand bg-[#F9F4EC] p-6">
          <p className="text-lg font-semibold text-forest">Email address and password</p>
          <div className="mt-4 space-y-4">
            <label className="block text-sm font-medium text-forest">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none ring-0"
                placeholder="staff@healharmony.com"
              />
            </label>
            <label className="block text-sm font-medium text-forest">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none ring-0"
                placeholder="Enter your password"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() => handleSignIn('email', 'Email sign-in')}
            className="mt-5 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-ivory transition hover:bg-sage"
          >
            Log in with email
          </button>
        </div>
      ) : null}

      {activeMethod === 'face' ? (
        <div className="mt-8 rounded-2xl border border-sand bg-[#F9F4EC] p-6">
          <p className="text-lg font-semibold text-forest">Face recognition login</p>
          <p className="mt-2 text-sm leading-7 text-forest/70">Select one verification mode to confirm your identity.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {(['Face Lite', 'Liveness Check', 'Secure Match'] as FaceOption[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedFaceOption(option)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${selectedFaceOption === option ? 'border-forest bg-forest text-ivory' : 'border-sand bg-white text-forest hover:border-sage'}`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => handleSignIn('face', `${selectedFaceOption} verification`)}
            className="mt-5 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-ivory transition hover:bg-sage"
          >
            Log in with {selectedFaceOption}
          </button>
        </div>
      ) : null}

      {message ? <p className="mt-5 text-sm font-medium text-forest">{message}</p> : null}
    </section>
  );
}
