import { createClient } from 'contentful';
import eventsData from '@/data/events.json';
import announcementsData from '@/data/announcements.json';
import servicesData from '@/data/services.json';
import teamData from '@/data/team.json';
import openingHoursData from '@/data/opening-hours.json';

function getClient() {
  if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    return null;
  }
  return createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });
}

export type Announcement = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  body: string;
};

export type CMCEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
  description: string;
  imageAlt: string;
};

export type Service = {
  id: string;
  title: string;
  icon: string;
  shortDescription: string;
  fullDescription: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
};

export type OpeningHours = {
  schedule: { day: string; hours: string }[];
  jumua: { khutbahTime: string; prayerTime: string; note: string };
};

export async function getAnnouncements(): Promise<Announcement[]> {
  const client = getClient();
  if (!client) return announcementsData;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries = await client.getEntries({
      content_type: 'announcement',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      order: ['-fields.date'] as any,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return entries.items.map((item: any) => ({
      id: item.sys.id,
      title: item.fields.title,
      date: item.fields.date,
      excerpt: item.fields.excerpt,
      body: item.fields.body,
    }));
  } catch {
    return announcementsData;
  }
}

export async function getEvents(): Promise<CMCEvent[]> {
  const client = getClient();
  if (!client) return eventsData;
  try {
    const entries = await client.getEntries({
      content_type: 'event',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      order: ['fields.date'] as any,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return entries.items.map((item: any) => ({
      id: item.sys.id,
      title: item.fields.title,
      date: item.fields.date,
      time: item.fields.time ?? '',
      category: item.fields.category ?? 'Community',
      description: item.fields.description,
      imageAlt: item.fields.imageAlt ?? '',
    }));
  } catch {
    return eventsData;
  }
}

export async function getServices(): Promise<Service[]> {
  const client = getClient();
  if (!client) return servicesData;
  try {
    const entries = await client.getEntries({
      content_type: 'service',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      order: ['fields.order'] as any,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return entries.items.map((item: any) => ({
      id: item.fields.id ?? item.sys.id,
      title: item.fields.title,
      icon: item.fields.icon ?? '',
      shortDescription: item.fields.shortDescription,
      fullDescription: item.fields.fullDescription,
    }));
  } catch {
    return servicesData;
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const client = getClient();
  if (!client) return teamData;
  try {
    const entries = await client.getEntries({ content_type: 'teamMember' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return entries.items.map((item: any) => ({
      id: item.sys.id,
      name: item.fields.name,
      role: item.fields.role,
      bio: item.fields.bio,
      initials: item.fields.initials,
    }));
  } catch {
    return teamData;
  }
}

export async function getOpeningHours(): Promise<OpeningHours> {
  const client = getClient();
  if (!client) return openingHoursData;
  try {
    const entries = await client.getEntries({ content_type: 'openingHours', limit: 1 });
    if (!entries.items.length) return openingHoursData;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const f = entries.items[0].fields as any;
    return {
      schedule: [
        { day: 'Monday',    hours: f.mondayHours },
        { day: 'Tuesday',   hours: f.tuesdayHours },
        { day: 'Wednesday', hours: f.wednesdayHours },
        { day: 'Thursday',  hours: f.thursdayHours },
        { day: 'Friday',    hours: f.fridayHours },
        { day: 'Saturday',  hours: f.saturdayHours },
        { day: 'Sunday',    hours: f.sundayHours },
      ],
      jumua: {
        khutbahTime: f.jumuahKhutbahTime,
        prayerTime: f.jumuahPrayerTime,
        note: f.jumuahNote,
      },
    };
  } catch {
    return openingHoursData;
  }
}
