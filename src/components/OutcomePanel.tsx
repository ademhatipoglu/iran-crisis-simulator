import type { SimulationState, TerminalOutcome } from '../types';
import { scenarioNodes, comparisonScenarios } from '../data/scenarios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';

interface Props {
  state: SimulationState;
  onReset: () => void;
}

const assessmentConfig = {
  best: { label: 'Optimal Outcome', color: '#22c55e', bg: 'bg-emerald-900/30', border: 'border-emerald-700/40', icon: '✓' },
  good: { label: 'Favorable Outcome', color: '#84cc16', bg: 'bg-lime-900/30', border: 'border-lime-700/40', icon: '↑' },
  moderate: { label: 'Mixed Outcome', color: '#eab308', bg: 'bg-yellow-900/30', border: 'border-yellow-700/40', icon: '~' },
  poor: { label: 'Unfavorable Outcome', color: '#f97316', bg: 'bg-orange-900/30', border: 'border-orange-700/40', icon: '↓' },
  worst: { label: 'Catastrophic Outcome', color: '#ef4444', bg: 'bg-red-900/30', border: 'border-red-700/40', icon: '✕' },
};

const eventTypeColors = {
  military: '#ef4444',
  diplomatic: '#60a5fa',
  economic: '#fbbf24',
  humanitarian: '#f472b6',
  intelligence: '#a78bfa',
};

const eventTypeIcons = {
  military: '⚔',
  diplomatic: '🕊',
  economic: '💹',
  humanitarian: '🔴',
  intelligence: '◈',
};

type EventType = keyof typeof eventTypeColors;
function TimelineEventRow({ day, event, type }: { day: number; event: string; type: EventType }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex flex-col items-center flex-shrink-0 w-10">
        <div
          className="text-xs font-mono font-bold px-1.5 py-0.5 rounded text-center w-full"
          style={{ background: eventTypeColors[type] + '20', color: eventTypeColors[type] }}
        >
          D{day}
        </div>
        <div className="w-px flex-1 mt-1" style={{ background: eventTypeColors[type] + '30' }} />
      </div>
      <div className="pb-3 flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-xs">{eventTypeIcons[type]}</span>
          <span
            className="text-xs uppercase tracking-wider font-semibold"
            style={{ color: eventTypeColors[type] }}
          >
            {type}
          </span>
        </div>
        <p className="text-slate-300 text-xs leading-relaxed">{event}</p>
      </div>
    </div>
  );
}

