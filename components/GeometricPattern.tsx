'use client';

interface GeometricPatternProps {
  variant?: 'stars' | 'hexagons' | 'chevrons';
  opacity?: number;
  color?: 'gold' | 'green';
  className?: string;
}

export default function GeometricPattern({
  variant = 'stars',
  opacity = 0.04,
  color = 'gold',
  className = '',
}: GeometricPatternProps) {
  const fill = color === 'gold' ? '#C9A84C' : '#1E5631';
  const patternId = `geometric-${variant}-${color}-${Math.random().toString(36).substr(2, 5)}`;

  const StarPattern = () => (
    <pattern id={patternId} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
      {/* 8-pointed star built with two overlapping squares rotated 45deg */}
      <g fill={fill} fillRule="evenodd">
        {/* Central 8-pointed star */}
        <polygon points="30,10 33,22 45,19 36,28 45,37 33,34 30,46 27,34 15,37 24,28 15,19 27,22" />
        {/* Small 4-pointed stars at corners */}
        <polygon points="0,0 2,5 7,0 5,5 7,10 2,7 0,12 -2,7 -7,10 -5,5 -7,0 -2,5" transform="translate(0,0)" />
        <polygon points="60,0 62,5 67,0 65,5 67,10 62,7 60,12 58,7 53,10 55,5 53,0 58,5" transform="translate(0,0)" />
        <polygon points="0,60 2,65 7,60 5,65 7,70 2,67 0,72 -2,67 -7,70 -5,65 -7,60 -2,65" transform="translate(0,0)" />
        <polygon points="60,60 62,65 67,60 65,65 67,70 62,67 60,72 58,67 53,70 55,65 53,60 58,65" transform="translate(0,0)" />
      </g>
    </pattern>
  );

  const HexagonPattern = () => (
    <pattern id={patternId} x="0" y="0" width="52" height="60" patternUnits="userSpaceOnUse">
      <g fill="none" stroke={fill} strokeWidth="1">
        <polygon points="26,2 50,16 50,44 26,58 2,44 2,16" />
        <polygon points="0,30 -24,16 -24,-12 0,-26" />
        <polygon points="52,30 76,16 76,-12 52,-26" />
      </g>
    </pattern>
  );

  const ChevronPattern = () => (
    <pattern id={patternId} x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
      <g fill="none" stroke={fill} strokeWidth="1" strokeLinecap="round">
        <polyline points="0,10 10,0 20,10 30,0 40,10" />
        <polyline points="0,20 10,10 20,20 30,10 40,20" />
      </g>
    </pattern>
  );

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity }}
    >
      <defs>
        {variant === 'stars' && <StarPattern />}
        {variant === 'hexagons' && <HexagonPattern />}
        {variant === 'chevrons' && <ChevronPattern />}
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
