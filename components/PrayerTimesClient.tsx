'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PageHero from '@/components/PageHero';
import SectionReveal from '@/components/SectionReveal';
import OrnamentalDivider from '@/components/OrnamentalDivider';
import { CMC_QIBLA_BEARING } from '@/lib/qibla';
import type { PrayerTimetable } from '@/lib/contentful';

const QiblaCompass = dynamic(() => import('@/components/QiblaCompass'), { ssr: false });

interface TodayData {
  fajr: string; sunrise: string; dhuhr: string;
  asr: string; maghrib: string; isha: string;
  jumua: string | null;
}

interface CalendarDay {
  fajr: string; dhuhr: string; asr: string; maghrib: string; isha: string;
}

const TODAY_PRAYERS = [
  { key: 'fajr',    label: 'Fajr' },
  { key: 'sunrise', label: 'Sunrise' },
  { key: 'dhuhr',   label: 'Dhuhr' },
  { key: 'asr',     label: 'Asr' },
  { key: 'maghrib', label: 'Maghrib' },
  { key: 'isha',    label: 'Isha' },
] as const;

const CALENDAR_PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

function getTodayIndex() {
  return new Date().getDate() - 1; // 0-based; calendar array starts at day 1
}

export default function PrayerTimesClient({ pdfUrl, timetables = [] }: { pdfUrl?: string; timetables?: PrayerTimetable[] }) {
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
        subtitle="Daily prayer times."
        breadcrumbs={[{ label: 'Prayer Times' }]}
        image={{ src: '/images/inside_pic.jpg', alt: 'Prayer hall interior of Chelsea Muslim Community mosque' }}
      />

      {/* ═══ TODAY'S JAMAAT TIMES ═══ */}
      <section className="px-6 lg:px-12 py-12" style={{ background: 'var(--color-ivory)' }}>
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <h2 className="text-center mb-1" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>
              {"Today's Prayer Times"}
            </h2>
            <p className="text-center text-sm mb-2" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
              Jamaat times
            </p>
            <OrnamentalDivider className="my-4" />

            {loading ? (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton h-24 rounded-lg" />
                ))}
              </div>
            ) : today ? (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-8">
                {TODAY_PRAYERS.map(({ key, label }) => (
                  <div
                    key={key}
                    className="flex flex-col items-center justify-center rounded-lg py-5 px-2 text-center"
                    style={{
                      background: 'var(--color-green-deep)',
                      border: '1px solid rgba(201,168,76,0.2)',
                    }}
                  >
                    <span
                      className="block text-xs tracking-widest uppercase mb-2"
                      style={{ fontFamily: 'var(--font-body)', color: 'rgba(201,168,76,0.75)' }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-xl font-semibold"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold-light)' }}
                    >
                      {today[key] || '—'}
                    </span>
                  </div>
                ))}
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
                    {"Jumu'ah at"} {today.jumua}
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

      {/* ═══ MONTHLY JAMAAT TIMETABLE ═══ */}
      <section className="section-padding px-6 lg:px-12" style={{ background: 'var(--color-ivory-dark)' }}>
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <h2 className="text-center mb-1" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>
              Monthly Timetable
            </h2>
            <p className="text-center text-sm mb-2" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
              {monthName} · Jamaat times · Chelsea SW10
            </p>
            {pdfUrl && (
              <div className="text-center mt-3 mb-1">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 btn-gold"
                  style={{ padding: '10px 24px', fontSize: '0.85rem' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download PDF Timetable
                </a>
              </div>
            )}
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
                        {['Day', 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(h => (
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
                            {CALENDAR_PRAYERS.map(p => (
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
                          {CALENDAR_PRAYERS.map(p => (
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

      {/* ═══ PRAYER TIMETABLE DOWNLOADS ═══ */}
      {timetables.length > 0 && (
        <section className="section-padding px-6 lg:px-12" style={{ background: 'var(--color-ivory)' }} aria-labelledby="timetables-heading">
          <div className="max-w-5xl mx-auto">
            <SectionReveal>
              <h2 id="timetables-heading" className="text-center mb-1" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>
                Prayer Timetables
              </h2>
              <p className="text-center text-sm mb-2" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
                Download the monthly PDF timetable to print or save
              </p>
              <OrnamentalDivider className="my-4" />
            </SectionReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {timetables.map((t, i) => (
                <SectionReveal key={t.id} delay={i * 0.06}>
                  <a
                    href={t.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-lg transition-all"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid rgba(201,168,76,0.25)',
                      textDecoration: 'none',
                    }}
                  >
                    {/* PDF icon */}
                    <div
                      className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--color-green-deep)' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="12" y1="18" x2="12" y2="12"/>
                        <polyline points="9 15 12 18 15 15"/>
                      </svg>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-snug truncate" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
                        {t.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-gold-dark)', fontFamily: 'var(--font-body)' }}>
                        {t.month}
                      </p>
                    </div>

                    {/* Download arrow */}
                    <svg className="flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </a>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

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