export function OutcomePanel({ state, onReset }: Props) {
  const node = scenarioNodes[state.currentNodeId];
  const outcome: TerminalOutcome | undefined = node?.terminalOutcome;

  // Comparison bar chart data
  const barData = comparisonScenarios.map((s) => ({
    name: s.label,
    escalation: s.escalation,
    oil: s.oilPrice - 70, // relative to baseline
    casualties: Math.log10(s.casualties + 1) * 20,
    stability: s.stability,
  }));

  // Radar data for current vs baseline
  const radarData = [
    { metric: 'Escalation', current: state.escalationLevel * 10, baseline: 40 },
    { metric: 'Stability', current: state.regionalStability, baseline: 65 },
    { metric: 'Intl. Involve', current: state.internationalInvolvement, baseline: 20 },
    { metric: 'Econ. Impact', current: Math.min(100, (state.oilPrice - 70) * 1.2), baseline: 10 },
    { metric: 'Humanitarian', current: Math.min(100, Math.log10(state.casualties + 1) * 18), baseline: 5 },
  ];

  const assCfg = outcome ? assessmentConfig[outcome.assessment] : null;

  const handleExport = () => {
    const lines = [
      '=== IRAN CRISIS ESCALATION SIMULATOR — OUTCOME REPORT ===',
      `Date: ${new Date().toISOString().split('T')[0]}`,
      '',
      '--- SIMULATION PARAMETERS ---',
      `Escalation Level: ${state.escalationLevel}/10`,
      `Estimated Casualties: ${state.casualties.toLocaleString()}`,
      `Oil Price: $${state.oilPrice}/barrel`,
      `Regional Stability: ${state.regionalStability}/100`,
      `International Involvement: ${state.internationalInvolvement}/100`,
      '',
      '--- DECISION PATH ---',
      ...state.decisionHistory.map((id, i) => {
        let label = id;
        for (const n of Object.values(scenarioNodes)) {
          const d = n.decisions.find((d) => d.id === id);
          if (d) { label = d.label; break; }
        }
        return `  ${i + 1}. ${label}`;
      }),
      '',
    ];

    if (outcome) {
      lines.push('--- OUTCOME ASSESSMENT ---');
      lines.push(`Verdict: ${outcome.title}`);
      lines.push(`Summary: ${outcome.summary}`);
      lines.push('');
      lines.push('Key Consequences:');
      outcome.keyConsequences.forEach((c) => lines.push(`  • ${c}`));
      lines.push('');
      lines.push('Policy Recommendations:');
      outcome.policyRecommendations.forEach((r) => lines.push(`  ${r}`));
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'iran-crisis-simulation-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Outcome verdict (only when terminal) */}
      {outcome && assCfg && (
        <div className={`rounded-xl border p-4 ${assCfg.bg} ${assCfg.border}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: assCfg.color + '30', color: assCfg.color }}
              >
                {assCfg.icon}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: assCfg.color }}>
                {assCfg.label}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="text-xs border border-slate-600 text-slate-400 hover:text-white hover:border-slate-500 px-3 py-1 rounded transition-colors"
              >
                Export Report
              </button>
              <button
                onClick={onReset}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded transition-colors"
              >
                ↺ Restart
              </button>
            </div>
          </div>
          <h3 className="text-white font-bold text-base mb-2">{outcome.title}</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{outcome.summary}</p>
        </div>
      )}

      {/* If not terminal, show current state summary */}
      {!outcome && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
            Current State Assessment
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Select a decision path in the scenario panel to progress the simulation. The outcome analysis will update in real-time as you navigate the decision tree.
          </p>
          <button
            onClick={onReset}
            className="mt-3 text-xs border border-slate-600 text-slate-400 hover:text-white hover:border-slate-500 px-3 py-1.5 rounded transition-colors"
          >
            ↺ Reset Simulation
          </button>
        </div>
      )}

      {/* Scenario comparison chart */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-1">
          Scenario Comparison Matrix
        </h3>
        <p className="text-slate-500 text-xs mb-3">Escalation index across all pathway outcomes</p>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 9, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 6, fontSize: 11 }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="escalation" name="Escalation (1–10)" fill="#ef4444" fillOpacity={0.8} radius={[2, 2, 0, 0]} />
              <Bar dataKey="stability" name="Stability (0–100)/10" fill="#34d399" fillOpacity={0.6} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-1 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-red-400/80" />
            <span className="text-xs text-slate-500">Escalation Index</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-400/60" />
            <span className="text-xs text-slate-500">Stability Score /10</span>
          </div>
        </div>
      </div>

      {/* Radar chart */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-1">
          Strategic Impact Radar
        </h3>
        <p className="text-slate-500 text-xs mb-2">Current scenario vs. pre-crisis baseline</p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Radar name="Baseline" dataKey="baseline" stroke="#34d399" fill="#34d399" fillOpacity={0.1} strokeWidth={1} strokeDasharray="4 2" />
              <Radar name="Current" dataKey="current" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 6, fontSize: 11 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-red-400" />
            <span className="text-xs text-slate-500">Current State</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-emerald-400 border-dashed" style={{ borderTop: '1px dashed' }} />
            <span className="text-xs text-slate-500">Pre-Crisis Baseline</span>
          </div>
        </div>
      </div>

      {/* Final metrics */}
      {outcome && outcome.finalMetrics && outcome.finalMetrics.length > 0 && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
            Terminal Metrics
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {outcome.finalMetrics.map((m, i) => {
              const sevColor =
                m.severity === 'positive' ? '#34d399' :
                m.severity === 'neutral' ? '#94a3b8' :
                m.severity === 'negative' ? '#f97316' : '#ef4444';
              const trendIcon =
                m.trend === 'up' ? '▲' :
                m.trend === 'down' ? '▼' : '—';
              return (
                <div key={i} className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-2.5">
                  <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">{m.label}</div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm font-bold" style={{ color: sevColor }}>{m.value}</span>
                    <span className="text-xs" style={{ color: sevColor }}>{trendIcon}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Analyst verdict */}
      {outcome && outcome.analystVerdict && (
        <div className="bg-blue-950/20 border border-blue-700/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-400 text-xs">◈</span>
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Analyst Assessment</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed italic mb-2">
            "{outcome.analystVerdict.text}"
          </p>
          <p className="text-slate-500 text-xs">
            — {outcome.analystVerdict.author}, {outcome.analystVerdict.affiliation}
          </p>
        </div>
      )}

      {/* Key consequences */}
      {outcome && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
            Key Consequences
          </h3>
          <ul className="space-y-2">
            {outcome.keyConsequences.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-slate-500 mt-0.5 flex-shrink-0">•</span>
                <span className="text-slate-300 text-xs leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Policy recommendations */}
      {outcome && (
        <div className="bg-slate-800/60 border border-blue-900/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-blue-400 text-xs uppercase tracking-wider font-bold">Policy Recommendations</span>
            <div className="h-px flex-1 bg-blue-900/40" />
          </div>
          <ol className="space-y-2">
            {outcome.policyRecommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-blue-500 font-mono text-xs font-bold mt-0.5 flex-shrink-0 w-4">
                  {i + 1}.
                </span>
                <span className="text-slate-300 text-xs leading-relaxed">{r}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Timeline */}
      {outcome && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
            Event Timeline
          </h3>
          <div className="flex gap-3 mb-3 flex-wrap">
            {Object.entries(eventTypeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="text-xs text-slate-500 capitalize">{type}</span>
              </div>
            ))}
          </div>
          <div>
            {outcome.timelineEvents.map((event, i) => (
              <TimelineEventRow key={i} {...event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
