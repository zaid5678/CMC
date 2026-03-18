import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Upcoming events at Chelsea Muslim Community — Ramadan iftars, educational circles, community gatherings, youth activities, and more.',
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
