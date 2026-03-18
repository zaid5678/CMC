import Link from 'next/link';
import Image from 'next/image';
import GeometricPattern from './GeometricPattern';

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/prayer-times', label: 'Prayer Times' },
  { href: '/services', label: 'Services' },
  { href: '/events', label: 'Events' },
  { href: '/donate', label: 'Donate' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: 'var(--color-green-deep)' }}
      aria-label="Site footer"
    >
      <GeometricPattern variant="stars" opacity={0.06} color="gold" />

      {/* Gold top border */}
      <div
        className="absolute top-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/logo.png"
                alt="Chelsea Muslim Community logo"
                width={56}
                height={56}
                className="object-contain"
              />
              <div>
                <h3
                  className="text-lg"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ivory)', fontWeight: 600 }}
                >
                  Chelsea Muslim<br />Community
                </h3>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(248,244,236,0.65)', fontFamily: 'var(--font-body)' }}>
              Serving Chelsea, Fulham, and West London since our founding — a place of prayer, learning, and community.
            </p>
            <p
              lang="ar"
              dir="rtl"
              className="text-xl"
              style={{ fontFamily: 'var(--font-arabic)', color: 'rgba(201,168,76,0.5)' }}
            >
              بسم الله الرحمن الرحيم
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4
              className="text-sm font-medium tracking-widest uppercase mb-6"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gold-rich)' }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3" role="list">
              {QUICK_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:opacity-100"
                    style={{ color: 'rgba(248,244,236,0.65)', fontFamily: 'var(--font-body)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Visit Us */}
          <div>
            <h4
              className="text-sm font-medium tracking-widest uppercase mb-6"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gold-rich)' }}
            >
              Visit Us
            </h4>
            <address className="not-italic space-y-3">
              <p className="text-sm" style={{ color: 'rgba(248,244,236,0.75)', fontFamily: 'var(--font-body)' }}>
                14 Blantyre Street<br />
                {"Worlds End Estate"}<br />
                London SW10 0DS
              </p>
              <p className="text-sm" style={{ color: 'rgba(248,244,236,0.65)', fontFamily: 'var(--font-body)' }}>
                <a
                  href="https://maps.app.goo.gl/SKtCxw4k5V3cmt8L6"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-gold-light)' }}
                  className="hover:opacity-80 transition-opacity"
                >
                  Get Directions →
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(201,168,76,0.2)' }}
        >
          <p className="text-xs text-center sm:text-left" style={{ color: 'rgba(248,244,236,0.4)', fontFamily: 'var(--font-body)' }}>
            © 2025 Chelsea Muslim Community · Registered Charity No. XXXXXXX
          </p>
        </div>
      </div>
    </footer>
  );
}
