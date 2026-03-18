'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import PageHero from '@/components/PageHero';
import SectionReveal from '@/components/SectionReveal';
import OrnamentalDivider from '@/components/OrnamentalDivider';
import { CMC_QIBLA_BEARING } from '@/lib/qibla';
import type { DayTimings } from '@/lib/prayerTimes';

const QiblaCompass = dynamic(() => import('@/components/QiblaCompass'), { ssr: false });

function getTodayDateStr() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export default function PrayerTimesPage() {
  const [calendarData, setCalendarData] = useState<DayTimings[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHijri, setShowHijri] = useState(false);
  const todayStr = getTodayDateStr();

  useEffect(() => {
    const now = new Date();
    fetch(`/api/prayer-times/calendar?month=${now.getMonth() + 1}&year=${now.getFullYear()}`)
      .then(r => r.json())
      .then((d: DayTimings[]) => {
        setCalendarData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isToday = (dateStr: string) => dateStr === todayStr;

  return (
    <>
      <PageHero
        title="Prayer Times"
        subtitle="Live prayer times for Chelsea SW10, calculated daily. Jumu'ah every Friday at 12:20pm."
        breadcrumbs={[{ label: 'Prayer Times' }]}
      />

      {/* ═══ INTERIOR IMAGE ═══ */}
      <div className="relative w-full overflow-hidden" style={{ height: '320px' }}>
        <Image
          src="/images/inside_pic.jpg"
          alt="Prayer hall interior of Chelsea Muslim Community mosque"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(30,86,49,0.25) 0%, rgba(30,86,49,0.05) 50%, rgba(30,86,49,0.25) 100%)' }}
        />
      </div>

      {/* ═══ JUMU'AH HIGHLIGHT ═══ */}
      <section className="px-6 lg:px-12 py-12" style={{ background: 'var(--color-ivory)' }}>
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div
              className="relative overflow-hidden rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
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

              <div className="relative z-10">
                <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: 'var(--color-gold-rich)', fontFamily: 'var(--font-body)' }}>
                  Every Friday
                </p>
                <h2 className="text-3xl md:text-4xl font-light italic mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ivory)' }}>
                  {"Jumu'ah (Friday Prayer)"}
                </h2>
                <p className="text-base max-w-md" style={{ color: 'rgba(248,244,236,0.75)', fontFamily: 'var(--font-body)' }}>
                  The weekly congregation — the most blessed gathering of the Islamic week. Khutbah in English and Arabic. All brothers and sisters warmly welcome.
                </p>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row gap-6 md:gap-8 text-center">
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'rgba(201,168,76,0.7)', fontFamily: 'var(--font-body)' }}>Khutbah begins</p>
                  <p className="text-4xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold-rich)' }}>12:00pm</p>
                </div>
                <div className="w-px self-stretch" style={{ background: 'rgba(201,168,76,0.3)' }} aria-hidden="true"/>
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'rgba(201,168,76,0.7)', fontFamily: 'var(--font-body)' }}>Prayer (Iqama)</p>
                  <p className="text-4xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold-light)' }}>12:20pm</p>
                </div>
              </div>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <p className="mt-4 text-sm text-center italic" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
              Please arrive by 11:55am on Fridays to ensure a place in the main hall
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ═══ MONTHLY TIMETABLE ═══ */}
      <section className="section-padding px-6 lg:px-12" style={{ background: 'var(--color-ivory-dark)' }} aria-labelledby="calendar-heading">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 id="calendar-heading" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>
                  Monthly Timetable
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
                  {new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' })} · Chelsea SW10
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setShowHijri(!showHijri)}
                  className="text-sm font-medium px-4 py-2 rounded transition-all"
                  style={{
                    fontFamily: 'var(--font-body)',
                    background: showHijri ? 'var(--color-green-deep)' : 'var(--color-surface)',
                    color: showHijri ? 'var(--color-gold-light)' : 'var(--color-ink)',
                    border: '1px solid rgba(201,168,76,0.4)',
                  }}
                >
                  {showHijri ? 'Show Gregorian' : 'Show Hijri'}
                </button>
                <div className="relative group">
                  <button
                    disabled
                    aria-disabled="true"
                    className="text-sm font-medium px-4 py-2 rounded opacity-50 cursor-not-allowed"
                    style={{
                      fontFamily: 'var(--font-body)',
                      background: 'var(--color-surface)',
                      border: '1px solid rgba(201,168,76,0.3)',
                      color: 'var(--color-ink)',
                    }}
                  >
                    Download PDF
                  </button>
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                    style={{ background: 'var(--color-ink)', color: 'var(--color-ivory)', fontFamily: 'var(--font-body)' }}
                    role="tooltip"
                  >
                    Coming soon — timetable PDF available each month
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="skeleton h-10 rounded"/>
                ))}
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto rounded-lg" style={{ border: '1px solid rgba(201,168,76,0.25)' }}>
                  <table className="w-full" style={{ borderCollapse: 'collapse', background: 'var(--color-surface)' }}>
                    <thead>
                      <tr style={{ background: 'var(--color-green-deep)' }}>
                        {['Date', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium tracking-widest uppercase"
                            style={{ color: 'var(--color-gold-light)', fontFamily: 'var(--font-body)' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {calendarData.map((day, i) => {
                        const today = isToday(day.date);
                        return (
                          <tr
                            key={day.date}
                            style={{
                              background: today
                                ? 'rgba(201,168,76,0.15)'
                                : i % 2 === 0 ? 'var(--color-ivory)' : 'var(--color-ivory-dark)',
                              borderLeft: today ? '3px solid var(--color-gold-rich)' : '3px solid transparent',
                            }}
                          >
                            <td className="px-4 py-2.5 text-sm font-medium" style={{ fontFamily: 'var(--font-body)', color: today ? 'var(--color-gold-dark)' : 'var(--color-ink)' }}>
                              {showHijri ? day.hijri : day.date}
                              {today && <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ color: 'var(--color-ink)', background: 'var(--color-gold-rich)' }}>Today</span>}
                            </td>
                            {(['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map(p => (
                              <td key={p} className="px-4 py-2.5 text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                                {day[p]}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card view */}
                <div className="md:hidden space-y-3">
                  {calendarData.map(day => {
                    const today = isToday(day.date);
                    return (
                      <div
                        key={day.date}
                        className="rounded-lg p-4"
                        style={{
                          background: today ? 'rgba(201,168,76,0.1)' : 'var(--color-surface)',
                          border: today ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(201,168,76,0.2)',
                        }}
                      >
                        <p className="text-sm font-semibold mb-3" style={{ fontFamily: 'var(--font-body)', color: today ? 'var(--color-gold-dark)' : 'var(--color-ink)' }}>
                          {showHijri ? day.hijri : day.date}
                          {today && <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ color: 'var(--color-ink)', background: 'var(--color-gold-rich)' }}>Today</span>}
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map(p => (
                            <div key={p}>
                              <span className="block uppercase tracking-wider" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)', fontSize: '0.65rem' }}>{p}</span>
                              <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', fontWeight: 500, fontSize: '0.9rem' }}>{day[p]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
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
              The direction of prayer toward the Kaaba in Mecca, calculated from Chelsea SW10 (lat 51.4847, lng −0.1788).
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
