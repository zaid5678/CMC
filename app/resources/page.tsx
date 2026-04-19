import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import SectionReveal from '@/components/SectionReveal';
import OrnamentalDivider from '@/components/OrnamentalDivider';
import { getResources } from '@/lib/contentful';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Download prayer timetables, leaflets, forms, and other resources from Chelsea Muslim Community.',
};

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}

export default async function ResourcesPage() {
  const resources = await getResources();

  const categories = resources.length
    ? ['All', ...Array.from(new Set(resources.map(r => r.category))).sort()]
    : [];

  const grouped = categories
    .filter(c => c !== 'All')
    .reduce<Record<string, typeof resources>>((acc, cat) => {
      acc[cat] = resources.filter(r => r.category === cat);
      return acc;
    }, {});

  return (
    <>
      <PageHero
        title="Resources"
        subtitle="Download prayer timetables, leaflets, forms, and other useful documents."
        breadcrumbs={[{ label: 'Resources' }]}
      />

      <section className="section-padding px-6 lg:px-12" style={{ background: 'var(--color-ivory)' }}>
        <div className="max-w-5xl mx-auto">

          {resources.length === 0 ? (
            <SectionReveal>
              <div className="text-center py-20">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--color-gold-dark)' }}
                >
                  <FileIcon />
                </div>
                <h2 className="mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
                  No resources yet
                </h2>
                <p className="text-sm" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
                  Check back soon — downloadable documents will appear here.
                </p>
              </div>
            </SectionReveal>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-14">
                <SectionReveal>
                  <h2 className="mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
                    {category}
                  </h2>
                  <OrnamentalDivider className="mb-8" />
                </SectionReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((resource, i) => (
                    <SectionReveal key={resource.id} delay={i * 0.05}>
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-4 p-5 rounded-lg transition-all"
                        style={{
                          background: 'var(--color-surface)',
                          border: '1px solid rgba(201,168,76,0.25)',
                          textDecoration: 'none',
                        }}
                      >
                        <div
                          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors"
                          style={{
                            background: 'rgba(201,168,76,0.1)',
                            border: '1px solid rgba(201,168,76,0.3)',
                            color: 'var(--color-gold-dark)',
                          }}
                        >
                          <FileIcon />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className="font-medium mb-1 leading-snug"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)', fontSize: '1rem' }}
                          >
                            {resource.title}
                          </p>
                          {resource.description && (
                            <p
                              className="text-sm leading-relaxed"
                              style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}
                            >
                              {resource.description}
                            </p>
                          )}
                        </div>

                        <div
                          className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded self-start"
                          style={{
                            background: 'var(--color-green-deep)',
                            color: 'var(--color-gold-light)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          <DownloadIcon />
                          PDF
                        </div>
                      </a>
                    </SectionReveal>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
