import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
  description: string;
  imageAlt: string;
}

const categoryColors: Record<string, { bg: string; text: string; gradient: string }> = {
  Ramadan:   { bg: 'rgba(201,168,76,0.2)', text: '#8B6914', gradient: 'linear-gradient(135deg, #1E5631, #8B6914)' },
  Education: { bg: 'rgba(45,122,71,0.2)', text: '#1E5631', gradient: 'linear-gradient(135deg, #1E5631, #2D7A47)' },
  Community: { bg: 'rgba(26,18,8,0.1)', text: '#3D3020', gradient: 'linear-gradient(135deg, #3D3020, #1E5631)' },
  Sisters:   { bg: 'rgba(201,168,76,0.15)', text: '#8B6914', gradient: 'linear-gradient(135deg, #8B6914, #C9A84C)' },
  Youth:     { bg: 'rgba(45,122,71,0.15)', text: '#2D7A47', gradient: 'linear-gradient(135deg, #2D7A47, #1E5631)' },
};

function formatDate(dateStr: string): { day: string; month: string; year: string } {
  const date = new Date(dateStr);
  return {
    day: date.getDate().toString(),
    month: date.toLocaleString('en-GB', { month: 'short' }).toUpperCase(),
    year: date.getFullYear().toString(),
  };
}

export default function EventCard({ event }: { event: Event }) {
  const { day, month, year } = formatDate(event.date);
  const colors = categoryColors[event.category] || categoryColors.Community;

  return (
    <article className="card overflow-hidden group">
      {/* Image placeholder with gradient */}
      <div
        className="relative h-48 overflow-hidden"
        style={{ background: colors.gradient }}
        aria-label={event.imageAlt}
        role="img"
      >
        {/* Pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`card-pattern-${event.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <polygon points="20,5 22,16 33,13 25,20 33,27 22,24 20,35 18,24 7,27 15,20 7,13 18,16" fill="#C9A84C" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#card-pattern-${event.id})`} />
        </svg>

        {/* Date badge */}
        <div
          className="absolute top-3 right-3 text-center px-3 py-2 rounded"
          style={{ background: 'var(--color-gold-rich)', minWidth: '52px' }}
        >
          <div
            className="text-2xl font-bold leading-none"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {day}
          </div>
          <div
            className="text-xs font-medium mt-0.5"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', letterSpacing: '0.1em' }}
          >
            {month}
          </div>
        </div>
      </div>

      <div className="p-5">
        <span
          className="category-pill mb-3 inline-block"
          style={{ background: colors.bg, color: colors.text }}
        >
          {event.category}
        </span>

        <h3
          className="mb-2 text-lg"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontWeight: 600, lineHeight: 1.2 }}
        >
          {event.title}
        </h3>

        <p
          className="text-xs mb-3"
          style={{ color: 'var(--color-gold-dark)', fontFamily: 'var(--font-body)', fontWeight: 500 }}
        >
          {event.time} · {day} {month} {year}
        </p>

        <p className="text-sm mb-4" style={{ color: 'var(--color-ink-soft)', lineHeight: 1.65 }}>
          {event.description.substring(0, 100)}…
        </p>

        <Link
          href={`/events#${event.id}`}
          className="text-sm font-medium nav-link"
          style={{ color: 'var(--color-green-deep)', fontFamily: 'var(--font-body)' }}
        >
          Learn More →
        </Link>
      </div>
    </article>
  );
}
