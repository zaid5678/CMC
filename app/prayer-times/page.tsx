'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PageHero from '@/components/PageHero';
import SectionReveal from '@/components/SectionReveal';
import OrnamentalDivider from '@/components/OrnamentalDivider';
import { CMC_QIBLA_BEARING } from '@/lib/qibla';

const QiblaCompass = dynamic(() => import('@/components/QiblaCompass'), { ssr: false });

interface TodayData {
  fajr: string; sunrise: string; dhuhr: string;
  asr: string; maghrib: string; isha: string;
  jumua: string | null;
}

interface CalendarDay {
  fajr: string; sunrise: string; dhuhr: string;
  asr: string; maghrib: string; isha: string;
}

const PRAYERS = [
  { key: 'fajr',    label: 'Fajr' },
  { key: 'sunrise', label: 'Sunrise' },
  { key: 'dhuhr',   label: 'Dhuhr' },
  { key: 'asr',     label: 'Asr' },
  { key: 'maghrib', label: 'Maghrib' },
  { key: 'isha',    label: 'Isha' },
] as const;

function getTodayIndex() {
  return new Date().getDate() - 1; // 0-based
}

export default function PrayerTimesPage() {
  const [today, setToday] = useState<TodayData | null>(null);
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayIdx] = useState(getTodayIndex);

  useEffect(() => {
    const now = new Date();
    Promise.all([
      fetch('/api/prayer-times').then(r => r.json()),
      fetch(`/api/prayer-times/calendar?month=${now.getMonth() + 1}`).then(r => r.json()),
    ]).then(([todayData, calData]) => {
      setToday(todayData);
      if (Array.isArray(calData)) setCalendar(calData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const now = new Date();
  const monthName = now.toLocaleString('en-GB', { month: 'long', year: 'numeric' });

  return (
    <>
      <PageHero
        title="Prayer Times"
        subtitle="Daily prayer times for Chelsea SW10. Jumu'ah every Friday at 12:20pm."
        breadcrumbs={[{ label: 'Prayer Times' }]}
        image={{ src: '/images/inside_pic.jpg', alt: 'Prayer hall interior of Chelsea Muslim Community mosque' }}
      />

      {/* ═══ TODAY'S PRAYER TIMES ═══ */}
      <section className="px-6 lg:px-12 py-12" style={{ background: 'var(--color-ivory)' }}>
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <h2 className="text-center mb-2" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>
              {"Today's Prayer Times"}
            </h2>
            <OrnamentalDivider className="my-4" />

            {loading ? (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton h-24 rounded-lg" />
                ))}
              </div>
            ) : today ? (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-8">
                {PRAYERS.map(({ key, label }) => {
                  const isSunrise = key === 'sunrise';
                  return (
                    <div
                      key={key}
                      className="flex flex-col items-center justify-center rounded-lg py-5 px-2 text-center"
                      style={{
                        background: isSunrise ? 'rgba(201,168,76,0.06)' : 'var(--color-green-deep)',
                        border: isSunrise
                          ? '1px solid rgba(201,168,76,0.25)'
                          : '1px solid rgba(201,168,76,0.2)',
                      }}
                    >
                      <span
                        className="block text-xs tracking-widest uppercase mb-2"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: isSunrise ? 'var(--color-ink-soft)' : 'rgba(201,168,76,0.75)',
                        }}
                      >
                        {label}
                      </span>
                      <span
                        className="text-xl font-semibold"
                        style={{
                          fontFamily: 'var(--font-display)',
                          color: isSunrise ? 'var(--color-ink)' : 'var(--color-gold-light)',
                        }}
                      >
                        {today[key] || '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center mt-8 text-sm" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
                Unable to load prayer times. Please check back shortly.
              </p>
            )}
          </SectionReveal>
        </div>
      </section>

      {/* ═══ JUMU'AH HIGHLIGHT ═══ */}
      <section className="px-6 lg:px-12 pb-12" style={{ background: 'var(--color-ivory)' }}>
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <div
              className="relative overflow-hidden rounded-lg p-8 md:p-10 text-center"
              style={{ background: 'var(--color-green-deep)' }}
            >
              <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="jumuah-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <polygon points="30,10 33,22 45,19 36,28 45,37 33,34 30,46 27,34 15,37 24,28 15,19 27,22" fill="#C9A84C"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#jumuah-pattern)"/>
              </svg>
              <div className="relative z-10 max-w-xl mx-auto">
                <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: 'var(--color-gold-rich)', fontFamily: 'var(--font-body)' }}>
                  Every Friday
                </p>
                <h2 className="text-3xl md:text-4xl font-light italic mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ivory)' }}>
                  {"Jumu'ah (Friday Prayer)"}
                </h2>
                {today?.jumua && (
                  <p className="text-2xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold-rich)' }}>
                    Iqama at {today.jumua}
                  </p>
                )}
                <p className="text-base" style={{ color: 'rgba(248,244,236,0.75)', fontFamily: 'var(--font-body)' }}>
                  The weekly congregation — the most blessed gathering of the Islamic week. Khutbah in English and Arabic. All brothers and sisters warmly welcome.
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ═══ MONTHLY TIMETABLE ═══ */}
      <section className="section-padding px-6 lg:px-12" style={{ background: 'var(--color-ivory-dark)' }}>
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <h2 className="text-center mb-2" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>
              Monthly Timetable
            </h2>
            <p className="text-center text-sm mb-2" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
              {monthName} · Chelsea SW10
            </p>
            <OrnamentalDivider className="my-4" />
          </SectionReveal>

          <SectionReveal delay={0.1}>
            {loading ? (
              <div className="space-y-2 mt-6">
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-10 rounded" />)}
              </div>
            ) : calendar.length > 0 ? (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto rounded-lg mt-6" style={{ border: '1px solid rgba(201,168,76,0.25)' }}>
                  <table className="w-full" style={{ borderCollapse: 'collapse', background: 'var(--color-surface)' }}>
                    <thead>
                      <tr style={{ background: 'var(--color-green-deep)' }}>
                        {['Day', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(h => (
                          <th key={h} className="px-3 py-3 text-left text-xs font-medium tracking-widest uppercase"
                            style={{ color: 'var(--color-gold-light)', fontFamily: 'var(--font-body)' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {calendar.map((day, i) => {
                        const isToday = i === todayIdx;
                        return (
                          <tr
                            key={i}
                            style={{
                              background: isToday
                                ? 'rgba(201,168,76,0.15)'
                                : i % 2 === 0 ? 'var(--color-ivory)' : 'var(--color-ivory-dark)',
                              borderLeft: isToday ? '3px solid var(--color-gold-rich)' : '3px solid transparent',
                            }}
                          >
                            <td className="px-3 py-2.5 text-sm font-medium" style={{ fontFamily: 'var(--font-body)', color: isToday ? 'var(--color-gold-dark)' : 'var(--color-ink)' }}>
                              {i + 1}
                              {isToday && <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ color: 'var(--color-ink)', background: 'var(--color-gold-rich)' }}>Today</span>}
                            </td>
                            {(['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map(p => (
                              <td key={p} className="px-3 py-2.5 text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                                {day[p] || '—'}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card view */}
                <div className="md:hidden space-y-3 mt-6">
                  {calendar.map((day, i) => {
                    const isToday = i === todayIdx;
                    return (
                      <div
                        key={i}
                        className="rounded-lg p-4"
                        style={{
                          background: isToday ? 'rgba(201,168,76,0.1)' : 'var(--color-surface)',
                          border: isToday ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(201,168,76,0.2)',
                        }}
                      >
                        <p className="text-sm font-semibold mb-3" style={{ fontFamily: 'var(--font-body)', color: isToday ? 'var(--color-gold-dark)' : 'var(--color-ink)' }}>
                          Day {i + 1}
                          {isToday && <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ color: 'var(--color-ink)', background: 'var(--color-gold-rich)' }}>Today</span>}
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map(p => (
                            <div key={p}>
                              <span className="block uppercase tracking-wider" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)', fontSize: '0.65rem' }}>{p}</span>
                              <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', fontWeight: 500, fontSize: '0.9rem' }}>{day[p] || '—'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-center mt-6 text-sm" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
                Unable to load monthly timetable.
              </p>
            )}
          </SectionReveal>
        </div>
      </section>

      {/* ═══ QIBLA COMPASS ═══ */}
      <section className="section-padding px-6 lg:px-12" style={{ background: 'var(--color-ivory)' }} aria-labelledby="qibla-heading">
        <div className="max-w-7xl mx-auto text-center">
          <SectionReveal>
            <h2 id="qibla-heading" className="mb-2" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>
              Qibla Direction
            </h2>
            <OrnamentalDivider />
            <p className="mt-4 mb-10 max-w-md mx-auto text-sm" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
              The direction of prayer toward the Kaaba in Mecca, calculated from Chelsea SW10.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.15}>
            <div className="flex justify-center">
              <QiblaCompass bearing={CMC_QIBLA_BEARING} />
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
