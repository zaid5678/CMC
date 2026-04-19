'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',             label: 'Home' },
  { href: '/about',        label: 'About' },
  { href: '/prayer-times', label: 'Prayer Times' },
  { href: '/resources',    label: 'Resources' },
  // { href: '/services',  label: 'Services' },  // hidden — re-enable when ready
  // { href: '/events',    label: 'Events' },     // hidden — re-enable when ready
  { href: '/donate',       label: 'Donate' },
  { href: '/contact',      label: 'Contact' },
];


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navBg = isHome
    ? scrolled ? 'var(--color-ivory)' : 'transparent'
    : 'var(--color-ivory)';

  const navBorder = isHome
    ? scrolled ? '1px solid rgba(201,168,76,0.4)' : '1px solid transparent'
    : '1px solid rgba(201,168,76,0.4)';

  const linkColor = isHome && !scrolled ? 'rgba(248,244,236,0.9)' : 'var(--color-ink)';

  return (
    <>
      {/* Top Bar */}
      <div
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 lg:px-12"
        style={{
          height: '36px',
          background: 'var(--color-green-deep)',
        }}
      >
        <span className="hidden sm:block" style={{ color: 'rgba(232,201,122,0.8)', fontFamily: 'var(--font-body)', fontSize: '0.75rem' }}>
          Assalamu Alaikum — Welcome to Chelsea Muslim Community
        </span>
      </div>

      {/* Main Navbar */}
      <nav
        className="fixed left-0 w-full z-40 transition-all duration-300"
        style={{
          top: '36px',
          background: navBg,
          borderBottom: navBorder,
        }}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" aria-label="Chelsea Muslim Community — Home">
            <Image
              src="/logo.png"
              alt="Chelsea Muslim Community logo"
              width={52}
              height={52}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.filter(l => l.href !== '/donate').map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link text-sm font-medium transition-colors ${pathname === link.href ? 'active' : ''}`}
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: linkColor,
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Donate CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/donate"
              className="hidden md:inline-flex btn-gold text-sm"
              style={{ padding: '10px 24px' }}
            >
              Donate
            </Link>

            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded"
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              style={{ color: linkColor }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 flex flex-col"
            style={{ background: 'var(--color-green-deep)', paddingTop: '100px' }}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <ul className="flex flex-col gap-2 px-8 py-8" role="list">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut', delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    className="block py-4 text-2xl font-light border-b"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-gold-light)',
                      borderColor: 'rgba(201,168,76,0.2)',
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="px-8 mt-4">
              <Link
                href="/donate"
                className="btn-gold w-full justify-center text-center"
                onClick={() => setMobileOpen(false)}
              >
                Donate
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
