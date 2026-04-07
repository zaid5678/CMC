import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import SectionReveal from '@/components/SectionReveal';
import OrnamentalDivider from '@/components/OrnamentalDivider';
import GeometricPattern from '@/components/GeometricPattern';
import { getServices } from '@/lib/contentful';

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    "CMC offers daily prayers, Jumu'ah, Quran education, Arabic classes, nikah ceremonies, janazah services, community welfare, and a full Ramadan programme.",
};

const ENQUIRE_SERVICES = ['quran-education', 'arabic-language', 'nikah', 'janazah'];

export default async function ServicesPage() {
  const servicesData = await getServices();
  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Everything CMC offers — from daily prayers to community welfare, education to celebration."
        breadcrumbs={[{ label: 'Services' }]}
      />

      {servicesData.map((service, i) => {
        const isEven = i % 2 === 0;
        return (
          <section
            key={service.id}
            id={service.id}
            className="section-padding px-6 lg:px-12 relative overflow-hidden"
            style={{ background: isEven ? 'var(--color-ivory)' : 'var(--color-ivory-dark)' }}
            aria-labelledby={`service-${service.id}-heading`}
          >
            <GeometricPattern variant="stars" opacity={0.025} color="gold" />
            <div className="relative z-10 max-w-7xl mx-auto">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>

                {/* Decorative panel — alternates left/right */}
                <SectionReveal className={!isEven ? 'lg:order-2' : ''}>
                  <div
                    className="relative flex items-center justify-center overflow-hidden"
                    style={{
                      height: '320px',
                      background: isEven
                        ? 'linear-gradient(135deg, var(--color-green-deep), var(--color-green-mid))'
                        : 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.2))',
                      border: isEven ? 'none' : '1px solid rgba(201,168,76,0.4)',
                    }}
                    aria-hidden="true"
                  >
                    <span
                      className="absolute text-8xl font-bold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: isEven ? 'rgba(201,168,76,0.12)' : 'rgba(30,86,49,0.08)',
                        top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        userSelect: 'none',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                      <polygon
                        points="60,10 67,45 102,38 76,62 98,92 65,76 60,112 55,76 22,92 44,62 18,38 53,45"
                        fill={isEven ? 'rgba(201,168,76,0.25)' : 'rgba(30,86,49,0.12)'}
                        stroke={isEven ? '#C9A84C' : 'var(--color-green-deep)'}
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="60" cy="60" r="22"
                        fill={isEven ? 'rgba(201,168,76,0.15)' : 'rgba(30,86,49,0.08)'}
                        stroke={isEven ? '#C9A84C' : 'var(--color-green-deep)'}
                        strokeWidth="1"
                      />
                    </svg>
                    {/* IMAGE_PLACEHOLDER: Replace with real photo for this service */}
                  </div>
                </SectionReveal>

                {/* Text */}
                <SectionReveal delay={0.15} className={!isEven ? 'lg:order-1' : ''}>
                  <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold-dark)', fontFamily: 'var(--font-body)' }}>
                    {String(i + 1).padStart(2, '0')} / {String(servicesData.length).padStart(2, '0')}
                  </p>
                  <h2
                    id={`service-${service.id}-heading`}
                    className="mb-4"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}
                  >
                    {service.title}
                  </h2>
                  <OrnamentalDivider className="my-4" />
                  <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)', lineHeight: 1.85 }}>
                    {service.fullDescription}
                  </p>
                  {ENQUIRE_SERVICES.includes(service.id) && (
                    <Link href="/contact" className="btn-gold inline-flex" style={{ padding: '12px 28px', fontSize: '0.85rem' }}>
                      Enquire →
                    </Link>
                  )}
                </SectionReveal>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
