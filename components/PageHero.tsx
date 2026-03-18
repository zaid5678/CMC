'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import GeometricPattern from './GeometricPattern';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export default function PageHero({ title, subtitle, breadcrumbs = [] }: PageHeroProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'var(--color-green-deep)', paddingTop: '160px', paddingBottom: '80px' }}
    >
      <GeometricPattern variant="stars" opacity={0.06} color="gold" />

      {/* Radial glow behind text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm" style={{ color: 'rgba(232,201,122,0.7)', fontFamily: 'var(--font-body)' }}>
              <li>
                <Link href="/" className="hover:text-gold-light transition-colors" style={{ color: 'rgba(232,201,122,0.7)' }}>
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span aria-hidden="true">›</span>
                  {crumb.href && i < breadcrumbs.length - 1 ? (
                    <Link href={crumb.href} style={{ color: 'rgba(232,201,122,0.7)' }} className="hover:opacity-100 transition-opacity">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span style={{ color: 'var(--color-gold-light)' }}>{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="italic"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-ivory)',
            fontWeight: 300,
          }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            className="mt-4 text-base"
            style={{ color: 'var(--color-gold-light)', fontFamily: 'var(--font-body)', maxWidth: '560px' }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Bottom gold edge line */}
      <div
        className="absolute bottom-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)' }}
      />
    </section>
  );
}
