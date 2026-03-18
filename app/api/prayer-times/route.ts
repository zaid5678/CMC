import { NextResponse } from 'next/server';
import { FALLBACK_PRAYER_TIMES, findNextPrayer, type PrayerTimesData } from '@/lib/prayerTimes';

const LAT = 51.481081030825;    // CMC exact coordinates from Mawaqit
const LNG = -0.17885868465577;
const METHOD = 3; // Muslim World League — matches CMC Mawaqit-registered times

// In-memory cache (reset on cold start)
let cache: { data: PrayerTimesData; timestamp: number } | null = null;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
];

export async function GET() {
  const now = Date.now();

  if (cache && now - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const timestamp = Math.floor(now / 1000);
    const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${LAT}&longitude=${LNG}&method=${METHOD}`;
    const response = await fetch(url, { next: { revalidate: 86400 } });

    if (!response.ok) throw new Error(`Aladhan API returned ${response.status}`);

    const json = await response.json();
    const timings = json.data.timings as Record<string, string>;
    const date = json.data.date;

    const prayers = [
      { name: 'Fajr',    time: timings.Fajr.substring(0, 5) },
      { name: 'Sunrise', time: timings.Sunrise.substring(0, 5) },
      { name: 'Dhuhr',   time: timings.Dhuhr.substring(0, 5) },
      { name: 'Asr',     time: timings.Asr.substring(0, 5) },
      { name: 'Maghrib', time: timings.Maghrib.substring(0, 5) },
      { name: 'Isha',    time: timings.Isha.substring(0, 5) },
    ];

    const nowDate = new Date();
    const nowMinutes = nowDate.getHours() * 60 + nowDate.getMinutes();
    const nextPrayer = findNextPrayer(prayers, nowMinutes);

    const hijriMonthIdx = parseInt(date.hijri.month.number) - 1;
    const hijriDateStr = `${date.hijri.day} ${HIJRI_MONTHS[hijriMonthIdx]} ${date.hijri.year} AH`;

    const result: PrayerTimesData = {
      fajr:    prayers[0].time,
      sunrise: prayers[1].time,
      dhuhr:   prayers[2].time,
      asr:     prayers[3].time,
      maghrib: prayers[4].time,
      isha:    prayers[5].time,
      hijriDate: hijriDateStr,
      gregorianDate: date.gregorian.date,
      nextPrayer: {
        name: nextPrayer.name,
        time: nextPrayer.time,
        minutesUntil: nextPrayer.minutesUntil,
      },
    };

    cache = { data: result, timestamp: now };
    return NextResponse.json(result);
  } catch (err) {
    console.error('[CMC Prayer Times] API fetch failed:', err);
    return NextResponse.json({ ...FALLBACK_PRAYER_TIMES, isFallback: true });
  }
}
