import { NextResponse } from 'next/server';
import { getMawaqitTodayIqama } from '@/lib/mawaqit';
import { FALLBACK_PRAYER_TIMES } from '@/lib/prayerTimes';

export async function GET() {
  try {
    const data = await getMawaqitTodayIqama();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[CMC Prayer Times] Mawaqit fetch failed:', err);
    return NextResponse.json({ ...FALLBACK_PRAYER_TIMES, isFallback: true });
  }
}
