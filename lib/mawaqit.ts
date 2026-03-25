/**
 * Mawaqit scraper — fetches the mosque page and extracts the embedded confData.
 *
 * Confirmed data structure:
 *   confData.times          = [fajr, dhuhr, asr, maghrib, isha]  — today's adhan times
 *   confData.shuruq         = "HH:MM"                            — today's sunrise
 *   confData.jumua          = "HH:MM"                            — Friday iqama time
 *   confData.calendar       = array[12] — adhan times (not used for display)
 *   confData.iqamaCalendar  = array[12], each element is an object keyed "1"–"31"
 *                             *** KEY OFFSET: key "N" contains data for day N-1 ***
 *                             Each day: [fajr, dhuhr, asr, maghrib, isha]
 */

const MOSQUE_SLUG = 'chelsea-muslim-community-hub-london-sw100ds-united-kingdom';
const MAWAQIT_URL = `https://mawaqit.net/fr/${MOSQUE_SLUG}`;

export interface MawaqitTodayIqama {
  fajr: string;
  sunrise: string;  // from confData.shuruq — no iqama for sunrise
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jumua: string | null;
}

export interface MawaqitIqamaDay {
  fajr: string;
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
  calendar: Array<Record<string, string[]>>;
  iqamaCalendar: Array<Record<string, string[]>>;
  [key: string]: unknown;
}

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

  const searchStr = 'let confData = ';
  const startIdx = html.indexOf(searchStr);
  if (startIdx === -1) throw new Error('confData not found in Mawaqit page');

  const jsonStart = html.indexOf('{', startIdx);
  if (jsonStart === -1) throw new Error('confData JSON not found');

  let depth = 0;
  let i = jsonStart;
  for (; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') { depth--; if (depth === 0) break; }
  }

  const data = JSON.parse(html.slice(jsonStart, i + 1)) as ConfData;
  _cache = { data, dateKey: key };
  return data;
}

/**
 * Today's jamaat (iqama) times.
 * iqamaCalendar key offset: key "N" = day N-1, so for day D use key D+1.
 */
export async function getMawaqitTodayIqama(): Promise<MawaqitTodayIqama> {
  const d = await loadConfData();
  const now = new Date();
  const monthIdx = now.getMonth();     // 0-indexed
  const dayNum = now.getDate();        // 1-indexed
  const key = String(dayNum + 1);     // offset: key N = day N-1

  const t = d.iqamaCalendar[monthIdx]?.[key] ?? [];

  return {
    fajr:    t[0] ?? '',
    sunrise: d.shuruq ?? '',
    dhuhr:   t[1] ?? '',
    asr:     t[2] ?? '',
    maghrib: t[3] ?? '',
    isha:    t[4] ?? '',
    jumua:   d.jumua ?? null,
  };
}

/**
 * Jamaat times for every day of the given month (1-based monthNumber).
 *
 * iqamaCalendar key offset: key "N" = data for day N-1.
 * We skip key "1" (it holds the previous month's last day) and use keys "2"–"31"
 * which represent days 1–30 of the current month.
 * Day 31 (if the month has it) = key "32", which is absent, so it will be omitted.
 */
export async function getMawaqitIqamaCalendar(monthNumber: number): Promise<MawaqitIqamaDay[]> {
  const d = await loadConfData();
  const monthObj = d.iqamaCalendar[monthNumber - 1];
  if (!monthObj || typeof monthObj !== 'object') return [];

  return Object.keys(monthObj)
    .map(Number)
    .sort((a, b) => a - b)
    .filter(n => n >= 2)          // skip key "1" (prev month's last day)
    .map(keyNum => {
      const t = monthObj[String(keyNum)] ?? [];
      return {
        fajr:    t[0] ?? '',
        dhuhr:   t[1] ?? '',
        asr:     t[2] ?? '',
        maghrib: t[3] ?? '',
        isha:    t[4] ?? '',
      };
    });
}
