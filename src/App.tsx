import { useState, useCallback } from 'react';
import type { Decision, SimulationState } from './types';
import { initialState, scenarioNodes, situationUpdates, tickerItems } from './data/scenarios';
import { Map } from './components/Map';
import { EscalationMeter } from './components/EscalationMeter';
import { DecisionTree } from './components/DecisionTree';
import { OutcomePanel } from './components/OutcomePanel';
import { MilitaryForces } from './components/MilitaryForces';
import { SituationRoom } from './components/SituationRoom';
import { NewsTicker } from './components/NewsTicker';
import { NewsPanel } from './components/NewsPanel';
import './App.css';

type Tab = 'scenario' | 'map' | 'forces' | 'situation' | 'news';

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function App() {
  const [state, setState] = useState<SimulationState>(initialState);
  const [history, setHistory] = useState<SimulationState[]>([initialState]);
  const [activeTab, setActiveTab] = useState<Tab>('scenario');

  const handleDecision = useCallback((decision: Decision) => {
    setState((prev) => {
      const nextNodeId = decision.nextNodeId || prev.currentNodeId;
      const nextNode = scenarioNodes[nextNodeId];
      const newBreakingNews = decision.breakingNews
        ? [...prev.breakingNews, decision.breakingNews]
        : prev.breakingNews;

      const next: SimulationState = {
        escalationLevel: clamp(prev.escalationLevel + decision.escalationChange, 1, 10),
        casualties: Math.max(0, prev.casualties + decision.casualtyChange),
        oilPrice: Math.max(60, prev.oilPrice + decision.oilPriceChange),
        regionalStability: clamp(prev.regionalStability + decision.stabilityChange, 0, 100),
        internationalInvolvement: clamp(prev.internationalInvolvement + decision.internationalChange, 0, 100),
        humanitarianCrisis: clamp(prev.humanitarianCrisis + decision.humanitarianChange, 0, 100),
        currentNodeId: nextNodeId,
        decisionHistory: [...prev.decisionHistory, decision.id],
        phase: nextNode?.phase ?? prev.phase,
        breakingNews: newBreakingNews,
        lastDecisionType: decision.type,
      };
      setHistory((h) => [...h, next]);
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setState(initialState);
    setHistory([initialState]);
    setActiveTab('scenario');
  }, []);

  const currentNode = scenarioNodes[state.currentNodeId];
  const isTerminal = currentNode?.isTerminal;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'scenario', label: 'Scenario', icon: '⬡' },
    { id: 'map', label: 'Theater Map', icon: '◉' },
    { id: 'forces', label: 'Forces', icon: '◈' },
    { id: 'situation', label: 'Sit Room', icon: '⚡' },
    { id: 'news', label: 'News', icon: '📡' },
  ];

  const defcon =
    state.escalationLevel <= 2 ? '5' :
    state.escalationLevel <= 4 ? '4' :
    state.escalationLevel <= 6 ? '3' :
    state.escalationLevel <= 8 ? '2' : '1';

  const defconColor =
    state.escalationLevel <= 3 ? '#22c55e' :
    state.escalationLevel <= 6 ? '#eab308' : '#ef4444';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 w-8 h-8 rounded border border-red-500/40 bg-red-950/30 flex items-center justify-center">
                <span className="text-red-400 text-xs font-bold">IR</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-white font-bold text-sm sm:text-base leading-tight">
                  Iran Crisis Escalation Simulator
                </h1>
                <p className="text-slate-500 text-xs hidden sm:block">
                  Strategic Scenario Analysis · Policy Research Tool
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="hidden md:flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-slate-400 font-mono">LIVE SIM</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5">
                <span className="text-xs text-slate-500">Phase</span>
                <span className="text-xs text-white font-mono font-bold">{state.phase}/6</span>
              </div>
              <div className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 flex items-center gap-1.5">
                <span className="text-xs text-slate-500">DEFCON</span>
                <span className="text-xs font-mono font-bold" style={{ color: defconColor }}>
                  {defcon}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5">
                <span className="text-xs text-slate-500">ESC</span>
                <span className="text-xs font-mono font-bold" style={{ color: defconColor }}>
                  {state.escalationLevel.toFixed(1)}
                </span>
              </div>
              <button
                onClick={handleReset}
                className="text-xs border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 px-3 py-1.5 rounded transition-colors cursor-pointer"
              >
                ↺ Reset
              </button>
            </div>
          </div>

          <div className="mt-2 text-center">
            <span className="text-xs font-mono text-amber-500/60 uppercase tracking-widest">
              ⚠ EXERCISE — FOR SIMULATION PURPOSES ONLY — NOT CLASSIFIED INTELLIGENCE ⚠
            </span>
          </div>
        </div>

        {/* Breaking news ticker */}
        <NewsTicker items={tickerItems} breakingNews={state.breakingNews} />
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 py-4 xl:py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-4 xl:gap-6">

          {/* LEFT column */}
          <div className="space-y-4">
            {/* Mobile tabs */}
            <div className="flex border border-slate-700 rounded-lg overflow-hidden xl:hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  style={{
                    background: activeTab === tab.id ? '#1e293b' : 'transparent',
                    color: activeTab === tab.id ? '#f1f5f9' : '#64748b',
                    borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                  }}
                >
                  <span className="text-xs">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Scenario section */}
            <section className={activeTab !== 'scenario' ? 'hidden xl:block' : ''}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-400 text-xs">⬡</span>
                <h2 className="text-slate-300 text-xs font-semibold uppercase tracking-widest">Active Scenario</h2>
                <div className="h-px flex-1 bg-slate-800" />
                {isTerminal && (
                  <span className="text-amber-400 text-xs bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                    Terminal State
                  </span>
                )}
              </div>
              <DecisionTree state={state} onDecision={handleDecision} />
            </section>

            {/* Map section */}
            <section className={activeTab !== 'map' ? 'hidden xl:block' : ''}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-400 text-xs">◉</span>
                <h2 className="text-slate-300 text-xs font-semibold uppercase tracking-widest">
                  Theater Map — Persian Gulf &amp; Middle East
                </h2>
                <div className="h-px flex-1 bg-slate-800" />
              </div>
              <Map />
            </section>

            {/* Forces section */}
            <section className={activeTab !== 'forces' ? 'hidden xl:block' : ''}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-400 text-xs">◈</span>
                <h2 className="text-slate-300 text-xs font-semibold uppercase tracking-widest">Military Force Analysis</h2>
                <div className="h-px flex-1 bg-slate-800" />
              </div>
              <MilitaryForces />
            </section>

            {/* Situation Room (mobile only tab) */}
            <section className={activeTab !== 'situation' ? 'hidden xl:hidden' : ''}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-red-400 text-xs">⚡</span>
                <h2 className="text-slate-300 text-xs font-semibold uppercase tracking-widest">Situation Room</h2>
                <div className="h-px flex-1 bg-slate-800" />
              </div>
              <SituationRoom state={state} updates={situationUpdates} />
            </section>

            {/* News feed (mobile tab + desktop always visible) */}
            <section className={activeTab !== 'news' ? 'hidden xl:block' : ''}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-400 text-xs">📡</span>
                <h2 className="text-slate-300 text-xs font-semibold uppercase tracking-widest">Latest Developments</h2>
                <div className="h-px flex-1 bg-slate-800" />
              </div>
              <NewsPanel simulationBreakingNews={state.breakingNews} />
            </section>
          </div>

          {/* RIGHT column */}
          <div className="space-y-4">
            {/* Situation Room — desktop only */}
            <section className="hidden xl:block">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-red-400 text-xs">⚡</span>
                <h2 className="text-slate-300 text-xs font-semibold uppercase tracking-widest">Situation Room</h2>
                <div className="h-px flex-1 bg-slate-800" />
              </div>
              <SituationRoom state={state} updates={situationUpdates} />
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-red-400 text-xs">◈</span>
                <h2 className="text-slate-300 text-xs font-semibold uppercase tracking-widest">Escalation Dashboard</h2>
                <div className="h-px flex-1 bg-slate-800" />
              </div>
              <EscalationMeter state={state} history={history} />
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-400 text-xs">▣</span>
                <h2 className="text-slate-300 text-xs font-semibold uppercase tracking-widest">Outcome Analysis</h2>
                <div className="h-px flex-1 bg-slate-800" />
              </div>
              <OutcomePanel state={state} onReset={handleReset} />
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 mt-8 py-4 px-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <span className="text-slate-600 text-xs">
            Iran Crisis Escalation Simulator · Policy Research Tool · For Academic / Think Tank Use
          </span>
          <span className="text-slate-600 text-xs font-mono">
            Data: IISS Military Balance · SIPRI · Congressional Research Service · Open-Source Defence Research
          </span>
        </div>
      </footer>
    </div>
  );
}
