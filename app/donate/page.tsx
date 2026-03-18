import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import SectionReveal from '@/components/SectionReveal';
import OrnamentalDivider from '@/components/OrnamentalDivider';
import GeometricPattern from '@/components/GeometricPattern';

export const metadata: Metadata = {
  title: 'Donate',
  description:
    'Support Chelsea Muslim Community through Zakat, Sadaqah, and other charitable giving. Every donation sustains prayer, education, and community welfare in SW10.',
};

const DONATION_PURPOSES = [
  {
    id: 'zakat',
    title: 'Zakat',
    subtitle: 'Obligatory Annual Alms',
    description:
      'Zakat is one of the five pillars of Islam — an annual obligation of 2.5% on eligible wealth above the nisab threshold (currently approx. £4,800 / 85g gold equivalent). CMC distributes Zakat to eligible recipients in accordance with Islamic criteria. Please speak to Imam Ibrahim for guidance on calculating your Zakat.',
    amounts: [50, 100, 250],
  },
  {
    id: 'sadaqah',
    title: 'Sadaqah',
    subtitle: 'Voluntary Charity',
    description:
      'Sadaqah — voluntary charity given for the sake of Allah — can be given at any time, in any amount. Every pound given as Sadaqah through CMC supports the general operations of the mosque: the lights that burn for Fajr, the tea at the food bank, the welcome mat at the door.',
    amounts: [10, 25, 50],
  },
  {
    id: 'building',
    title: 'Building & Maintenance',
    subtitle: 'Keep the Mosque Running',
    description:
      '14 Blantyre Street is our home — and like every home, it needs care. The Building and Maintenance Fund covers essential upkeep: plumbing, electrical, heating, wudu facilities, and the gradual improvements that make our mosque safe, clean, and welcoming for the next generation of Chelsea\'s Muslim community.',
    amounts: [25, 50, 100],
  },
  {
    id: 'education',
    title: 'Education Fund',
    subtitle: 'Quran & Arabic Classes',
    description:
      'The Education Fund supports our Quran and Arabic teaching programme — covering teacher stipends, teaching materials, and subsidised places for families who cannot afford the full cost of classes. No child in SW10 should be unable to learn the Quran because of financial hardship.',
    amounts: [20, 50, 100],
  },
];

