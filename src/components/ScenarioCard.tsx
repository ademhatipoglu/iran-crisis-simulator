import type { Decision } from '../types';

interface Props {
  decision: Decision;
  onSelect: (decision: Decision) => void;
  disabled?: boolean;
}

const typeConfig = {
  diplomatic: {
    label: 'Diplomatic Track',
    color: '#34d399',
    bgColor: '#34d39910',
    borderColor: '#34d39940',
    icon: '🕊',
    badge: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
  },
  'limited-military': {
    label: 'Limited Military',
    color: '#60a5fa',
    bgColor: '#60a5fa10',
    borderColor: '#60a5fa40',
    icon: '⚔',
    badge: 'bg-blue-900/50 text-blue-300 border-blue-700',
  },
  escalation: {
    label: 'Escalation',
    color: '#f87171',
    bgColor: '#f8717110',
    borderColor: '#f8717140',
    icon: '🔺',
    badge: 'bg-red-900/50 text-red-300 border-red-700',
  },
  'de-escalation': {
    label: 'De-escalation',
    color: '#a78bfa',
    bgColor: '#a78bfa10',
    borderColor: '#a78bfa40',
    icon: '🤝',
    badge: 'bg-violet-900/50 text-violet-300 border-violet-700',
  },
  covert: {
    label: 'Covert Action',
    color: '#fb923c',
    bgColor: '#fb923c10',
    borderColor: '#fb923c40',
    icon: '◉',
    badge: 'bg-orange-900/50 text-orange-300 border-orange-700',
  },
  sanctions: {
    label: 'Economic Pressure',
    color: '#fbbf24',
    bgColor: '#fbbf2410',
    borderColor: '#fbbf2440',
    icon: '💹',
    badge: 'bg-amber-900/50 text-amber-300 border-amber-700',
  },
};

function DeltaBadge({ value, positiveIsBad, unit }: { value: number; positiveIsBad: boolean; unit?: string }) {
  if (value === 0) return null;
  const isBad = positiveIsBad ? value > 0 : value < 0;
  return (
    <span
      className={`text-xs font-mono px-1.5 py-0.5 rounded ${isBad ? 'bg-red-900/40 text-red-400' : 'bg-emerald-900/40 text-emerald-400'}`}
    >
      {value > 0 ? '+' : ''}{value}{unit}
    </span>
  );
}

export function ScenarioCard({ decision, onSelect, disabled }: Props) {
  const cfg = typeConfig[decision.type] ?? typeConfig.diplomatic;
  const probabilityColor =
    decision.probability >= 40 ? '#34d399' :
    decision.probability >= 25 ? '#eab308' : '#f87171';

  return (
    <button
      onClick={() => !disabled && onSelect(decision)}
      disabled={disabled}
      className="w-full text-left group relative rounded-xl border transition-all duration-200 p-4 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-900"
      style={{
        background: cfg.bgColor,
        borderColor: cfg.borderColor,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.borderColor = cfg.color + '80';
          (e.currentTarget as HTMLElement).style.background = cfg.bgColor.replace('10', '18');
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = cfg.borderColor;
        (e.currentTarget as HTMLElement).style.background = cfg.bgColor;
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-2.5">
        <span className="text-xl mt-0.5 flex-shrink-0">{cfg.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${cfg.badge}`}
            >
              {cfg.label}
            </span>
            {/* Historical probability badge */}
            <span
              className="text-xs font-mono px-2 py-0.5 rounded border"
              style={{ color: probabilityColor, borderColor: probabilityColor + '40', background: probabilityColor + '10' }}
            >
              {decision.probability}% historical
            </span>
          </div>
          <h4 className="text-white font-semibold text-sm leading-snug group-hover:text-opacity-90">
            {decision.label}
          </h4>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-xs leading-relaxed mb-3 pl-9">
        {decision.description}
      </p>

      {/* Immediate consequences */}
      {decision.immediateConsequences && decision.immediateConsequences.length > 0 && (
        <div className="pl-9 mb-3 space-y-1">
          {decision.immediateConsequences.slice(0, 2).map((c, i) => {
            const sevColor =
              c.severity === 'critical' ? '#ef4444' :
              c.severity === 'high' ? '#f97316' :
              c.severity === 'medium' ? '#eab308' : '#94a3b8';
            const catIcon =
              c.category === 'military' ? '⚔' :
              c.category === 'diplomatic' ? '🕊' :
              c.category === 'economic' ? '💹' :
              c.category === 'intelligence' ? '◈' : '🔴';
            return (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-xs mt-0.5">{catIcon}</span>
                <span className="text-xs leading-relaxed" style={{ color: sevColor }}>{c.text}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Impact deltas */}
      <div className="pl-9 grid grid-cols-2 gap-y-1.5 gap-x-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500 text-xs">Escalation</span>
          <DeltaBadge value={decision.escalationChange} positiveIsBad={true} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500 text-xs">Casualties</span>
          <DeltaBadge value={decision.casualtyChange} positiveIsBad={true} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500 text-xs">Oil Price</span>
          <DeltaBadge value={decision.oilPriceChange} positiveIsBad={true} unit="$/bbl" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500 text-xs">Stability</span>
          <DeltaBadge value={decision.stabilityChange} positiveIsBad={false} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500 text-xs">Humanitarian</span>
          <DeltaBadge value={decision.humanitarianChange} positiveIsBad={true} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500 text-xs">Intl. Attention</span>
          <DeltaBadge value={decision.internationalChange} positiveIsBad={false} />
        </div>
      </div>

      {/* Arrow */}
      <div
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ color: cfg.color }}
      >
        →
      </div>

      {disabled && (
        <div className="absolute inset-0 rounded-xl bg-slate-900/60 flex items-center justify-center">
          <span className="text-slate-500 text-xs">Simulation Complete</span>
        </div>
      )}
    </button>
  );
}
