/**
 * Mawaqit scraper — mirrors what mrsofiane/mawaqit-api does in Python.
 * Fetches the mosque page, extracts the embedded `confData` JSON object,
 * and returns today's times + the full 12-month calendar.
 */

const MOSQUE_SLUG = 'chelsea-muslim-community-hub-london-sw100ds-united-kingdom';
const MAWAQIT_URL = `https://mawaqit.net/fr/${MOSQUE_SLUG}`;

export interface MawaqitToday {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jumua: string | null;  // Friday iqama, e.g. "12:20"
  jumua2: string | null;
}

export interface MawaqitCalendarDay {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

// In-memory cache keyed by calendar date so it refreshes each new day
let _cache: { data: ConfData; dateKey: string } | null = null;

interface ConfData {
  times: string[];           // [fajr, dhuhr, asr, maghrib, isha] for today
  shuruq: string;            // today's sunrise
  jumua: string | null;
  jumua2?: string | null;
  // 12-month array; each month is an array of day-arrays of time strings
  calendar: string[][][] | Record<string, string[][]>;
  [key: string]: unknown;
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

async function loadConfData(): Promise<ConfData> {
  const key = todayKey();
  if (_cache && _cache.dateKey === key) return _cache.data;

  const res = await fetch(MAWAQIT_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-GB,en;q=0.9',
    },
    // disable Next.js static caching — we use our own date-keyed cache
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Mawaqit returned HTTP ${res.status}`);

  const html = await res.text();

  // Locate "var confData = {" and balance braces to extract the full JSON object
  const searchStr = 'var confData = ';
  const startIdx = html.indexOf(searchStr);
  if (startIdx === -1) throw new Error('confData variable not found in Mawaqit page');

  const jsonStart = html.indexOf('{', startIdx);
  if (jsonStart === -1) throw new Error('confData JSON object not found');

  let depth = 0;
  let i = jsonStart;
  for (; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') {
      depth--;
      if (depth === 0) break;
    }
  }

  const jsonStr = html.slice(jsonStart, i + 1);
  const data = JSON.parse(jsonStr) as ConfData;

  _cache = { data, dateKey: key };
  return data;
}

/** Returns today's 6 prayer times + Jumu'ah iqama */
export async function getMawaqitToday(): Promise<MawaqitToday> {
  const d = await loadConfData();
  return {
    fajr:    d.times[0] ?? '',
    sunrise: d.shuruq   ?? '',
    dhuhr:   d.times[1] ?? '',
    asr:     d.times[2] ?? '',
    maghrib: d.times[3] ?? '',
    isha:    d.times[4] ?? '',
    jumua:   d.jumua  ?? null,
    jumua2:  d.jumua2 ?? null,
  };
}

/**
 * Returns the prayer times for every day of the requested month.
 * monthNumber is 1-based (1 = January, …, 12 = December).
 */
export async function getMawaqitCalendar(monthNumber: number): Promise<MawaqitCalendarDay[]> {
  const d = await loadConfData();

  // confData.calendar is either an array-of-12-months or an object keyed by month number
  let monthData: string[][] = [];

  if (Array.isArray(d.calendar)) {
    monthData = (d.calendar[monthNumber - 1] ?? []) as string[][];
  } else if (d.calendar && typeof d.calendar === 'object') {
    const key = String(monthNumber);
    const raw = (d.calendar as Record<string, string[][]>)[key] ?? [];
    monthData = raw;
  }

  return monthData.map((dayTimes: string[]) => {
    // Some mosques have 5 times [fajr, dhuhr, asr, maghrib, isha]
    // Others include shuruq as index 1 making 6 total
    if (dayTimes.length >= 6) {
      return {
        fajr:    dayTimes[0] ?? '',
        sunrise: dayTimes[1] ?? '',
        dhuhr:   dayTimes[2] ?? '',
        asr:     dayTimes[3] ?? '',
        maghrib: dayTimes[4] ?? '',
        isha:    dayTimes[5] ?? '',
      };
    }
    return {
      fajr:    dayTimes[0] ?? '',
      sunrise: '',
      dhuhr:   dayTimes[1] ?? '',
      asr:     dayTimes[2] ?? '',
      maghrib: dayTimes[3] ?? '',
      isha:    dayTimes[4] ?? '',
    };
  });
}