function PurposeIcon({ id }: { id: string }) {
  const props = { width: '40', height: '40', viewBox: '0 0 40 40', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': true as const };
  if (id === 'zakat') return (
    <svg {...props}>
      <polygon points="20,4 23,15 34,12 26,20 34,28 23,25 20,36 17,25 6,28 14,20 6,12 17,15" fill="rgba(201,168,76,0.2)" stroke="#C9A84C" strokeWidth="1.5"/>
      <circle cx="20" cy="20" r="6" fill="rgba(201,168,76,0.2)" stroke="#C9A84C" strokeWidth="1"/>
    </svg>
  );
  if (id === 'sadaqah') return (
    <svg {...props}>
      <path d="M8 22C8 22 6 18 8 14C10 10 14 10 14 10L20 16L26 10C26 10 30 10 32 14C34 18 32 22 32 22" stroke="#C9A84C" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M14 24C14 24 12 28 14 32C16 36 20 36 20 36C20 36 24 36 26 32C28 28 26 24 26 24" stroke="#C9A84C" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M14 24H26" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  if (id === 'building') return (
    <svg {...props}>
      <path d="M20 8L4 20H8V34H16V26H24V34H32V20H36L20 8Z" fill="rgba(201,168,76,0.15)" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M16 8C16 6 18 4 20 4C22 4 22 6 22 8" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="20" cy="16" r="3" fill="rgba(201,168,76,0.3)" stroke="#C9A84C" strokeWidth="1"/>
    </svg>
  );
  return (
    <svg {...props}>
      <path d="M6 10C6 10 14 8 20 12C26 8 34 10 34 10V32C34 32 26 30 20 34C14 30 6 32 6 32V10Z" fill="rgba(201,168,76,0.1)" stroke="#C9A84C" strokeWidth="1.5"/>
      <path d="M20 12V34" stroke="#C9A84C" strokeWidth="1" strokeDasharray="3 2"/>
      <path d="M12 17H17M12 21H17M12 25H17" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <path d="M23 17H28M23 21H28M23 25H28" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

export default function DonatePage() {
  return (
    <>
      <PageHero
        title="Support Our Community"
        subtitle="Every act of generosity sustains a community — and keeps a mosque's doors open for all who need them."
        breadcrumbs={[{ label: 'Donate' }]}
      />

      {/* ═══ IMPACT STATEMENT ═══ */}
      <section
        className="relative overflow-hidden py-24 px-6 lg:px-12"
        style={{ background: 'var(--color-green-deep)' }}
        aria-labelledby="impact-heading"
      >
        <GeometricPattern variant="stars" opacity={0.06} color="gold" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <SectionReveal>
            <blockquote>
              <p
                className="text-3xl md:text-4xl lg:text-5xl font-light italic leading-tight mb-6"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ivory)' }}
              >
                &ldquo;Your generosity sustains a community.&rdquo;
              </p>
              <p className="text-base max-w-lg mx-auto" style={{ color: 'rgba(248,244,236,0.7)', fontFamily: 'var(--font-body)', lineHeight: 1.8 }}>
                Chelsea Muslim Community exists because of the faith, effort, and generosity of people like you. Every donation — large or small — is an investment in prayer, in knowledge, and in the welfare of our neighbours.
              </p>
            </blockquote>
          </SectionReveal>
          <SectionReveal delay={0.15}>
            <p
              lang="ar"
              dir="rtl"
              className="mt-8 text-2xl"
              style={{ fontFamily: 'var(--font-arabic)', color: 'var(--color-gold-rich)' }}
            >
              مَّن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا فَيُضَاعِفَهُ لَهُ أَضْعَافًا كَثِيرَةً
            </p>
            <p className="mt-3 text-sm italic" style={{ color: 'rgba(232,201,122,0.65)', fontFamily: 'var(--font-body)' }}>
              &ldquo;Who will lend to Allah a goodly loan that He may multiply it for him many times over?&rdquo; — Quran 2:245
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ═══ DONATION PURPOSES ═══ */}
      <section className="section-padding px-6 lg:px-12" style={{ background: 'var(--color-ivory)' }} aria-labelledby="giving-heading">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <h2 id="giving-heading" className="text-center mb-2" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>
              Ways to Give
            </h2>
            <OrnamentalDivider />
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {DONATION_PURPOSES.map((purpose, i) => (
              <SectionReveal key={purpose.id} delay={i * 0.1}>
                <div className="card p-8 h-full flex flex-col">
                  <div className="mb-4"><PurposeIcon id={purpose.id} /></div>
                  <p className="text-xs tracking-widest uppercase font-medium mb-1" style={{ color: 'var(--color-gold-dark)', fontFamily: 'var(--font-body)' }}>
                    {purpose.subtitle}
                  </p>
                  <h3 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
                    {purpose.title}
                  </h3>
                  <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
                    {purpose.description}
                  </p>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                      Suggested amounts
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {purpose.amounts.map(amount => (
                        <span
                          key={amount}
                          className="px-4 py-2 rounded text-sm font-medium"
                          style={{
                            background: 'rgba(201,168,76,0.1)',
                            border: '1px solid rgba(201,168,76,0.4)',
                            color: 'var(--color-gold-dark)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          £{amount}
                        </span>
                      ))}
                      <span
                        className="px-4 py-2 rounded text-sm"
                        style={{
                          background: 'rgba(201,168,76,0.05)',
                          border: '1px solid rgba(201,168,76,0.2)',
                          color: 'var(--color-ink-soft)',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        Custom
                      </span>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW TO DONATE ═══ */}
      <section className="section-padding px-6 lg:px-12" style={{ background: 'var(--color-ivory-dark)' }} aria-labelledby="how-heading">
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <h2 id="how-heading" className="text-center mb-2" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>
              How to Donate
            </h2>
            <OrnamentalDivider />
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {/* Bank Transfer */}
            <SectionReveal>
              <div className="card p-8">
                <h3 className="text-xl mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
                  Bank Transfer
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Account Name', value: 'Chelsea Muslim Community' },
                    { label: 'Sort Code', value: 'XX-XX-XX', mono: true },
                    { label: 'Account Number', value: 'XXXXXXXX', mono: true },
                  ].map(({ label, value, mono }) => (
                    <div key={label}>
                      <p className="text-xs uppercase tracking-widest font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>{label}</p>
                      <p className={mono ? 'font-mono text-lg' : 'font-medium'} style={{ color: 'var(--color-ink)', fontFamily: mono ? 'monospace' : 'var(--font-body)' }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div
                  className="p-3 rounded mt-6"
                  style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)' }}
                >
                  <p className="text-xs" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                    <strong style={{ color: 'var(--color-gold-dark)' }}>Reference:</strong> Please use your full name and the purpose (e.g. &ldquo;Ahmed Khan - Zakat&rdquo;) so we can allocate correctly.
                  </p>
                </div>
              </div>
            </SectionReveal>

            {/* Online */}
            <SectionReveal delay={0.1}>
              <div className="card p-8 flex flex-col h-full">
                <h3 className="text-xl mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
                  Online Donation
                </h3>
                <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
                  We are setting up a secure online donation platform. In the meantime, please use the bank transfer details or speak to our administrator in person after any prayer time.
                </p>
                <div
                  className="p-5 rounded text-center"
                  style={{ background: 'rgba(201,168,76,0.06)', border: '1px dashed rgba(201,168,76,0.4)' }}
                >
                  <button
                    disabled
                    aria-disabled="true"
                    className="w-full justify-center btn-gold opacity-50 cursor-not-allowed mb-3 inline-flex"
                  >
                    Donate Online
                  </button>
                  <p className="text-xs italic" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
                    Online payment integration coming soon — contact us to arrange a donation.
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ═══ GIFT AID & CHARITY NOTICE ═══ */}
      <section className="py-16 px-6 lg:px-12" style={{ background: 'var(--color-ivory)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <SectionReveal>
            <div className="p-6 rounded-lg" style={{ background: 'rgba(45,122,71,0.06)', border: '1px solid rgba(45,122,71,0.2)' }}>
              <h4 className="text-lg mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>UK Gift Aid</h4>
              <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                If you are a UK taxpayer, your donation may be eligible for <strong>Gift Aid</strong> — allowing CMC to claim an additional 25p for every £1 you donate at no extra cost to you. Please speak to one of our trustees for a Gift Aid declaration form. Requires that you pay at least as much UK Income Tax as the Gift Aid claimed.
              </p>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <div className="p-6 rounded-lg" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.25)' }}>
              <h4 className="text-lg mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>Registered Charity</h4>
              <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                Chelsea Muslim Community is a registered charity in England and Wales. Registered Charity No. <strong>XXXXXXX</strong>. All donations are received and administered in accordance with charity law and Charity Commission requirements.
              </p>
              <Link href="/contact" className="inline-block mt-4 text-sm font-medium nav-link" style={{ color: 'var(--color-green-deep)', fontFamily: 'var(--font-body)' }}>
                Contact a Trustee →
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
