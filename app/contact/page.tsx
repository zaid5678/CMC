'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import PageHero from '@/components/PageHero';
import SectionReveal from '@/components/SectionReveal';
import OrnamentalDivider from '@/components/OrnamentalDivider';
import openingHoursData from '@/data/opening-hours.json';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false });

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText('14 Blantyre Street, Worlds End Estate, London SW10 0DS').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Come and visit us at the Worlds End Estate, or get in touch through the details below."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <section className="section-padding px-6 lg:px-12" style={{ background: 'var(--color-ivory)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* ═══ MAP + ADDRESS ═══ */}
            <SectionReveal>
              <h2 className="mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
                Find Us
              </h2>
              <OrnamentalDivider className="my-4" />

              <div className="mb-8" style={{ border: '1px solid rgba(201,168,76,0.3)' }}>
                <LeafletMap height={280} zoom={16} />
              </div>

              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-lg mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>Address</h3>
                  <address className="not-italic text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)', lineHeight: 1.9 }}>
                    14 Blantyre Street<br />
                    Worlds End Estate<br />
                    London SW10 0DS
                  </address>
                </div>
                <button
                  onClick={copyAddress}
                  className="text-xs px-3 py-1.5 rounded flex-shrink-0 transition-all mt-7"
                  style={{
                    fontFamily: 'var(--font-body)',
                    background: copied ? 'rgba(45,122,71,0.15)' : 'rgba(201,168,76,0.1)',
                    border: `1px solid ${copied ? 'rgba(45,122,71,0.4)' : 'rgba(201,168,76,0.4)'}`,
                    color: copied ? 'var(--color-green-deep)' : 'var(--color-gold-dark)',
                    cursor: 'pointer',
                  }}
                  aria-label="Copy address to clipboard"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* ═══ GETTING HERE ═══ */}
              <h3 className="text-lg mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>Getting Here</h3>

              <div className="space-y-5">
                {/* Tube */}
                <div className="flex gap-4">
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
                    style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.35)' }}
                    aria-hidden="true"
                  >
                    {/* Underground roundel */}
                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="9" cy="9" r="7.5" fill="none" stroke="#C9A84C" strokeWidth="1.4"/>
                      <line x1="1.5" y1="9" x2="16.5" y2="9" stroke="#C9A84C" strokeWidth="2.8" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>
                      Nearest Tube Stations
                    </p>
                    <ul className="text-sm space-y-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                      <li><span style={{ color: 'var(--color-ink)' }}>Fulham Broadway</span> (District line) — approx. 15 min walk</li>
                      <li><span style={{ color: 'var(--color-ink)' }}>Imperial Wharf</span> (National Rail &amp; London Overground / Mildmay line) — approx. 15 min walk</li>
                      <li><span style={{ color: 'var(--color-ink)' }}>Sloane Square</span> (Circle &amp; District lines) — approx. 20 min walk</li>
                      <li><span style={{ color: 'var(--color-ink)' }}>South Kensington</span> (District, Circle &amp; Piccadilly lines) — approx. 20 min walk</li>
                    </ul>
                  </div>
                </div>

                {/* Bus */}
                <div className="flex gap-4">
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
                    style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.35)' }}
                    aria-hidden="true"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="4" width="14" height="9" rx="2" fill="none" stroke="#C9A84C" strokeWidth="1.4"/>
                      <line x1="2" y1="8" x2="16" y2="8" stroke="#C9A84C" strokeWidth="1.2"/>
                      <circle cx="5" cy="14.5" r="1.5" fill="#C9A84C"/>
                      <circle cx="13" cy="14.5" r="1.5" fill="#C9A84C"/>
                      <line x1="6" y1="4" x2="6" y2="8" stroke="#C9A84C" strokeWidth="1"/>
                      <line x1="12" y1="4" x2="12" y2="8" stroke="#C9A84C" strokeWidth="1"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>
                      Nearest Bus Routes
                    </p>
                    <ul className="text-sm space-y-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                      <li><span style={{ color: 'var(--color-ink)' }}>328</span> — King&apos;s Road / Worlds End (closest stop)</li>
                      <li><span style={{ color: 'var(--color-ink)' }}>22</span> — King&apos;s Road (Putney to Piccadilly)</li>
                      <li><span style={{ color: 'var(--color-ink)' }}>11</span> — King&apos;s Road (Hammersmith to Liverpool Street)</li>
                      <li><span style={{ color: 'var(--color-ink)' }}>319</span> — Sloane Square to Streatham</li>
                    </ul>
                  </div>
                </div>
              </div>
            </SectionReveal>

            {/* ═══ OPENING HOURS ═══ */}
            <SectionReveal delay={0.15}>
              <h2 className="mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
                Opening Hours
              </h2>
              <OrnamentalDivider className="my-4" />

              <div className="space-y-3 mb-10">
                {openingHoursData.schedule.map(item => (
                  <div key={item.day} className="flex justify-between text-sm gap-4 pb-3" style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', fontWeight: 500, minWidth: '100px' }}>{item.day}</span>
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)', textAlign: 'right' }}>{item.hours}</span>
                  </div>
                ))}
              </div>

              {/* ═══ SAFEGUARDING BOX ═══ */}
              <div
                className="p-6 rounded-lg"
                style={{ border: '2px solid rgba(201,168,76,0.5)', background: 'rgba(248,244,236,0.6)' }}
                role="complementary"
                aria-labelledby="safeguarding-heading"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)' }}
                    aria-hidden="true"
                  >
                    <svg width="20" height="20" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 2L3 6.5V12C3 16.14 6.41 19.99 11 21C15.59 19.99 19 16.14 19 12V6.5L11 2Z" fill="rgba(201,168,76,0.2)" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round"/>
                      <line x1="11" y1="9" x2="11" y2="13" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="11" cy="15.5" r="1" fill="#C9A84C"/>
                    </svg>
                  </div>
                  <div>
                    <h3 id="safeguarding-heading" className="text-lg mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
                      Safeguarding &amp; Concerns
                    </h3>
                    <p className="text-sm leading-relaxed mb-3" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                      Chelsea Muslim Community is committed to the safeguarding and wellbeing of all who use our services, particularly children and vulnerable adults. We take all concerns seriously and in confidence.
                    </p>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                      In cases of immediate risk, always call{' '}
                      <strong style={{ color: 'var(--color-ink)' }}>999</strong>
                      {' '}or the NSPCC Helpline on{' '}
                      <a href="tel:08088005000" style={{ color: 'var(--color-green-mid)', fontWeight: 500 }}>0808 800 5000</a>.
                    </p>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
