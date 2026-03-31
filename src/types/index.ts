export type LocationType =
  | 'nuclear'
  | 'military'
  | 'naval'
  | 'airbase'
  | 'chokepoint'
  | 'capital'
  | 'missile'
  | 'oil'
  | 'irgc'
  | 'radar';

export type LocationCountry = 'iran' | 'israel' | 'usa' | 'neutral' | 'proxy';

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: LocationType;
  country: LocationCountry;
  description: string;
  details: string;
  capabilities?: string[];
  personnel?: number;
  significance?: 'critical' | 'high' | 'medium';
}

export interface ShippingLane {
  id: string;
  name: string;
  points: [number, number][]; // [lng, lat]
  bblPerDay: number;
  description: string;
}

export interface MilitaryForce {
  country: string;
  flag: string;
  activePersonnel: number;
  navalVessels: number;
  aircraft: number;
  nuclearWarheads: number | null;
  defenseSpend: number;
  keyCapabilities: string[];
  vulnerabilities: string[];
  color: string;
  ballisticMissiles?: number;
  proxyForces?: string[];
}

export type DecisionType = 'diplomatic' | 'limited-military' | 'escalation' | 'de-escalation' | 'covert' | 'sanctions';

export interface ExpertQuote {
  text: string;
  author: string;
  affiliation: string;
}

export interface ImmediateConsequence {
  text: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'military' | 'diplomatic' | 'economic' | 'humanitarian' | 'intelligence';
}

export interface Decision {
  id: string;
  label: string;
  type: DecisionType;
  description: string;
  shortDescription: string;
  probability: number; // % likelihood this path is chosen historically
  escalationChange: number;
  casualtyChange: number;
  oilPriceChange: number;
  stabilityChange: number;
  internationalChange: number;
  humanitarianChange: number;
  nextNodeId: string | null;
  immediateConsequences: ImmediateConsequence[];
  expertQuote?: ExpertQuote;
  breakingNews?: string;
}

export interface ScenarioNode {
  id: string;
  title: string;
  phase: number;
  phaseLabel: string;
  description: string;
  context: string;
  intelligenceBrief?: string;
  decisions: Decision[];
  isTerminal?: boolean;
  terminalOutcome?: TerminalOutcome;
}

export interface TerminalOutcome {
  title: string;
  summary: string;
  assessment: 'best' | 'good' | 'moderate' | 'poor' | 'worst';
  keyConsequences: string[];
  policyRecommendations: string[];
  timelineEvents: TimelineEvent[];
  finalMetrics: FinalMetric[];
  analystVerdict: ExpertQuote;
}

export interface FinalMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  severity: 'positive' | 'neutral' | 'negative' | 'critical';
}

export interface TimelineEvent {
  day: number;
  event: string;
  type: 'military' | 'diplomatic' | 'economic' | 'humanitarian' | 'intelligence';
  significance?: 'low' | 'medium' | 'high';
}

export interface SimulationState {
  escalationLevel: number;    // 1–10
  casualties: number;
  oilPrice: number;
  regionalStability: number;  // 0–100
  internationalInvolvement: number; // 0–100
  humanitarianCrisis: number; // 0–100
  currentNodeId: string;
  decisionHistory: string[];
  phase: number;
  breakingNews: string[];
  lastDecisionType?: DecisionType;
}

export interface SituationUpdate {
  id: string;
  timestamp: string;
  headline: string;
  detail: string;
  category: 'nuclear' | 'military' | 'diplomatic' | 'economic' | 'intelligence';
  urgency: 'routine' | 'priority' | 'flash' | 'critic';
}

export interface ComparisonScenario {
  id: string;
  label: string;
  escalation: number;
  casualties: number;
  oilPrice: number;
  stability: number;
  humanitarian: number;
  color: string;
}

export interface TickerItem {
  id: string;
  text: string;
  category: 'breaking' | 'update' | 'analysis';
}
