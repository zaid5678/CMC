import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import SectionReveal from '@/components/SectionReveal';
import OrnamentalDivider from '@/components/OrnamentalDivider';
import ArabicVerse from '@/components/ArabicVerse';
import { getAboutContent, getTeamMembers } from '@/lib/contentful';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Chelsea Muslim Community — our history, mission, and the team serving the Muslim community in Chelsea, Fulham, and West London.',
};

export default async function AboutPage() {
  const [about, teamData] = await Promise.all([getAboutContent(), getTeamMembers()]);

  const principles = [
    { title: about.principle1Title, description: about.principle1Description },
    { title: about.principle2Title, description: about.principle2Description },
    { title: about.principle3Title, description: about.principle3Description },
  ];

  const values = about.values.split(',').map((v) => v.trim()).filter(Boolean);

  return (
    <>
      <PageHero
        title="About Us"
        subtitle="The story of Chelsea Muslim Community — our history, our people, and our purpose."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      {/* ═══ OUR HISTORY ═══ */}
      <section className="section-padding px-6 lg:px-12" style={{ background: 'var(--color-ivory)' }} aria-labelledby="history-heading">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <SectionReveal>
              <div className="relative overflow-hidden" style={{ height: '450px' }}>
                <Image
                  src="/images/outside_pic.jpg"
                  alt="Chelsea Muslim Community mosque exterior on Blantyre Street, Worlds End Estate"
                  fill
                  className="object-cover"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-6"
                  style={{ background: 'linear-gradient(to top, rgba(30,86,49,0.85), transparent)' }}
                >
                  <p className="text-sm italic" style={{ color: 'var(--color-gold-light)', fontFamily: 'var(--font-display)' }}>
                    Chelsea Muslim Community — serving SW10 for generations
                  </p>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              <h2 id="history-heading" className="mb-6" style={{ color: 'var(--color-green-deep)', fontFamily: 'var(--font-display)' }}>
                Our History
              </h2>
              <div className="space-y-5">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
                  {about.historyParagraph1}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
                  {about.historyParagraph2}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
                  {about.historyParagraph3}
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ═══ OUR MISSION ═══ */}
      <section className="section-padding px-6 lg:px-12" style={{ background: 'var(--color-ivory-dark)' }} aria-labelledby="mission-heading">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-12">
              <h2 id="mission-heading" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>Our Mission</h2>
              <OrnamentalDivider />
              <p className="mt-6 max-w-2xl mx-auto text-sm" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)', lineHeight: 1.8 }}>
                {about.missionStatement}
              </p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {principles.map((principle, i) => (
              <SectionReveal key={principle.title} delay={i * 0.1}>
                <div className="card p-8 text-center h-full">
                  <div
                    className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.4)' }}
                  >
                    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <polygon points="16,3 18.5,12 27.5,10 22,17 27.5,24 18.5,22 16,31 13.5,22 4.5,24 10,17 4.5,10 13.5,12"
                        fill="rgba(201,168,76,0.3)" stroke="#C9A84C" strokeWidth="1"/>
                    </svg>
                  </div>
                  <h3 className="text-xl mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
                    {principle.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
                    {principle.description}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QURANIC VERSE ═══ */}
      <ArabicVerse
        arabic="وَلْتَكُن مِّنكُمْ أُمَّةٌ يَدْعُونَ إِلَى الْخَيْرِ وَيَأْمُرُونَ بِالْمَعْرُوفِ وَيَنْهَوْنَ عَنِ الْمُنكَرِ"
        transliteration="Waltakun minkum ummatun yad'una ila al-khayri wa ya'muruna bil-ma'rufi wa yanhawna 'an al-munkar"
        translation="Let there be among you a group of people who invite to what is good, enjoin what is right, and forbid what is wrong — it is they who shall succeed."
        source="Quran 3:104"
      />

      {/* ═══ THE TEAM ═══ */}
      {teamData.length > 0 && (
        <section className="section-padding px-6 lg:px-12" style={{ background: 'var(--color-ivory)' }} aria-labelledby="team-heading">
          <div className="max-w-7xl mx-auto">
            <SectionReveal>
              <div className="text-center mb-12">
                <h2 id="team-heading" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>Our Team</h2>
                <OrnamentalDivider />
              </div>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamData.map((member, i) => (
                <SectionReveal key={member.id} delay={i * 0.12}>
                  <div className="card p-8 text-center">
                    <div
                      className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, var(--color-green-deep), var(--color-green-mid))',
                        color: 'var(--color-gold-light)',
                        fontFamily: 'var(--font-display)',
                        border: '3px solid rgba(201,168,76,0.4)',
                      }}
                      aria-label={`${member.name} — profile avatar`}
                    >
                      {member.initials}
                    </div>
                    <h3 className="text-xl mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
                      {member.name}
                    </h3>
                    <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gold-dark)' }}>
                      {member.role}
                    </p>
                    <p className="text-sm leading-relaxed text-left" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
                      {member.bio}
                    </p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ VALUES ═══ */}
      <section className="section-padding px-6 lg:px-12" style={{ background: 'var(--color-ivory-dark)' }} aria-labelledby="values-heading">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <h2 id="values-heading" className="text-center mb-8" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>
              Our Values
            </h2>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4">
              {values.map((value) => (
                <div
                  key={value}
                  className="flex items-center gap-3 px-6 py-3 rounded-full"
                  style={{ background: 'var(--color-surface)', border: '1px solid rgba(201,168,76,0.4)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <polygon points="6,0.5 7.2,4.5 11.5,4.5 8,7 9.2,11 6,8.5 2.8,11 4,7 0.5,4.5 4.8,4.5" fill="#C9A84C"/>
                  </svg>
                  <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', fontSize: '0.9rem', fontWeight: 500 }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2} className="text-center mt-12">
            <Link href="/contact" className="btn-gold">Get In Touch</Link>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
