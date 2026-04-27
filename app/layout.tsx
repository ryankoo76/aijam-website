import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI-JAM US 2026 — 11th International AI Invention Challenge',
  description: 'The international AI invention challenge since 2015. Submit your AI idea. Compete with 25+ countries. Get recognized worldwide.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
