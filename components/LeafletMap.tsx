'use client';

import { useEffect, useRef } from 'react';

interface LeafletMapProps {
  height?: number | string;
  zoom?: number;
}

export default function LeafletMap({ height = 400, zoom = 16 }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      // Leaflet CSS loaded via next.config or global import

      const lat = 51.4807789;
      const lng = -0.178287;

      const map = L.map(mapRef.current!, {
        center: [lat, lng],
        zoom,
        zoomControl: true,
        attributionControl: true,
      });

      // CartoDB Voyager tiles (warm, non-API-key)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map);

      // Custom gold SVG marker
      const goldIcon = L.divIcon({
        className: '',
        html: `
          <svg width="36" height="48" viewBox="0 0 36 48" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="pin-shadow" x="-30%" y="-10%" width="160%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)" />
              </filter>
            </defs>
            <path
              d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.059 27.941 0 18 0z"
              fill="#1E5631"
              filter="url(#pin-shadow)"
            />
            <circle cx="18" cy="18" r="10" fill="#C9A84C" />
            <polygon
              points="18,11 19.8,16.4 25.4,16.4 20.8,19.8 22.6,25.2 18,21.8 13.4,25.2 15.2,19.8 10.6,16.4 16.2,16.4"
              fill="#1E5631"
            />
          </svg>
        `,
        iconSize: [36, 48],
        iconAnchor: [18, 48],
        popupAnchor: [0, -50],
      });

      const marker = L.marker([lat, lng], { icon: goldIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: 'DM Sans', sans-serif; padding: 8px;">
          <strong style="font-family: Georgia, serif; color: #1E5631; font-size: 14px;">Chelsea Muslim Community</strong><br>
          <span style="color: #3D3020; font-size: 12px;">14 Blantyre St, SW10 0DS</span><br>
          <a href="https://maps.app.goo.gl/SKtCxw4k5V3cmt8L6" target="_blank" rel="noopener noreferrer"
             style="color: #C9A84C; font-size: 12px; text-decoration: none; display: inline-block; margin-top: 6px;">
            Get Directions →
          </a>
        </div>
      `);

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [zoom]);

  return (
    <div
      ref={mapRef}
      style={{ height: typeof height === 'number' ? `${height}px` : height, width: '100%' }}
      aria-label="Map showing Chelsea Muslim Community location at 14 Blantyre St, SW10"
      role="application"
    />
  );
}
