import type { Metadata } from 'next';
import PrayerTimesClient from '@/components/PrayerTimesClient';
import { getSiteSettings, getPrayerTimetables } from '@/lib/contentful';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Prayer Times',
  description: "Daily prayer times for Chelsea Muslim Community — Fajr, Dhuhr, Asr, Maghrib, Isha and Jumu'ah times for SW10 London.",
};

export default async function PrayerTimesPage() {
  const [settings, timetables] = await Promise.all([
    getSiteSettings(),
    getPrayerTimetables(),
  ]);
  return <PrayerTimesClient pdfUrl={settings.prayerTimesPdfUrl} timetables={timetables} />;
}
