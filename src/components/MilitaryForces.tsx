import { useState } from 'react';
import { militaryForces } from '../data/militaryData';
import type { MilitaryForce } from '../types';

function ForceBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${(value / max) * 100}%`, background: color }}
      />
    </div>
  );
}

function StatRow({ label, value, max, color, format }: {
  label: string;
  value: number | null;
  max: number;
  color: string;
  format: (v: number) => string;
}) {
  return (
    <div className="mb-2.5">
      <div className="flex justify-between items-center mb-1">
        <span className="text-slate-500 text-xs">{label}</span>
        <span className="text-slate-300 text-xs font-mono">
          {value === null ? 'Undisclosed' : format(value)}
        </span>
      </div>
      {value !== null && <ForceBar value={value} max={max} color={color} />}
    </div>
  );
}

export function MilitaryForces() {
  const [selected, setSelected] = useState<MilitaryForce>(militaryForces[0]);

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
      {/* Tab header */}
      <div className="flex border-b border-slate-700">
        {militaryForces.map((f) => (
          <button
            key={f.country}
            onClick={() => setSelected(f)}
            className="flex-1 px-3 py-3 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
            style={{
              background: selected.country === f.country ? f.color + '15' : 'transparent',
              color: selected.country === f.country ? f.color : '#64748b',
              borderBottom: selected.country === f.country ? `2px solid ${f.color}` : '2px solid transparent',
            }}
          >
            <span>{f.flag}</span>
            <span>{f.country}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Stats */}
          <div>
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-3 font-semibold">
              Force Metrics
            </div>
            <StatRow
              label="Active Personnel"
              value={selected.activePersonnel}
              max={1400000}
              color={selected.color}
              format={(v) => (v / 1000).toFixed(0) + 'K'}
            />
            <StatRow
              label="Naval Vessels"
              value={selected.navalVessels}
              max={500}
              color={selected.color}
              format={(v) => v.toString()}
            />
            <StatRow
              label="Aircraft"
              value={selected.aircraft}
              max={15000}
              color={selected.color}
              format={(v) => v.toLocaleString()}
            />
            <StatRow
              label="Defense Spend ($B)"
              value={selected.defenseSpend}
              max={900}
              color={selected.color}
              format={(v) => '$' + v.toFixed(0) + 'B'}
            />
            {selected.nuclearWarheads !== null && (
              <StatRow
                label="Nuclear Warheads"
                value={selected.nuclearWarheads}
                max={5600}
                color={selected.color}
                format={(v) => v.toLocaleString()}
              />
            )}
            {selected.nuclearWarheads === null && (
              <div className="mb-2.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-500 text-xs">Nuclear Warheads</span>
                  <span className="text-amber-400 text-xs font-mono">Unconfirmed</span>
                </div>
              </div>
            )}
          </div>

          {/* Capabilities & vulnerabilities */}
          <div>
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-3 font-semibold">
              Key Capabilities
            </div>
            <ul className="space-y-1 mb-4">
              {selected.keyCapabilities.slice(0, 5).map((cap, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-0.5 flex-shrink-0 text-xs" style={{ color: selected.color }}>▸</span>
                  <span className="text-xs text-slate-400 leading-tight">{cap}</span>
                </li>
              ))}
            </ul>
            <div className="text-slate-500 text-xs uppercase tracking-wider mb-2 font-semibold">
              Vulnerabilities
            </div>
            <ul className="space-y-1">
              {selected.vulnerabilities.slice(0, 3).map((v, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-0.5 flex-shrink-0 text-xs text-amber-500">⚠</span>
                  <span className="text-xs text-slate-500 leading-tight">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
