'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

const topicPricing: Record<string, number> = {
  'Fall Prevention': 75,
  'Women Health': 75,
  'Children Health': 75,
};

const defaultTopic = 'Fall Prevention';

export default function PaymentPage() {
  const [topic, setTopic] = useState(defaultTopic);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topicParam = params.get('topic');

    if (topicParam && topicPricing[topicParam]) {
      setTopic(topicParam);
    }
  }, []);

  const amount = useMemo(() => topicPricing[topic] ?? 75, [topic]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          firstName,
          email,
          amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to start Stripe checkout.');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Stripe checkout URL was not returned.');
      }
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Unable to start Stripe checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(247,241,233,0.9)_60%),_linear-gradient(180deg,#F7F1E9_0%,#E8D8C0_100%)] px-6 py-14 text-forest sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-soft sm:p-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sage">CEU Registration</p>
          <h1 className="mt-3 text-3xl font-semibold text-forest sm:text-4xl">Secure your CEU seat</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-forest/75">
            Use the form below to continue to a Stripe test-mode checkout session for the selected CEU topic.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-forest">
            First Name
            <input
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="mt-1 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60"
              placeholder="Jane"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-forest">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60"
              placeholder="jane@example.com"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-forest md:col-span-2">
            CEU Topic
            <select
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              className="mt-1 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-forest/60"
            >
              <option>Fall Prevention</option>
              <option>Women Health</option>
              <option>Children Health</option>
            </select>
          </label>

          <div className="rounded-[1.5rem] border border-sand bg-[#F9F4EC] p-5 md:col-span-2">
            <p className="text-sm font-semibold text-forest">Registration Details</p>
            <div className="mt-3 grid gap-2 text-sm text-forest/80 sm:grid-cols-2">
              <p><span className="font-semibold text-forest">Topic:</span> {topic}</p>
              <p><span className="font-semibold text-forest">Price:</span> ${amount}</p>
            </div>
          </div>

          {error ? (
            <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="md:col-span-2 inline-flex items-center justify-center rounded-full bg-forest px-6 py-3 text-sm font-semibold text-ivory transition hover:bg-sage disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Starting Stripe Checkout...' : 'Continue to Stripe Sandbox Checkout'}
          </button>
        </form>
      </div>
    </main>
  );
}
