import type { Metadata } from 'next';
import ContactClient from '@/components/ContactClient';
import { getSiteSettings } from '@/lib/contentful';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Chelsea Muslim Community — find us at 14 Blantyre Street, Worlds End Estate, London SW10 0DS.',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return <ContactClient settings={settings} />;
}
