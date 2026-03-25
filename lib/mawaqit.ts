/**
 * Mawaqit scraper — fetches the mosque page, extracts the embedded
 * `confData` JSON object, and returns prayer times for today and
 * the full monthly calendar.
 *
 * Key data structure (confirmed by inspection of live page):
 *   confData.times      = [fajr, dhuhr, asr, maghrib, isha]  (5 adhan times for today)
 *   confData.shuruq     = "HH:MM"                             (today's sunrise)
 *   confData.jumua      = "HH:MM"                             (Friday iqama time)
 *   confData.calendar   = array[12] of objects keyed "1"–"31"
 *                         each day: [fajr, shuruq, dhuhr, asr, maghrib, isha]
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
  jumua: string | null;
}

export interface MawaqitCalendarDay {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface ConfData {
  times: string[];
  shuruq: string;
  jumua: string | null;
  jumua2?: string | null;
  // array[12], each element is an object keyed "1"–"31"
  calendar: Array<Record<string, string[]>>;
  [key: string]: unknown;
}

// Cache keyed by calendar date — refreshes automatically each new day
let _cache: { data: ConfData; dateKey: string } | null = null;

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
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Mawaqit returned HTTP ${res.status}`);

  const html = await res.text();

  // Page uses `let confData = {…};`
  const searchStr = 'let confData = ';
  const startIdx = html.indexOf(searchStr);
  if (startIdx === -1) throw new Error('confData variable not found in Mawaqit page');

  const jsonStart = html.indexOf('{', startIdx);
  if (jsonStart === -1) throw new Error('confData JSON object not found');

  // Balance braces to find the end of the JSON object
  let depth = 0;
  let i = jsonStart;
  for (; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') {
      depth--;
      if (depth === 0) break;
    }
  }

  const data = JSON.parse(html.slice(jsonStart, i + 1)) as ConfData;
  _cache = { data, dateKey: key };
  return data;
}

/** Today's 6 prayer times + Jumu'ah iqama */
export async function getMawaqitToday(): Promise<MawaqitToday> {
  const d = await loadConfData();
  return {
    fajr:    d.times[0] ?? '',
    sunrise: d.shuruq   ?? '',
    dhuhr:   d.times[1] ?? '',
    asr:     d.times[2] ?? '',
    maghrib: d.times[3] ?? '',
    isha:    d.times[4] ?? '',
    jumua:   d.jumua    ?? null,
  };
}

/**
 * Prayer times for every day of the given month.
 * monthNumber is 1-based (1 = January … 12 = December).
 *
 * calendar[monthIdx] is an object keyed by "1"–"31" (1-indexed day numbers).
 * Each value is [fajr, shuruq, dhuhr, asr, maghrib, isha].
 */
export async function getMawaqitCalendar(monthNumber: number): Promise<MawaqitCalendarDay[]> {
  const d = await loadConfData();

  const monthObj = d.calendar[monthNumber - 1]; // 0-indexed month
  if (!monthObj || typeof monthObj !== 'object') return [];

  const days: MawaqitCalendarDay[] = [];

  // Keys are "1", "2", … "31" — iterate in order
  const dayNumbers = Object.keys(monthObj)
    .map(Number)
    .sort((a, b) => a - b);

  for (const dayNum of dayNumbers) {
    const t = monthObj[String(dayNum)] ?? [];
    // Format: [fajr, shuruq, dhuhr, asr, maghrib, isha]
    days.push({
      fajr:    t[0] ?? '',
      sunrise: t[1] ?? '',
      dhuhr:   t[2] ?? '',
      asr:     t[3] ?? '',
      maghrib: t[4] ?? '',
      isha:    t[5] ?? '',
    });
  }

  return days;
}
