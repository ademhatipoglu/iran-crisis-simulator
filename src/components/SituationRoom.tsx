import type { SimulationState, SituationUpdate } from '../types';

interface Props {
  state: SimulationState;
  updates: SituationUpdate[];
}

const urgencyConfig = {
  critic: { label: 'CRITIC', color: '#ef4444', bg: 'bg-red-950/60', border: 'border-red-700/60', dot: 'bg-red-500 animate-pulse' },
  flash: { label: 'FLASH', color: '#f97316', bg: 'bg-orange-950/40', border: 'border-orange-700/40', dot: 'bg-orange-500' },
  priority: { label: 'PRIORITY', color: '#eab308', bg: 'bg-yellow-950/30', border: 'border-yellow-700/30', dot: 'bg-yellow-500' },
  routine: { label: 'ROUTINE', color: '#64748b', bg: 'bg-slate-800/40', border: 'border-slate-700/40', dot: 'bg-slate-500' },
};

const categoryIcons = {
  nuclear: '☢',
  military: '⚔',
  diplomatic: '🕊',
  economic: '💹',
  intelligence: '◈',
};

const categoryColors = {
  nuclear: '#f87171',
  military: '#60a5fa',
  diplomatic: '#34d399',
  economic: '#fbbf24',
  intelligence: '#a78bfa',
};

function AlertLevel({ escalation }: { escalation: number }) {
  const level =
    escalation <= 2 ? { label: 'WATCHCON IV', color: '#22c55e', desc: 'Normal intelligence collection' } :
    escalation <= 4 ? { label: 'WATCHCON III', color: '#84cc16', desc: 'Heightened intelligence activity' } :
    escalation <= 6 ? { label: 'WATCHCON II', color: '#eab308', desc: 'Increased readiness posture' } :
    escalation <= 8 ? { label: 'WATCHCON I', color: '#f97316', desc: 'Maximum readiness — imminent threat' } :
    { label: 'EMCON ALPHA', color: '#ef4444', desc: 'Full emissions control — active hostilities' };

  return (
    <div
      className="rounded-lg border p-3"
      style={{ borderColor: level.color + '40', background: level.color + '08' }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400 uppercase tracking-wider">Alert Status</span>
        <span className="text-xs font-bold font-mono" style={{ color: level.color }}>
          {level.label}
        </span>
      </div>
      <p className="text-xs" style={{ color: level.color + 'cc' }}>{level.desc}</p>
    </div>
  );
}

export function SituationRoom({ state, updates }: Props) {
  // Sort updates: CRITIC and FLASH first
  const urgencyOrder = { critic: 0, flash: 1, priority: 2, routine: 3 };
  const sorted = [...updates].sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);

  const oilTrend = state.oilPrice > 87 ? 'up' : state.oilPrice < 87 ? 'down' : 'stable';

  return (
    <div className="space-y-3">
      {/* Alert level */}
      <AlertLevel escalation={state.escalationLevel} />

      {/* Key indicators row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-2 text-center">
          <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Strait of Hormuz</div>
          <div
            className="text-xs font-bold uppercase"
            style={{ color: state.escalationLevel > 6 ? '#ef4444' : state.escalationLevel > 4 ? '#eab308' : '#34d399' }}
          >
            {state.escalationLevel > 6 ? 'CONTESTED' : state.escalationLevel > 4 ? 'RESTRICTED' : 'OPEN'}
          </div>
          <div className="text-slate-600 text-xs mt-0.5">17M bbl/day</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-2 text-center">
          <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Oil Market</div>
          <div className="text-fbbf24 font-mono text-sm font-bold" style={{ color: '#fbbf24' }}>
            ${state.oilPrice}
          </div>
          <div
            className="text-xs mt-0.5"
            style={{ color: oilTrend === 'up' ? '#ef4444' : oilTrend === 'down' ? '#34d399' : '#64748b' }}
          >
            {oilTrend === 'up' ? '▲ Rising' : oilTrend === 'down' ? '▼ Falling' : '— Stable'}
          </div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-2 text-center">
          <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Enrichment</div>
          <div
            className="text-xs font-bold uppercase"
            style={{ color: state.escalationLevel > 7 ? '#ef4444' : state.escalationLevel > 4 ? '#f97316' : '#eab308' }}
          >
            {state.escalationLevel > 7 ? '90%+' : state.escalationLevel > 4 ? '84%' : '60%'}
          </div>
          <div className="text-slate-600 text-xs mt-0.5">U-235 purity</div>
        </div>
      </div>

      {/* Situation updates feed */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700 bg-slate-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">Situation Reports</span>
          <div className="flex-1" />
          <span className="text-slate-600 text-xs font-mono">{updates.length} reports</span>
        </div>
        <div className="divide-y divide-slate-700/50 max-h-72 overflow-y-auto">
          {sorted.map((update) => {
            const urg = urgencyConfig[update.urgency];
            return (
              <div key={update.id} className={`p-3 ${urg.bg}`}>
                <div className="flex items-start gap-2 mb-1">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${urg.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: urg.color }}
                      >
                        {urg.label}
                      </span>
                      <span className="text-xs" style={{ color: categoryColors[update.category] }}>
                        {categoryIcons[update.category]} {update.category.toUpperCase()}
                      </span>
                      <span className="text-slate-600 text-xs font-mono ml-auto">{update.timestamp}</span>
                    </div>
                    <p className="text-slate-200 text-xs font-semibold leading-snug mb-0.5">{update.headline}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{update.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Proxy threat assessment */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-3">
        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Proxy Force Activity</div>
        <div className="space-y-2">
          {[
            { actor: 'Hezbollah (Lebanon)', status: state.escalationLevel > 5 ? 'ACTIVE' : state.escalationLevel > 3 ? 'ELEVATED' : 'MONITORING', rockets: '150,000+' },
            { actor: 'Hamas (Gaza)', status: state.escalationLevel > 6 ? 'ACTIVE' : 'MONITORING', rockets: '15,000' },
            { actor: 'Houthis (Yemen)', status: state.escalationLevel > 4 ? 'ACTIVE' : 'MONITORING', rockets: 'Ballistic+Cruise' },
            { actor: 'PMF (Iraq)', status: state.escalationLevel > 5 ? 'ELEVATED' : 'STANDBY', rockets: 'Drones+Rockets' },
          ].map((proxy) => {
            const statusColor =
              proxy.status === 'ACTIVE' ? '#ef4444' :
              proxy.status === 'ELEVATED' ? '#f97316' :
              proxy.status === 'MONITORING' ? '#eab308' : '#64748b';
            return (
              <div key={proxy.actor} className="flex items-center justify-between">
                <span className="text-slate-400 text-xs">{proxy.actor}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 text-xs font-mono">{proxy.rockets}</span>
                  <span
                    className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                    style={{ color: statusColor, background: statusColor + '15' }}
                  >
                    {proxy.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
