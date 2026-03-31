import type { Decision, SimulationState } from '../types';
import { scenarioNodes } from '../data/scenarios';
import { ScenarioCard } from './ScenarioCard';

interface Props {
  state: SimulationState;
  onDecision: (decision: Decision) => void;
}

export function DecisionTree({ state, onDecision }: Props) {
  const node = scenarioNodes[state.currentNodeId];
  if (!node) return null;

  const isTerminal = node.isTerminal;

  return (
    <div className="space-y-4">
      {/* Breadcrumb / decision history */}
      {state.decisionHistory.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-600 text-xs uppercase tracking-wider">Path:</span>
          {state.decisionHistory.map((id, i) => {
            let label = id;
            for (const n of Object.values(scenarioNodes)) {
              const d = n.decisions.find((d) => d.id === id);
              if (d) { label = d.shortDescription; break; }
            }
            return (
              <span key={id} className="flex items-center gap-1">
                {i > 0 && <span className="text-slate-700">→</span>}
                <span className="text-xs bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded">
                  {label}
                </span>
              </span>
            );
          })}
        </div>
      )}

      {/* Breaking news from last decision */}
      {state.breakingNews && state.breakingNews.length > 0 && (
        <div className="bg-red-950/40 border border-red-700/50 rounded-lg p-3 flex items-start gap-2">
          <span className="text-red-400 text-xs font-bold uppercase tracking-widest flex-shrink-0 mt-0.5">
            ⚡ FLASH
          </span>
          <p className="text-red-300 text-xs leading-relaxed">
            {state.breakingNews[state.breakingNews.length - 1]}
          </p>
        </div>
      )}

      {/* Scenario node */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        {/* Phase badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded">
            Phase {node.phase} · {node.phaseLabel}
          </span>
          {isTerminal && (
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/40 border border-amber-700/40 px-2.5 py-1 rounded">
              Terminal Assessment
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-white font-bold text-base leading-snug mb-2">{node.title}</h2>

        {/* Description */}
        <p className="text-slate-300 text-sm leading-relaxed mb-3">{node.description}</p>

        {/* Intelligence Brief */}
        {node.intelligenceBrief && (
          <div className="bg-amber-950/20 border border-amber-700/30 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-amber-500 text-xs">◈</span>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Intelligence Brief</span>
            </div>
            <p className="text-amber-200/80 text-xs leading-relaxed font-mono">{node.intelligenceBrief}</p>
          </div>
        )}

        {/* Context */}
        {node.context && (
          <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-3">
            <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Strategic Context</div>
            <p className="text-slate-400 text-xs leading-relaxed">{node.context}</p>
          </div>
        )}
      </div>

      {/* Decision options */}
      {!isTerminal && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-slate-700" />
            <span className="text-slate-500 text-xs uppercase tracking-wider px-2">
              Select Response Option
            </span>
            <div className="h-px flex-1 bg-slate-700" />
          </div>
          <div className="space-y-3">
            {node.decisions.map((decision) => (
              <div key={decision.id}>
                <ScenarioCard decision={decision} onSelect={onDecision} />
                {/* Expert quote beneath each card */}
                {decision.expertQuote && (
                  <div className="mx-1 bg-slate-900/40 border-x border-b border-slate-700/50 rounded-b-lg px-4 py-2.5">
                    <p className="text-slate-400 text-xs leading-relaxed italic">
                      "{decision.expertQuote.text}"
                    </p>
                    <p className="text-slate-600 text-xs mt-1">
                      — {decision.expertQuote.author}, <span className="text-slate-600">{decision.expertQuote.affiliation}</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Terminal: show locked state */}
      {isTerminal && (
        <div className="bg-amber-950/30 border border-amber-700/30 rounded-xl p-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>⚠</span> Simulation Complete
          </div>
          <p className="text-slate-400 text-xs">
            This scenario pathway has reached its terminal state. Review the outcome analysis in the panel to the right.
          </p>
        </div>
      )}
    </div>
  );
}
