import { NextRequest, NextResponse } from 'next/server';
import type { DayTimings } from '@/lib/prayerTimes';

const LAT = 51.481081030825;
const LNG = -0.17885868465577;
const METHOD = 3; // Muslim World League — matches CMC Mawaqit-registered times

const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
];

// Cache: month-year → data
const calendarCache = new Map<string, { data: DayTimings[]; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

interface AladhanDayEntry {
  timings: Record<string, string>;
  date: {
    gregorian: { date: string };
    hijri: { day: string; month: { number: string }; year: string };
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const now = new Date();
  const month = searchParams.get('month') || String(now.getMonth() + 1);
  const year  = searchParams.get('year')  || String(now.getFullYear());
  const cacheKey = `${month}-${year}`;

  const cached = calendarCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${LAT}&longitude=${LNG}&method=${METHOD}`;
    const response = await fetch(url, { next: { revalidate: 86400 } });

    if (!response.ok) throw new Error(`Aladhan API returned ${response.status}`);

    const json = await response.json();

    const days: DayTimings[] = (json.data as AladhanDayEntry[]).map(day => {
      const t = day.timings;
      const hijriMonthIdx = parseInt(day.date.hijri.month.number) - 1;
      return {
        date:    day.date.gregorian.date,
        hijri:   `${day.date.hijri.day} ${HIJRI_MONTHS[hijriMonthIdx]} ${day.date.hijri.year}`,
        fajr:    t.Fajr.substring(0, 5),
        sunrise: t.Sunrise.substring(0, 5),
        dhuhr:   t.Dhuhr.substring(0, 5),
        asr:     t.Asr.substring(0, 5),
        maghrib: t.Maghrib.substring(0, 5),
        isha:    t.Isha.substring(0, 5),
      };
    });

    calendarCache.set(cacheKey, { data: days, timestamp: Date.now() });
    return NextResponse.json(days);
  } catch (err) {
    console.error('[CMC Calendar] API fetch failed:', err);
    return NextResponse.json({ error: 'Unable to load calendar data.' }, { status: 500 });
  }
}
