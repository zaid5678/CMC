import OrnamentalDivider from './OrnamentalDivider';

interface ArabicVerseProps {
  arabic: string;
  transliteration?: string;
  translation: string;
  source: string;
}

export default function ArabicVerse({ arabic, transliteration, translation, source }: ArabicVerseProps) {
  return (
    <section
      className="py-20 px-6 text-center relative overflow-hidden"
      style={{ background: 'var(--color-green-deep)' }}
    >
      {/* Subtle pattern background */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.05 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="verse-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon
                points="30,10 33,22 45,19 36,28 45,37 33,34 30,46 27,34 15,37 24,28 15,19 27,22"
                fill="#C9A84C"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#verse-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <p
          lang="ar"
          dir="rtl"
          className="text-4xl md:text-5xl leading-loose mb-6"
          style={{
            fontFamily: 'var(--font-arabic)',
            color: 'var(--color-gold-light)',
            lineHeight: '2',
          }}
        >
          {arabic}
        </p>

        {transliteration && (
          <p
            className="text-base italic mb-4"
            style={{ color: 'rgba(232,201,122,0.75)', fontFamily: 'var(--font-body)' }}
          >
            {transliteration}
          </p>
        )}

        <OrnamentalDivider className="my-6" />

        <p
          className="text-lg"
          style={{ color: 'rgba(248,244,236,0.9)', fontFamily: 'var(--font-body)', lineHeight: '1.8' }}
        >
          {translation}
        </p>

        <p
          className="mt-4 text-sm tracking-widest uppercase"
          style={{ color: 'var(--color-gold-rich)', fontFamily: 'var(--font-body)' }}
        >
          {source}
        </p>
      </div>
    </section>
  );
}
