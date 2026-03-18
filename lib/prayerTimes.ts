export interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  hijriDate: string;
  gregorianDate: string;
  nextPrayer: {
    name: string;
    time: string;
    minutesUntil: number;
  };
  isFallback?: boolean;
}

export interface DayTimings {
  date: string;
  hijri: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}


export function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
}

export function timeToMinutes(timeStr: string): number {
  const { hours, minutes } = parseTime(timeStr);
  return hours * 60 + minutes;
}

export function findNextPrayer(
  prayers: { name: string; time: string }[],
  nowMinutes: number
): { name: string; time: string; minutesUntil: number } {
  const prayerTimes = prayers.filter(p => p.name !== 'sunrise');

  for (const prayer of prayerTimes) {
    const prayerMinutes = timeToMinutes(prayer.time);
    if (prayerMinutes > nowMinutes) {
      return {
        name: prayer.name,
        time: prayer.time,
        minutesUntil: prayerMinutes - nowMinutes,
      };
    }
  }

  // Wrap around to next day's Fajr
  const fajr = prayerTimes[0];
  return {
    name: fajr.name,
    time: fajr.time,
    minutesUntil: 24 * 60 - nowMinutes + timeToMinutes(fajr.time),
  };
}

// Fallback times based on CMC Mawaqit-registered data (approximate mid-year values)
export const FALLBACK_PRAYER_TIMES: PrayerTimesData = {
  fajr: '04:28',
  sunrise: '06:05',
  dhuhr: '12:14',
  asr: '15:24',
  maghrib: '18:13',
  isha: '19:33',
  hijriDate: "Sha'ban 1446",
  gregorianDate: new Date().toLocaleDateString('en-GB'),
  nextPrayer: { name: 'Dhuhr', time: '12:14', minutesUntil: 0 },
  isFallback: true,
};
