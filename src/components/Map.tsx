import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Location } from '../types';
import { strategicLocations, shippingLanes } from '../data/militaryData';

// Fix Leaflet's default icon path issue with bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapProps {
  highlightCountry?: 'iran' | 'israel' | 'usa' | null;
}

const countryColors: Record<string, string> = {
  iran: '#ef4444',
  israel: '#a78bfa',
  usa: '#3b82f6',
  neutral: '#f59e0b',
  proxy: '#f97316',
};

const typeEmoji: Record<string, string> = {
  nuclear: '☢',
  military: '⬡',
  naval: '⚓',
  airbase: '✈',
  chokepoint: '⚠',
  capital: '★',
  missile: '🚀',
  oil: '⛽',
  irgc: '◈',
  radar: '◎',
};

const typeLabel: Record<string, string> = {
  nuclear: 'Nuclear Facility',
  military: 'Military Base',
  naval: 'Naval Base',
  airbase: 'Air Base',
  chokepoint: 'Strategic Chokepoint',
  capital: 'Capital / Command',
  missile: 'Missile Base',
  oil: 'Oil Infrastructure',
  irgc: 'IRGC Facility',
  radar: 'Radar / C2',
};

const significanceSize: Record<string, number> = {
  critical: 38,
  high: 32,
  medium: 26,
};

