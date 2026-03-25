import { NextResponse } from 'next/server';
import { getMawaqitToday } from '@/lib/mawaqit';
import { FALLBACK_PRAYER_TIMES, findNextPrayer } from '@/lib/prayerTimes';

export async function GET() {
  try {
    const data = await getMawaqitToday();

    const prayers = [
      { name: 'Fajr',    time: data.fajr },
      { name: 'Sunrise', time: data.sunrise },
      { name: 'Dhuhr',   time: data.dhuhr },
      { name: 'Asr',     time: data.asr },
      { name: 'Maghrib', time: data.maghrib },
      { name: 'Isha',    time: data.isha },
    ];

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const nextPrayer = findNextPrayer(prayers, nowMinutes);

    return NextResponse.json({
      fajr:    data.fajr,
      sunrise: data.sunrise,
      dhuhr:   data.dhuhr,
      asr:     data.asr,
      maghrib: data.maghrib,
      isha:    data.isha,
      jumua:   data.jumua,
      nextPrayer,
    });
  } catch (err) {
    console.error('[CMC Prayer Times] Mawaqit fetch failed:', err);
    return NextResponse.json({ ...FALLBACK_PRAYER_TIMES, isFallback: true });
  }
}
