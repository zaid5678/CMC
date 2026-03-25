'use client';

import dynamic from 'next/dynamic';
import PageHero from '@/components/PageHero';
import SectionReveal from '@/components/SectionReveal';
import OrnamentalDivider from '@/components/OrnamentalDivider';
import { CMC_QIBLA_BEARING } from '@/lib/qibla';

const QiblaCompass = dynamic(() => import('@/components/QiblaCompass'), { ssr: false });

export default function PrayerTimesPage() {
  return (
    <>
      <PageHero
        title="Prayer Times"
        subtitle="Daily prayer times for Chelsea SW10. Jumu'ah every Friday at 12:20pm."
        breadcrumbs={[{ label: 'Prayer Times' }]}
        image={{ src: '/images/inside_pic.jpg', alt: 'Prayer hall interior of Chelsea Muslim Community mosque' }}
      />

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

      {/* ═══ MAWAQIT WIDGET ═══ */}
      <section className="section-padding px-6 lg:px-12" style={{ background: 'var(--color-ivory-dark)' }}>
        <div className="max-w-4xl mx-auto">
          <SectionReveal>
            <h2 className="mb-2 text-center" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>
              Daily Prayer Timetable
            </h2>
            <OrnamentalDivider className="my-4" />
            <div
              className="mt-8 overflow-hidden rounded-lg"
              style={{ border: '1px solid rgba(201,168,76,0.3)' }}
            >
              <iframe
                src="//mawaqit.net/en/w/chelsea-muslim-community-hub-london-sw100ds-united-kingdom?showOnly5PrayerTimes=0"
                frameBorder={0}
                scrolling="no"
                title="Chelsea Muslim Community prayer times"
                style={{ width: '100%', height: '120px', display: 'block' }}
              />
            </div>
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
