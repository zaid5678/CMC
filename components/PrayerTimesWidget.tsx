'use client';

import { useEffect, useState } from 'react';
import { PrayerTimesData } from '@/lib/prayerTimes';

const PRAYER_LABELS: { key: keyof Pick<PrayerTimesData, 'fajr'|'dhuhr'|'asr'|'maghrib'|'isha'>; label: string; arabicLabel: string }[] = [
  { key: 'fajr',    label: 'Fajr',    arabicLabel: 'الفجر' },
  { key: 'dhuhr',   label: 'Dhuhr',   arabicLabel: 'الظهر' },
  { key: 'asr',     label: 'Asr',     arabicLabel: 'العصر' },
  { key: 'maghrib', label: 'Maghrib', arabicLabel: 'المغرب' },
  { key: 'isha',    label: 'Isha',    arabicLabel: 'العشاء' },
];

function SkeletonCard() {
  return (
    <div className="flex flex-col items-center p-4 rounded-lg gap-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
      <div className="skeleton h-3 w-16 rounded" />
      <div className="skeleton h-8 w-20 rounded" />
    </div>
  );
}

export default function PrayerTimesWidget() {
  const [data, setData] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/prayer-times')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  if (error) {
    return (
      <p className="text-center py-8 text-sm" style={{ color: 'var(--color-gold-light)', fontFamily: 'var(--font-body)' }}>
        Unable to load prayer times. Please refresh.
      </p>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-2">
        <div>
          <h2
            className="text-2xl md:text-3xl italic font-light"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ivory)' }}
          >
            {"Today's Prayer Times"}
          </h2>
          {data?.hijriDate && (
            <p className="text-sm mt-1" style={{ color: 'var(--color-gold-rich)', fontFamily: 'var(--font-body)' }}>
              {data.hijriDate}
            </p>
          )}
        </div>
        {data?.gregorianDate && (
          <p className="text-sm" style={{ color: 'rgba(232,201,122,0.7)', fontFamily: 'var(--font-body)' }}>
            {data.gregorianDate}
          </p>
        )}
      </div>

      {/* Prayer Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : PRAYER_LABELS.map(({ key, label, arabicLabel }) => {
              const isNext = data?.nextPrayer?.name?.toLowerCase() === label.toLowerCase();
              return (
                <div
                  key={key}
                  className={`flex flex-col items-center p-4 md:p-5 rounded-lg gap-2 transition-all ${isNext ? 'pulse-gold' : ''}`}
                  style={{
                    background: isNext ? 'var(--color-gold-rich)' : 'rgba(255,255,255,0.08)',
                    border: isNext ? 'none' : '1px solid rgba(201,168,76,0.2)',
                  }}
                >
                  <span
                    lang="ar"
                    dir="rtl"
                    className="text-sm"
                    style={{
                      fontFamily: 'var(--font-arabic)',
                      color: isNext ? 'var(--color-ink)' : 'rgba(232,201,122,0.6)',
                    }}
                  >
                    {arabicLabel}
                  </span>
                  <span
                    className="text-xs font-medium tracking-widest uppercase"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: isNext ? 'var(--color-ink)' : 'var(--color-gold-light)',
                    }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-2xl font-semibold"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: isNext ? 'var(--color-ink)' : 'var(--color-ivory)',
                    }}
                  >
                    {data?.[key] || '--:--'}
                  </span>
                  {isNext && (
                    <span
                      className="text-xs mt-1"
                      style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}
                    >
                      Next Prayer
                    </span>
                  )}
                </div>
              );
            })}
      </div>

      {data?.isFallback && (
        <p className="text-center mt-4 text-xs" style={{ color: 'rgba(232,201,122,0.5)', fontFamily: 'var(--font-body)' }}>
          * Showing approximate times. Live times temporarily unavailable.
        </p>
      )}
    </div>
  );
}
