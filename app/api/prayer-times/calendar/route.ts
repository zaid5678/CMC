import { NextRequest, NextResponse } from 'next/server';
import { getMawaqitCalendar } from '@/lib/mawaqit';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const now = new Date();
  const month = parseInt(searchParams.get('month') ?? String(now.getMonth() + 1), 10);

  try {
    const days = await getMawaqitCalendar(month);
    return NextResponse.json(days);
  } catch (err) {
    console.error('[CMC Calendar] Mawaqit fetch failed:', err);
    return NextResponse.json({ error: 'Unable to load calendar.' }, { status: 500 });
  }
}
