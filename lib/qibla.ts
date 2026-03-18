/**
 * Calculates the Qibla bearing (direction to Mecca) from a given location.
 * Uses the spherical law of cosines / forward azimuth formula.
 */

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Returns the bearing in degrees (0–360) from a given location toward the Kaaba.
 * 0 = North, 90 = East, 180 = South, 270 = West.
 */
export function calculateQiblaBearing(lat: number, lng: number): number {
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA_LAT);
  const Δλ = toRad(KAABA_LNG - lng);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  const bearing = (toDeg(θ) + 360) % 360;

  return Math.round(bearing * 10) / 10;
}

// Pre-calculated bearing for CMC (lat: 51.4847, lng: -0.1788)
export const CMC_QIBLA_BEARING = calculateQiblaBearing(51.4847, -0.1788);
// ≈ 119° (South-East, toward Mecca from London)
