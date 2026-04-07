'use client';

import { useState } from 'react';
import PageHero from '@/components/PageHero';
import SectionReveal from '@/components/SectionReveal';
import OrnamentalDivider from '@/components/OrnamentalDivider';
import type { CMCEvent } from '@/lib/contentful';

const CATEGORIES = ['All', 'Education', 'Community', 'Ramadan', 'Youth', 'Sisters'];

const categoryColors: Record<string, { bg: string; text: string }> = {
  All:       { bg: 'var(--color-green-deep)', text: 'var(--color-ivory)' },
  Ramadan:   { bg: 'rgba(139,105,20,0.15)', text: 'var(--color-gold-dark)' },
  Education: { bg: 'rgba(45,122,71,0.15)', text: 'var(--color-green-mid)' },
  Community: { bg: 'rgba(26,18,8,0.08)', text: 'var(--color-ink-soft)' },
  Sisters:   { bg: 'rgba(201,168,76,0.15)', text: 'var(--color-gold-dark)' },
  Youth:     { bg: 'rgba(45,122,71,0.12)', text: 'var(--color-green-deep)' },
};

const cardGradients: Record<string, string> = {
  Ramadan:   'linear-gradient(135deg, #1E5631, #8B6914)',
  Education: 'linear-gradient(135deg, #1E5631, #2D7A47)',
  Community: 'linear-gradient(135deg, #3D3020, #1E5631)',
  Sisters:   'linear-gradient(135deg, #8B6914, #C9A84C)',
  Youth:     'linear-gradient(135deg, #2D7A47, #1E5631)',
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.getDate().toString(),
    month: date.toLocaleString('en-GB', { month: 'long' }),
    monthShort: date.toLocaleString('en-GB', { month: 'short' }).toUpperCase(),
    dayOfWeek: date.toLocaleString('en-GB', { weekday: 'long' }),
    year: date.getFullYear().toString(),
  };
}

export default function EventsClient({ events }: { events: CMCEvent[] }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? events
    : events.filter(e => e.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <>
      <PageHero
        title="Events"
        subtitle="From Ramadan iftars to educational circles — what's happening at Chelsea Muslim Community."
        breadcrumbs={[{ label: 'Events' }]}
      />

      <section className="section-padding px-6 lg:px-12" style={{ background: 'var(--color-ivory)' }}>
        <div className="max-w-7xl mx-auto">

          {/* Category filter pills */}
          <SectionReveal>
            <div className="flex flex-wrap gap-3 mb-10" role="group" aria-label="Filter events by category">
              {CATEGORIES.map(cat => {
                const isActive = cat === activeCategory;
                const colors = categoryColors[cat] || categoryColors.Community;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="text-sm font-medium px-5 py-2.5 rounded-full transition-all"
                    style={{
                      fontFamily: 'var(--font-body)',
                      letterSpacing: '0.04em',
                      background: isActive ? 'var(--color-green-deep)' : colors.bg,
                      color: isActive ? 'var(--color-gold-light)' : colors.text,
                      border: isActive ? '1px solid var(--color-green-deep)' : '1px solid rgba(201,168,76,0.3)',
                    }}
                    aria-pressed={isActive}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            <OrnamentalDivider className="mb-8" />
          </SectionReveal>

          {/* Events grid or empty state */}
          {sorted.length === 0 ? (
            <SectionReveal>
              <div className="text-center py-24">
                <svg width="64" height="64" viewBox="0 0 64 64" className="mx-auto mb-6 opacity-25" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <polygon points="32,6 36,26 56,22 42,36 52,52 32,44 12,52 22,36 8,22 28,26" fill="none" stroke="#C9A84C" strokeWidth="2"/>
                </svg>
                <h3 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
                  No events in this category right now
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
                  New events are announced regularly. Check back soon, or browse all events.
                </p>
                <button
                  onClick={() => setActiveCategory('All')}
                  className="btn-gold"
                  style={{ padding: '12px 28px', fontSize: '0.85rem' }}
                >
                  View All Events
                </button>
              </div>
            </SectionReveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((event, i) => {
                const { day, month, monthShort, dayOfWeek, year } = formatDate(event.date);
                const gradient = cardGradients[event.category] || cardGradients.Community;
                const pillColors = categoryColors[event.category] || categoryColors.Community;
                return (
                  <SectionReveal key={event.id} delay={Math.min(i * 0.07, 0.35)}>
                    <article id={event.id} className="card overflow-hidden">
                      {/* Image area */}
                      <div
                        className="relative h-52 overflow-hidden"
                        style={{ background: gradient }}
                        role="img"
                        aria-label={event.imageAlt}
                      >
                        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern id={`ep-${event.id}`} x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                              <polygon points="25,5 28,18 41,15 32,23 41,31 28,28 25,41 22,28 9,31 18,23 9,15 22,18" fill="#C9A84C"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill={`url(#ep-${event.id})`}/>
                        </svg>
                        {/* Date badge */}
                        <div
                          className="absolute top-3 right-3 text-center px-3 py-2 rounded"
                          style={{ background: 'rgba(201,168,76,0.95)', minWidth: '56px' }}
                        >
                          <div className="text-2xl font-bold leading-none" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>{day}</div>
                          <div className="text-xs font-medium mt-0.5" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', letterSpacing: '0.1em' }}>{monthShort}</div>
                        </div>
                      </div>

                      <div className="p-5">
                        <span
                          className="category-pill mb-3 inline-block"
                          style={{ background: pillColors.bg, color: pillColors.text }}
                        >
                          {event.category}
                        </span>
                        <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontWeight: 600, lineHeight: 1.2 }}>
                          {event.title}
                        </h3>
                        <p className="text-xs mb-3" style={{ color: 'var(--color-gold-dark)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                          {dayOfWeek}, {day} {month} {year} · {event.time}
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-soft)' }}>
                          {event.description}
                        </p>
                      </div>
                    </article>
                  </SectionReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
