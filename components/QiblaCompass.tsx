'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface QiblaCompassProps {
  bearing: number;
}

export default function QiblaCompass({ bearing }: QiblaCompassProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const cardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const cardinalAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: 240, height: 240 }}>
        {/* Compass circle */}
        <svg width="240" height="240" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
          {/* Outer decorative ring */}
          <circle cx="120" cy="120" r="115" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
          <circle cx="120" cy="120" r="108" fill="rgba(30,86,49,0.05)" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" />

          {/* Tick marks */}
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = (i * 5 * Math.PI) / 180;
            const isCardinal = i % 18 === 0;
            const isOrdinal = i % 9 === 0 && !isCardinal;
            const innerR = isCardinal ? 90 : isOrdinal ? 94 : 97;
            const outerR = 104;
            const x1 = 120 + innerR * Math.sin(angle);
            const y1 = 120 - innerR * Math.cos(angle);
            const x2 = 120 + outerR * Math.sin(angle);
            const y2 = 120 - outerR * Math.cos(angle);
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isCardinal ? 'rgba(201,168,76,0.8)' : 'rgba(201,168,76,0.35)'}
                strokeWidth={isCardinal ? 2 : 1}
              />
            );
          })}

          {/* Cardinal direction labels */}
          {cardinalAngles.map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = 120 + 80 * Math.sin(rad);
            const y = 120 - 80 * Math.cos(rad) + 4;
            return (
              <text
                key={i}
                x={x} y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={i % 2 === 0 ? '12' : '9'}
                fontWeight={i % 2 === 0 ? '600' : '400'}
                fill={i % 2 === 0 ? 'rgba(201,168,76,0.9)' : 'rgba(201,168,76,0.5)'}
                fontFamily="DM Sans, sans-serif"
              >
                {cardinals[i]}
              </text>
            );
          })}

          {/* Centre dot */}
          <circle cx="120" cy="120" r="6" fill="var(--color-green-deep)" />
          <circle cx="120" cy="120" r="3" fill="var(--color-gold-rich)" />
        </svg>

        {/* Animated Qibla needle */}
        <motion.div
          className="absolute inset-0"
          initial={{ rotate: 0 }}
          animate={{ rotate: animated ? bearing : 0 }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          style={{ transformOrigin: '50% 50%' }}
        >
          <svg width="240" height="240" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
            {/* Needle pointing to qibla */}
            <polygon
              points="120,30 124,118 116,118"
              fill="var(--color-gold-rich)"
              opacity="0.95"
            />
            <polygon
              points="120,210 124,122 116,122"
              fill="rgba(201,168,76,0.3)"
            />
            {/* Kaaba icon at needle tip */}
            <rect x="112" y="20" width="16" height="16" rx="2" fill="var(--color-ink)" />
            <rect x="115" y="23" width="10" height="10" rx="1" fill="rgba(201,168,76,0.8)" />
          </svg>
        </motion.div>
      </div>

      <div className="text-center">
        <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
          Qibla Direction
        </p>
        <p className="text-2xl font-semibold mt-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
          {bearing}° South-East
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}>
          From Chelsea SW10 toward Mecca
        </p>
      </div>
    </div>
  );
}
