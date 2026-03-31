import type { SimulationState } from '../types';
import {
  ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

interface Props {
  state: SimulationState;
  history: SimulationState[];
}

function getEscalationColor(level: number): string {
  if (level <= 2) return '#22c55e';
  if (level <= 4) return '#84cc16';
  if (level <= 5) return '#eab308';
  if (level <= 7) return '#f97316';
  return '#ef4444';
}

function getEscalationLabel(level: number): string {
  if (level <= 2) return 'Stable';
  if (level <= 4) return 'Elevated Tension';
  if (level <= 5) return 'Crisis Phase';
  if (level <= 7) return 'Active Hostilities';
  if (level <= 9) return 'Full Conflict';
  return 'CATASTROPHIC';
}

function getThreatAssessment(level: number): string {
  if (level <= 2) return 'Diplomatic channels functional. Military postures defensive. Risk of miscalculation: LOW.';
  if (level <= 4) return 'Elevated military readiness. Proxy tensions rising. Diplomatic backchannel critical.';
  if (level <= 5) return 'Crisis escalation risk HIGH. Decision-makers face time pressure. Miscalculation probability elevated.';
  if (level <= 7) return 'Active military exchanges. Regional actors mobilizing. War termination framework urgently needed.';
  if (level <= 9) return 'Full-scale regional war. Humanitarian catastrophe unfolding. Global economic shock imminent.';
  return 'CATASTROPHIC CONFLICT. Mass casualty event. Global systemic shock. Immediate ceasefire imperative.';
}

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  color: string;
  icon: string;
  subtext?: string;
}

function MetricCard({ label, value, unit, change, color, icon, subtext }: MetricCardProps) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-slate-400 text-xs uppercase tracking-wider">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-xl font-bold" style={{ color }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-slate-400 text-xs">{unit}</span>}
      </div>
      {change !== undefined && change !== 0 && (
        <div className={`text-xs mt-0.5 ${change > 0 ? 'text-red-400' : 'text-green-400'}`}>
          {change > 0 ? '▲' : '▼'} {Math.abs(change).toLocaleString()} from last decision
        </div>
      )}
      {subtext && <div className="text-slate-500 text-xs mt-0.5">{subtext}</div>}
    </div>
  );
}