function createMarkerIcon(location: Location): L.DivIcon {
  const color = countryColors[location.country] ?? '#94a3b8';
  const emoji = typeEmoji[location.type] ?? '●';
  const size = significanceSize[location.significance ?? 'medium'];
  const isCritical = location.significance === 'critical';

  const html = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color}22;
      border: 2px solid ${color}${isCritical ? '' : '99'};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${size * 0.44}px;
      box-shadow: 0 0 ${isCritical ? 12 : 6}px ${color}${isCritical ? '66' : '33'};
      cursor: pointer;
      transition: all 0.15s;
      position: relative;
    ">
      ${emoji}
      ${isCritical ? `<div style="
        position: absolute;
        top: -3px; right: -3px;
        width: 8px; height: 8px;
        background: ${color};
        border-radius: 50%;
        animation: pulse 1.5s infinite;
        box-shadow: 0 0 4px ${color};
      "></div>` : ''}
    </div>`;

  return L.divIcon({
    html,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function buildPopupHTML(loc: Location): string {
  const color = countryColors[loc.country] ?? '#94a3b8';
  const emoji = typeEmoji[loc.type] ?? '●';
  const label = typeLabel[loc.type] ?? loc.type;
  const capsList = loc.capabilities
    ? loc.capabilities.map((c) => `<li style="color:#94a3b8;font-size:11px;margin-bottom:3px">• ${c}</li>`).join('')
    : '';
  const sigBadge = loc.significance
    ? `<span style="font-size:10px;padding:1px 6px;border-radius:3px;background:${color}22;color:${color};border:1px solid ${color}44;text-transform:uppercase;letter-spacing:0.05em">${loc.significance}</span>`
    : '';

  return `
    <div style="
      background:#0f172a;
      border:1px solid #334155;
      border-radius:8px;
      padding:12px;
      min-width:240px;
      max-width:300px;
      font-family:ui-monospace,monospace;
      color:#e2e8f0;
    ">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:20px">${emoji}</span>
        <div>
          <div style="font-weight:700;font-size:13px;color:#fff;line-height:1.2">${loc.name}</div>
          <div style="font-size:10px;color:${color};text-transform:uppercase;letter-spacing:0.08em">${label}</div>
        </div>
        ${sigBadge}
      </div>
      <p style="color:#94a3b8;font-size:11px;margin:0 0 8px;line-height:1.5">${loc.description}</p>
      ${loc.details ? `<p style="color:#64748b;font-size:10px;margin:0 0 8px;line-height:1.5;border-top:1px solid #1e293b;padding-top:8px">${loc.details}</p>` : ''}
      ${capsList ? `<ul style="margin:0;padding:0;list-style:none;border-top:1px solid #1e293b;padding-top:8px">${capsList}</ul>` : ''}
      ${loc.personnel ? `<div style="margin-top:8px;font-size:10px;color:#64748b">Personnel: <span style="color:#e2e8f0">${loc.personnel.toLocaleString()}</span></div>` : ''}
      <div style="margin-top:4px;font-size:10px;color:#334155">${loc.lat.toFixed(4)}°N, ${loc.lng.toFixed(4)}°E</div>
    </div>`;
}

export function Map({ highlightCountry }: MapProps) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const lanesRef = useRef<L.Polyline[]>([]);
  const [selected, setSelected] = useState<Location | null>(null);
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Initialize map
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    const map = L.map(mapDivRef.current, {
      center: [29, 50],
      zoom: 5,
      zoomControl: true,
      attributionControl: true,
    });

    // CartoDB Dark Matter — professional dark military aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 14,
    }).addTo(map);

    // Inject pulse animation style
    const style = document.createElement('style');
    style.textContent = `
      @keyframes markerPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.15); opacity: 0.8; }
      }
      .leaflet-popup-content-wrapper {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
      }
      .leaflet-popup-content {
        margin: 0 !important;
      }
      .leaflet-popup-tip-container { display: none !important; }
      .leaflet-container { font-family: ui-monospace, monospace; }
    `;
    document.head.appendChild(style);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      document.head.removeChild(style);
    };
  }, []);

  // Add/update markers when filter changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Remove old shipping lanes
    lanesRef.current.forEach((l) => l.remove());
    lanesRef.current = [];

    // Add shipping lanes
    shippingLanes.forEach((lane) => {
      const latlngs: L.LatLngTuple[] = lane.points.map(([lng, lat]) => [lat, lng]);
      const poly = L.polyline(latlngs, {
        color: '#38bdf8',
        weight: 2,
        opacity: 0.5,
        dashArray: '6, 4',
      }).addTo(map);
      poly.bindTooltip(`<div style="background:#0f172a;border:1px solid #0ea5e9;color:#38bdf8;font-size:11px;padding:4px 8px;border-radius:4px;font-family:ui-monospace,monospace">${lane.name}<br><span style="color:#64748b">${(lane.bblPerDay / 1000000).toFixed(1)}M bbl/day</span></div>`, {
        sticky: true,
        className: 'leaflet-dark-tooltip',
      });
      lanesRef.current.push(poly);
    });

    // Filter and add location markers
    const filtered = strategicLocations.filter((loc) => {
      if (filterCountry !== 'all' && loc.country !== filterCountry) return false;
      if (filterType !== 'all' && loc.type !== filterType) return false;
      if (highlightCountry && loc.country !== highlightCountry && loc.country !== 'neutral') return false;
      return true;
    });

    filtered.forEach((loc) => {
      const icon = createMarkerIcon(loc);
      const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map);

      marker.bindPopup(buildPopupHTML(loc), {
        maxWidth: 320,
        className: 'dark-popup',
      });

      marker.on('click', () => setSelected(loc));
      marker.on('popupclose', () => setSelected(null));

      markersRef.current.push(marker);
    });
  }, [filterCountry, filterType, highlightCountry]);

  const countryFilters = [
    { id: 'all', label: 'All', color: '#94a3b8' },
    { id: 'iran', label: 'Iran', color: '#ef4444' },
    { id: 'usa', label: 'USA', color: '#3b82f6' },
    { id: 'israel', label: 'Israel', color: '#a78bfa' },
    { id: 'neutral', label: 'Neutral', color: '#f59e0b' },
  ];

  const typeFilters = [
    { id: 'all', label: 'All Types' },
    { id: 'nuclear', label: '☢ Nuclear' },
    { id: 'missile', label: '🚀 Missile' },
    { id: 'airbase', label: '✈ Airbase' },
    { id: 'naval', label: '⚓ Naval' },
    { id: 'oil', label: '⛽ Oil' },
    { id: 'irgc', label: '◈ IRGC' },
    { id: 'chokepoint', label: '⚠ Chokepoint' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-slate-700 bg-slate-900 px-3 py-2 flex flex-wrap items-center gap-2">
        {/* Country filter */}
        <div className="flex items-center gap-1 flex-wrap">
          {countryFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterCountry(f.id)}
              className="text-xs px-2 py-1 rounded border transition-all cursor-pointer"
              style={{
                borderColor: filterCountry === f.id ? f.color : '#334155',
                color: filterCountry === f.id ? f.color : '#64748b',
                background: filterCountry === f.id ? f.color + '18' : 'transparent',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-slate-700 hidden sm:block" />

        {/* Type filter */}
        <div className="flex items-center gap-1 flex-wrap">
          {typeFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className="text-xs px-2 py-1 rounded border transition-all cursor-pointer"
              style={{
                borderColor: filterType === f.id ? '#60a5fa' : '#334155',
                color: filterType === f.id ? '#60a5fa' : '#64748b',
                background: filterType === f.id ? '#60a5fa18' : 'transparent',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />
        <span className="text-slate-600 text-xs font-mono hidden md:block">
          {strategicLocations.length} assets · Click marker for details
        </span>
      </div>

      {/* Map container */}
      <div style={{ position: 'relative' }}>
        <div
          ref={mapDivRef}
          style={{ height: '480px', width: '100%', background: '#0f172a' }}
        />

        {/* Selected asset overlay */}
        {selected && (
          <div
            className="absolute bottom-4 left-4 z-50 bg-slate-900/95 border border-slate-600 rounded-xl p-3 max-w-xs backdrop-blur"
            style={{ boxShadow: '0 0 20px rgba(0,0,0,0.7)' }}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <div className="text-white font-bold text-sm">{selected.name}</div>
                <div
                  className="text-xs uppercase tracking-wider"
                  style={{ color: countryColors[selected.country] }}
                >
                  {typeLabel[selected.type]} · {selected.country.toUpperCase()}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-500 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">{selected.description}</p>
          </div>
        )}

        {/* Legend */}
        <div
          className="absolute top-3 right-3 z-50 bg-slate-900/90 border border-slate-700 rounded-lg p-2.5 backdrop-blur"
        >
          <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">Forces</div>
          {[
            { country: 'iran', label: 'Iran', color: '#ef4444' },
            { country: 'usa', label: 'USA', color: '#3b82f6' },
            { country: 'israel', label: 'Israel', color: '#a78bfa' },
            { country: 'neutral', label: 'Chokepoint / Oil', color: '#f59e0b' },
          ].map((f) => (
            <div key={f.country} className="flex items-center gap-2 mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full border"
                style={{ background: f.color + '30', borderColor: f.color }}
              />
              <span className="text-slate-400 text-xs">{f.label}</span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-6 h-px border-t-2 border-dashed border-sky-400 opacity-60" />
              <span className="text-slate-500 text-xs">Shipping lane</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attribution bar */}
      <div className="border-t border-slate-800 px-3 py-1.5 flex items-center justify-between">
        <span className="text-slate-700 text-xs font-mono">
          Coordinates: Approximate open-source estimates
        </span>
        <span className="text-slate-700 text-xs">
          Map © OpenStreetMap / CARTO
        </span>
      </div>
    </div>
  );
}
