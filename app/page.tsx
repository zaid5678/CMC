import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SectionReveal from '@/components/SectionReveal';
import OrnamentalDivider from '@/components/OrnamentalDivider';
import EventCard from '@/components/EventCard';
import GeometricPattern from '@/components/GeometricPattern';
import { getEvents, getAnnouncements, getOpeningHours, getSiteSettings } from '@/lib/contentful';

export const revalidate = 3600;

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false });

export const metadata: Metadata = {
  title: 'Chelsea Muslim Community — Mosque & Islamic Centre, SW10 London',
  description:
    'Chelsea Muslim Community (CMC) is a mosque and Islamic community centre at the heart of SW10. Join us for daily prayers, Quran education, community events, and more.',
};

function MinaretIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M24 4C22 4 20 6 20 8C20 6 16 5 16 10H20V14H16V40H32V14H28V10C28 5 24 6 24 8C24 6 22 4 24 4Z" fill="rgba(201,168,76,0.2)" stroke="#C9A84C" strokeWidth="1.5"/>
      <rect x="14" y="38" width="20" height="4" rx="1" fill="#C9A84C" opacity="0.6"/>
      <path d="M20 14H28V20C28 23 26 25 24 25C22 25 20 23 20 20V14Z" fill="rgba(201,168,76,0.15)"/>
      <circle cx="24" cy="8" r="2" fill="#C9A84C" opacity="0.8"/>
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 10C8 10 16 8 24 12C32 8 40 10 40 10V38C40 38 32 36 24 40C16 36 8 38 8 38V10Z" fill="rgba(201,168,76,0.1)" stroke="#C9A84C" strokeWidth="1.5"/>
      <path d="M24 12V40" stroke="#C9A84C" strokeWidth="1" strokeDasharray="3 2"/>
      <path d="M14 18H20M14 23H20M14 28H20" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <path d="M28 18H34M28 23H34M28 28H34" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

function HandsIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 28C12 28 10 24 12 20C14 16 18 16 18 16L24 22L30 16C30 16 34 16 36 20C38 24 36 28 36 28" stroke="#C9A84C" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M16 30C16 30 14 34 16 38C18 42 24 42 24 42C24 42 30 42 32 38C34 34 32 30 32 30" stroke="#C9A84C" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M16 30H32" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="24" cy="22" r="3" fill="rgba(201,168,76,0.3)" stroke="#C9A84C" strokeWidth="1"/>
    </svg>
  );
}

function CrescentIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M32 24C32 30.627 26.627 36 20 36C16.5 36 13.4 34.5 11.2 32.1C13 32.7 14.9 33 17 33C24.732 33 31 26.732 31 19C31 16.9 30.7 15 30.1 13.2C33.5 15.4 36 19.4 36 24Z" fill="rgba(201,168,76,0.2)" stroke="#C9A84C" strokeWidth="1.5"/>
      <circle cx="35" cy="14" r="2" fill="#C9A84C" opacity="0.8"/>
      <circle cx="38" cy="18" r="1.5" fill="#C9A84C" opacity="0.5"/>
    </svg>
  );
}

const SERVICES = [
  {
    icon: <MinaretIcon />,
    title: 'Daily Prayers',
    description:
      'Five daily prayers held every day of the year. Our prayer hall is open to all — a space of peace and community in the heart of Chelsea.',
  },
  {
    icon: <BookIcon />,
    title: 'Quran Education',
    description:
      'Classes for children and adults of all levels, from first letters to fluent recitation. Evening classes for children, Saturday mornings for adults.',
  },
  {
    icon: <HandsIcon />,
    title: 'Community Welfare',
    description:
      'Weekly food bank, welfare support, and signposting for those facing hardship — in partnership with local charities and Kensington & Chelsea Council.',
  },
  {
    icon: <CrescentIcon />,
    title: 'Events & Gatherings',
    description:
      'From Ramadan iftars and Eid celebrations to interfaith gatherings and fundraising dinners — CMC is a home for the whole community.',
  },
];

function formatAnnouncementDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function HomePage() {
  const [eventsData, announcementsData, openingHours, siteSettings] = await Promise.all([
    getEvents(),
    getAnnouncements(),
    getOpeningHours(),
    getSiteSettings(),
  ]);

  const recentEvents = [...eventsData]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const latestAnnouncements = announcementsData.slice(0, 2);

  return (
    <>
      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section
        className="relative flex items-center min-h-screen overflow-hidden"
        style={{ background: 'var(--color-green-deep)' }}
        aria-labelledby="hero-heading"
      >
        <GeometricPattern variant="stars" opacity={0.05} color="gold" />

        {/* Sunburst rays */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ zIndex: 1 }}>
          <svg
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-15"
            width="700" height="700" viewBox="0 0 700 700"
            xmlns="http://www.w3.org/2000/svg"
          >
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 15 * Math.PI) / 180;
              const x2 = 350 + 350 * Math.cos(angle);
              const y2 = 350 + 350 * Math.sin(angle);
              return (
                <line key={i} x1="350" y1="350" x2={x2} y2={y2}
                  stroke="#C9A84C"
                  strokeWidth={i % 3 === 0 ? '1.5' : '0.5'}
                  opacity={i % 3 === 0 ? 0.8 : 0.4}
                />
              );
            })}
            <circle cx="350" cy="350" r="120" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="1"/>
            <circle cx="350" cy="350" r="200" fill="none" stroke="rgba(201,168,76,0.08)" strokeWidth="1"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col lg:flex-row items-center justify-between gap-12 pt-28 pb-16">
          {/* Left: text */}
          <div className="flex-1 max-w-xl">
            <div
              className="inline-block text-xs font-medium tracking-widest uppercase mb-6 px-4 py-2 rounded"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-gold-rich)',
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.3)',
              }}
            >
              Est. in the Heart of London SW10
            </div>

            <h1
              id="hero-heading"
              className="leading-none"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300, color: 'var(--color-ivory)' }}
            >
              <span className="block">Chelsea Muslim</span>
              <span className="block italic" style={{ color: 'var(--color-gold-light)' }}>Community</span>
            </h1>

            <p
              className="mt-6 text-base leading-relaxed"
              style={{ color: 'rgba(248,244,236,0.75)', fontFamily: 'var(--font-body)', maxWidth: '440px' }}
            >
              A mosque and Islamic community centre at the heart of Chelsea. Open to all — daily prayers, Quran education, community welfare, and a place of belonging for West London&apos;s Muslim community.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link href="/prayer-times" className="btn-gold">Prayer Times</Link>
              <Link href="/about" className="btn-outline-gold">About Us</Link>
            </div>
          </div>

          {/* Right: Logo */}
          <div className="flex-shrink-0">
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <Image
                src="/logo.png"
                alt="Chelsea Muslim Community heraldic crest — a deep emerald sunburst with gold ornamental border and CMC monogram"
                fill
                className="object-contain"
                priority
                style={{ filter: 'drop-shadow(0 0 60px rgba(201,168,76,0.25))' }}
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" aria-hidden="true">
          <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(201,168,76,0.5)', fontFamily: 'var(--font-body)' }}>Scroll</span>
          <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, rgba(201,168,76,0.5), transparent)' }} />
        </div>
      </section>


      {/* ═══════════════════════════ ABOUT SNAPSHOT ═══════════════════════════ */}
      <section
        className="section-padding px-6 lg:px-12"
        style={{ background: 'var(--color-ivory)' }}
        aria-labelledby="about-snapshot-heading"
      >
        <div className="max-w-7xl mx-auto">
          <OrnamentalDivider />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-12">
            <SectionReveal>
              <blockquote
                className="text-3xl md:text-4xl lg:text-5xl font-light italic leading-snug"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold-dark)' }}
              >
                &ldquo;A place where every soul is welcomed and every heart finds its home.&rdquo;
              </blockquote>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              <h2 id="about-snapshot-heading" className="text-2xl mb-6" style={{ color: 'var(--color-green-deep)', fontFamily: 'var(--font-display)' }}>
                Rooted in Chelsea, Open to the World
              </h2>
              <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
                Chelsea Muslim Community has been a cornerstone of life in SW10 for decades — a mosque that belongs to its neighbourhood. We serve a diverse congregation drawn from Chelsea, Fulham, Kensington, and beyond, united by faith and a deep love for this corner of West London.
              </p>
              <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
                Whether you are a lifelong Muslim, someone exploring Islam for the first time, or a neighbour curious about who we are — you are welcome here. Our doors are open.
              </p>
              <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
                From five daily prayers to Quran classes, from funeral support to the weekly food bank, CMC is here for every milestone and every ordinary Tuesday.
              </p>
              <Link href="/about" className="font-medium nav-link" style={{ color: 'var(--color-green-deep)', fontFamily: 'var(--font-body)' }}>
                Our Full Story →
              </Link>
            </SectionReveal>
          </div>
          <OrnamentalDivider className="mt-12" />
        </div>
      </section>

      {/* ═══════════════════════════ SERVICES GRID ═══════════════════════════ */}
      <section
        className="section-padding px-6 lg:px-12"
        style={{ background: 'var(--color-ivory-dark)' }}
        aria-labelledby="services-heading"
      >
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-12">
              <h2 id="services-heading" style={{ color: 'var(--color-green-deep)', fontFamily: 'var(--font-display)' }}>
                How We Serve Our Community
              </h2>
              <OrnamentalDivider className="mt-4 mb-0" />
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SERVICES.map((service, i) => (
              <SectionReveal key={service.title} delay={i * 0.1}>
                <div className="card p-8 flex flex-col gap-4">
                  <div>{service.icon}</div>
                  <h3 className="text-xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)', fontWeight: 600 }}>
                    {service.title}
                  </h3>
                  <p style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)', lineHeight: 1.7, fontSize: '0.9rem' }}>
                    {service.description}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal className="text-center mt-10">
            <Link href="/services" className="btn-gold">View All Services</Link>
          </SectionReveal>
        </div>
      </section>

      {/* ═══════════════════════════ EVENTS PREVIEW ═══════════════════════════ */}
      <section
        className="section-padding px-6 lg:px-12"
        style={{ background: 'var(--color-ivory)' }}
        aria-labelledby="events-heading"
      >
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div className="flex items-end justify-between mb-4 flex-wrap gap-4">
              <h2 id="events-heading" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>
                Upcoming Events
              </h2>
              <Link href="/events" className="text-sm font-medium nav-link" style={{ color: 'var(--color-green-deep)', fontFamily: 'var(--font-body)' }}>
                See All Events →
              </Link>
            </div>
            <OrnamentalDivider />
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {recentEvents.map((event, i) => (
              <SectionReveal key={event.id} delay={i * 0.1}>
                <EventCard event={event} />
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ ANNOUNCEMENTS ═══════════════════════════ */}
      <section
        className="section-padding px-6 lg:px-12"
        style={{ background: 'var(--color-ivory-dark)' }}
        aria-labelledby="announcements-heading"
      >
        <div className="max-w-3xl mx-auto text-center">
          <SectionReveal>
            <h2 id="announcements-heading" className="mb-2" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>
              Announcements
            </h2>
            <OrnamentalDivider />
          </SectionReveal>

          <div className="space-y-6 mt-8">
            {latestAnnouncements.map((ann, i) => (
              <SectionReveal key={ann.id} delay={i * 0.1}>
                <article
                  className="p-6 rounded-lg text-left"
                  style={{ background: 'var(--color-surface)', border: '1px solid rgba(201,168,76,0.3)' }}
                >
                  <p className="text-xs mb-2 tracking-widest uppercase" style={{ color: 'var(--color-gold-dark)', fontFamily: 'var(--font-body)' }}>
                    {formatAnnouncementDate(ann.date)}
                  </p>
                  <h3 className="text-lg mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)', fontWeight: 600 }}>
                    {ann.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-ink-soft)', lineHeight: 1.7 }}>
                    {ann.excerpt}
                  </p>
                </article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FIND US ═══════════════════════════ */}
      <section
        className="section-padding px-6 lg:px-12"
        style={{ background: 'var(--color-ivory)' }}
        aria-labelledby="find-us-heading"
      >
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <h2 id="find-us-heading" className="text-center mb-2" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>
              Find Us
            </h2>
            <OrnamentalDivider />
          </SectionReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8 items-start">
            <SectionReveal>
              <div style={{ border: '1px solid rgba(201,168,76,0.3)' }}>
                <LeafletMap height={420} zoom={16} />
              </div>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
                    Chelsea Muslim Community
                  </h3>
                  <address className="not-italic space-y-1">
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>{siteSettings.addressLine1}</p>
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>{siteSettings.addressLine2}</p>
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>{siteSettings.addressLine3}</p>
                  </address>
                  <a
                    href={siteSettings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold mt-4 inline-flex"
                    style={{ padding: '10px 24px', fontSize: '0.85rem' }}
                  >
                    Get Directions
                  </a>
                </div>

                <div>
                  <h4 className="text-sm font-medium tracking-widest uppercase mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gold-dark)' }}>
                    Opening Hours
                  </h4>
                  <div className="space-y-2">
                    {openingHours.schedule.map((item) => (
                      <div key={item.day} className="flex justify-between text-sm gap-4">
                        <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', fontWeight: 500, minWidth: '90px' }}>{item.day}</span>
                        <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                    <strong style={{ color: 'var(--color-ink)' }}>Email: </strong>
                    <a href={`mailto:${siteSettings.email}`} style={{ color: 'var(--color-green-mid)' }}>
                      {siteSettings.email}
                    </a>
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                    <strong style={{ color: 'var(--color-ink)' }}>Phone: </strong>
                    <a href={`tel:${siteSettings.phone.replace(/\s/g, '')}`} style={{ color: 'var(--color-green-mid)' }}>{siteSettings.phone}</a>
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
