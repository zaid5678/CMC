import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prayer Times',
  description:
    "Live daily prayer times for Chelsea SW10, calculated for CMC's location. Full monthly timetable, Jumu'ah times, and Qibla direction.",
};

export default function PrayerTimesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