export function EscalationMeter({ state, history }: Props) {
  const color = getEscalationColor(state.escalationLevel);
  const label = getEscalationLabel(state.escalationLevel);
  const assessment = getThreatAssessment(state.escalationLevel);

  const prev = history.length > 1 ? history[history.length - 2] : null;
  const casualtyChange = prev ? state.casualties - prev.casualties : 0;
  const oilChange = prev ? state.oilPrice - prev.oilPrice : 0;

  // Build history chart data
  const chartData = history.map((s, i) => ({
    step: i === 0 ? 'Start' : `D${i}`,
    escalation: s.escalationLevel,
    stability: s.regionalStability / 10,
    involvement: s.internationalInvolvement / 10,
  }));

  // Escalation segments for the bar
  const segments = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      {/* Main escalation bar */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Escalation Index</h3>
            <p className="text-slate-400 text-xs mt-0.5">Real-time conflict intensity assessment</p>
          </div>
          <div className="text-right">
            <div className="font-mono text-3xl font-bold tabular-nums" style={{ color }}>
              {state.escalationLevel.toFixed(1)}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
              {label}
            </div>
          </div>
        </div>

        {/* Segmented bar */}
        <div className="flex gap-0.5 mb-3 h-6">
          {segments.map((seg) => {
            const filled = state.escalationLevel >= seg;
            const partial = state.escalationLevel > seg - 1 && state.escalationLevel < seg;
            const segColor =
              seg <= 2 ? '#22c55e' :
              seg <= 4 ? '#84cc16' :
              seg <= 5 ? '#eab308' :
              seg <= 7 ? '#f97316' : '#ef4444';
            return (
              <div
                key={seg}
                className="flex-1 rounded-sm transition-all duration-500"
                style={{
                  background: filled ? segColor : partial
                    ? `linear-gradient(90deg, ${segColor} ${(state.escalationLevel - (seg - 1)) * 100}%, #1e293b ${(state.escalationLevel - (seg - 1)) * 100}%)`
                    : '#1e293b',
                  opacity: filled || partial ? 1 : 0.4,
                  boxShadow: filled ? `0 0 6px ${segColor}40` : 'none',
                }}
              />
            );
          })}
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-slate-600 text-xs px-0.5">
          <span>1 · Stable</span>
          <span>5 · Crisis</span>
          <span>10 · Catastrophic</span>
        </div>

        {/* Threat assessment */}
        <div
          className="mt-3 p-2.5 rounded border text-xs"
          style={{ borderColor: color + '40', background: color + '08' }}
        >
          <span className="font-semibold uppercase tracking-wider text-slate-400 mr-2">ASSESSMENT:</span>
          <span style={{ color }}>{assessment}</span>
        </div>
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Est. Casualties"
          value={state.casualties}
          change={casualtyChange}
          color="#f87171"
          icon="🔴"
          subtext="Military + civilian estimate"
        />
        <MetricCard
          label="Oil Price"
          value={`$${state.oilPrice}`}
          unit="/ barrel"
          change={oilChange}
          color="#fbbf24"
          icon="⛽"
          subtext="Brent crude spot estimate"
        />
        <MetricCard
          label="Regional Stability"
          value={state.regionalStability}
          unit="/ 100"
          color="#34d399"
          icon="🌍"
          subtext={state.regionalStability > 60 ? 'Relatively stable' : state.regionalStability > 35 ? 'Fragile equilibrium' : 'Critical instability'}
        />
        <MetricCard
          label="Intl. Involvement"
          value={state.internationalInvolvement}
          unit="/ 100"
          color="#60a5fa"
          icon="🌐"
          subtext={state.internationalInvolvement > 60 ? 'Major power intervention' : state.internationalInvolvement > 30 ? 'Regional actors engaged' : 'Bilateral dispute'}
        />
        <MetricCard
          label="Humanitarian Crisis"
          value={state.humanitarianCrisis}
          unit="/ 100"
          color="#f472b6"
          icon="🔴"
          subtext={state.humanitarianCrisis > 60 ? 'Mass displacement' : state.humanitarianCrisis > 30 ? 'Civilian hardship rising' : 'Manageable impact'}
        />
        <MetricCard
          label="Decision Count"
          value={state.decisionHistory.length}
          color="#94a3b8"
          icon="◈"
          subtext={`Phase ${state.phase} of simulation`}
        />
      </div>

      {/* Trend chart */}
      {chartData.length > 1 && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
            Escalation Trajectory
          </h3>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="escalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="stabGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="step" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 6, fontSize: 11 }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="escalation" name="Escalation" stroke="#ef4444" fill="url(#escalGrad)" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} />
                <Area type="monotone" dataKey="stability" name="Stability/10" stroke="#34d399" fill="url(#stabGrad)" strokeWidth={1.5} dot={{ fill: '#34d399', r: 2 }} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-1 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-red-400" />
              <span className="text-xs text-slate-500">Escalation Index</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-emerald-400" style={{ borderTop: '1px dashed' }} />
              <span className="text-xs text-slate-500">Stability (scaled)</span>
            </div>
          </div>
        </div>
      )}

      {/* Phase indicator */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-xs uppercase tracking-wider">Simulation Phase</span>
          <span className="text-white font-mono text-xs font-bold">{state.phase} / 6</span>
        </div>
        <div className="flex gap-1 mb-2">
          {[1, 2, 3, 4, 5, 6].map((p) => (
            <div
              key={p}
              className="flex-1 h-1.5 rounded-full transition-all duration-300"
              style={{
                background: state.phase >= p ? color : '#1e293b',
                boxShadow: state.phase === p ? `0 0 6px ${color}60` : 'none',
              }}
            />
          ))}
        </div>
        <div className="text-slate-300 text-xs">
          {state.phase === 1 ? 'Phase I: Nuclear Breakout Warning' :
           state.phase === 2 ? 'Phase II: Initial Response' :
           state.phase === 3 ? 'Phase III: Escalation Dynamics' :
           state.phase === 4 ? 'Phase IV: Strategic Crossroads' :
           state.phase === 5 ? 'Phase V: Resolution Track' :
           'Phase VI: Terminal Assessment'}
        </div>
      </div>
    </div>
  );
}
