import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Heal & Harmony | Traditional Chinese Medicine & Acupuncture',
  description: 'Luxury integrative wellness for healthy aging, longevity, and natural healing.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
