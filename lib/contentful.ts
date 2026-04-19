import { createClient } from 'contentful';
import eventsData from '@/data/events.json';
import announcementsData from '@/data/announcements.json';
import servicesData from '@/data/services.json';
import teamData from '@/data/team.json';
import openingHoursData from '@/data/opening-hours.json';
import siteSettingsData from '@/data/site-settings.json';
import aboutContentData from '@/data/about-content.json';

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

export type SiteSettings = {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  phone: string;
  email: string;
  googleMapsUrl: string;
  prayerTimesPdfUrl?: string;
};

export type PrayerTimetable = {
  id: string;
  title: string;
  month: string;
  fileUrl: string;
  order: number;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  category: string;
};

export type AboutContent = {
  historyParagraph1: string;
  historyParagraph2: string;
  historyParagraph3: string;
  missionStatement: string;
  principle1Title: string;
  principle1Description: string;
  principle2Title: string;
  principle2Description: string;
  principle3Title: string;
  principle3Description: string;
  values: string;
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

export async function getPrayerTimetables(): Promise<PrayerTimetable[]> {
  const client = getClient();
  if (!client) return [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries = await client.getEntries({ content_type: 'prayerTimetable', include: 1, order: ['fields.order'] } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return entries.items.map((item: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileField = item.fields.file as any;
      const rawUrl: string = fileField?.fields?.file?.url ?? '';
      return {
        id: item.sys.id,
        title: item.fields.title ?? '',
        month: item.fields.month ?? '',
        fileUrl: rawUrl ? `https:${rawUrl}` : '',
        order: item.fields.order ?? 0,
      };
    }).filter((t: PrayerTimetable) => t.fileUrl);
  } catch {
    return [];
  }
}

export async function getResources(): Promise<Resource[]> {
  const client = getClient();
  if (!client) return [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries = await client.getEntries({ content_type: 'resource', include: 1 } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return entries.items.map((item: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileField = item.fields.file as any;
      const rawUrl: string = fileField?.fields?.file?.url ?? '';
      return {
        id: item.sys.id,
        title: item.fields.title ?? '',
        description: item.fields.description ?? '',
        fileUrl: rawUrl ? `https:${rawUrl}` : '',
        fileName: fileField?.fields?.file?.fileName ?? '',
        category: item.fields.category ?? 'General',
      };
    }).filter((r: Resource) => r.fileUrl);
  } catch {
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const client = getClient();
  if (!client) return siteSettingsData;
  try {
    // include: 1 resolves linked assets (e.g. prayerTimesPdf)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries = await client.getEntries({ content_type: 'siteSettings', limit: 1, include: 1 } as any);
    if (!entries.items.length) return siteSettingsData;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const f = entries.items[0].fields as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfAsset = f.prayerTimesPdf as any;
    const pdfUrl: string | undefined = pdfAsset?.fields?.file?.url
      ? `https:${pdfAsset.fields.file.url}`
      : undefined;
    return {
      addressLine1: f.addressLine1 ?? siteSettingsData.addressLine1,
      addressLine2: f.addressLine2 ?? siteSettingsData.addressLine2,
      addressLine3: f.addressLine3 ?? siteSettingsData.addressLine3,
      phone: f.phone ?? siteSettingsData.phone,
      email: f.email ?? siteSettingsData.email,
      googleMapsUrl: f.googleMapsUrl ?? siteSettingsData.googleMapsUrl,
      prayerTimesPdfUrl: pdfUrl,
    };
  } catch {
    return siteSettingsData;
  }
}

export async function getAboutContent(): Promise<AboutContent> {
  const client = getClient();
  if (!client) return aboutContentData;
  try {
    const entries = await client.getEntries({ content_type: 'aboutContent', limit: 1 });
    if (!entries.items.length) return aboutContentData;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const f = entries.items[0].fields as any;
    return {
      historyParagraph1: f.historyParagraph1 ?? aboutContentData.historyParagraph1,
      historyParagraph2: f.historyParagraph2 ?? aboutContentData.historyParagraph2,
      historyParagraph3: f.historyParagraph3 ?? aboutContentData.historyParagraph3,
      missionStatement: f.missionStatement ?? aboutContentData.missionStatement,
      principle1Title: f.principle1Title ?? aboutContentData.principle1Title,
      principle1Description: f.principle1Description ?? aboutContentData.principle1Description,
      principle2Title: f.principle2Title ?? aboutContentData.principle2Title,
      principle2Description: f.principle2Description ?? aboutContentData.principle2Description,
      principle3Title: f.principle3Title ?? aboutContentData.principle3Title,
      principle3Description: f.principle3Description ?? aboutContentData.principle3Description,
      values: f.values ?? aboutContentData.values,
    };
  } catch {
    return aboutContentData;
  }
}
