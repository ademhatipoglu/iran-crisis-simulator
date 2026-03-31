import { useState, useCallback } from 'react';

interface NewsItem {
  id: string;
  headline: string;
  source: string;
  url: string;
  timestamp: string;
  minutesAgo: number;
  urgency: 'breaking' | 'important' | 'analysis' | 'update';
  category: 'nuclear' | 'military' | 'diplomatic' | 'economic' | 'intelligence';
  summary: string;
}

const SAMPLE_NEWS: NewsItem[] = [
  {
    id: 'n1',
    headline: 'IAEA Reports Iran Has Enough Material for Multiple Nuclear Weapons, Enrichment at 83.7%',
    source: 'Reuters',
    url: 'https://example.com/iaea-iran-enrichment',
    timestamp: '14:32 UTC',
    minutesAgo: 8,
    urgency: 'breaking',
    category: 'nuclear',
    summary: 'The UN nuclear watchdog confirmed Iran\'s stockpile of highly enriched uranium now exceeds weapons-grade threshold, raising immediate proliferation concerns among P5+1 nations.',
  },
  {
    id: 'n2',
    headline: 'US Carrier Strike Group Enters Persian Gulf Amid Heightened Tensions',
    source: 'Associated Press',
    url: 'https://example.com/uss-carrier-gulf',
    timestamp: '13:47 UTC',
    minutesAgo: 53,
    urgency: 'important',
    category: 'military',
    summary: 'The USS Abraham Lincoln strike group transited the Strait of Hormuz, the third US carrier deployment to the region in 60 days. Pentagon cites "deterrence" mission.',
  },
  {
    id: 'n3',
    headline: 'Iran Dismisses Emergency UN Security Council Meeting as "Political Theater"',
    source: 'Al Jazeera',
    url: 'https://example.com/iran-unsc-response',
    timestamp: '13:15 UTC',
    minutesAgo: 85,
    urgency: 'important',
    category: 'diplomatic',
    summary: 'Iranian Foreign Ministry spokesperson rejected UNSC emergency session as "interference in sovereign affairs," while IRGC commanders warned of "asymmetric response" to any military action.',
  },
  {
    id: 'n4',
    headline: 'Oil Surges Past $110/barrel as Strait of Hormuz Insurance Premiums Triple',
    source: 'Financial Times',
    url: 'https://example.com/oil-hormuz-insurance',
    timestamp: '12:50 UTC',
    minutesAgo: 110,
    urgency: 'important',
    category: 'economic',
    summary: 'Brent crude spiked 8% in morning trading as Lloyd\'s of London announced tripled war-risk premiums for tankers transiting the Strait of Hormuz, signaling market assessment of conflict risk.',
  },
  {
    id: 'n5',
    headline: 'Israeli Knesset Convenes Emergency Security Cabinet; PM Authorizes "All Options"',
    source: 'Haaretz',
    url: 'https://example.com/israel-security-cabinet',
    timestamp: '12:22 UTC',
    minutesAgo: 138,
    urgency: 'important',
    category: 'military',
    summary: 'Israel\'s war cabinet met for four hours in undisclosed location. Statement authorizes IDF to prepare pre-emptive strike options. IAF reportedly conducting readiness exercises over Negev.',
  },
  {
    id: 'n6',
    headline: 'Russia Vetoes UNSC Resolution Demanding Iran Halt Enrichment',
    source: 'BBC News',
    url: 'https://example.com/russia-veto-unsc',
    timestamp: '11:45 UTC',
    minutesAgo: 175,
    urgency: 'update',
    category: 'diplomatic',
    summary: 'Russia and China jointly vetoed the US-UK-France sponsored resolution at the UN Security Council, calling it "prejudicial" and calling for "dialogue rather than coercion."',
  },
  {
    id: 'n7',
    headline: 'Satellite Imagery Shows Activity at Fordow — Possible New Centrifuge Hall',
    source: 'CSIS / Planet Labs',
    url: 'https://example.com/fordow-satellite',
    timestamp: '10:30 UTC',
    minutesAgo: 242,
    urgency: 'analysis',
    category: 'intelligence',
    summary: 'Commercial satellite imagery analyzed by CSIS Arms Control program shows what analysts describe as construction consistent with additional centrifuge cascades in the mountain facility.',
  },
  {
    id: 'n8',
    headline: 'Gulf States Begin Evacuating Non-Essential Personnel from Embassies in Tehran',
    source: 'The Guardian',
    url: 'https://example.com/gulf-evacuation-tehran',
    timestamp: '09:15 UTC',
    minutesAgo: 317,
    urgency: 'update',
    category: 'diplomatic',
    summary: 'Saudi Arabia, UAE, and Bahrain have begun reducing embassy staff in Tehran "as a precautionary measure." European Union has issued travel advisories for Iran, Iraq, and Lebanon.',
  },
  {
    id: 'n9',
    headline: 'Analysis: Why a Strike on Fordow May Be Militarily Ineffective',
    source: 'Foreign Affairs',
    url: 'https://example.com/fordow-strike-analysis',
    timestamp: '08:00 UTC',
    minutesAgo: 392,
    urgency: 'analysis',
    category: 'military',
    summary: 'Three former Pentagon officials write that Fordow\'s 80-meter depth likely makes it impervious to all but the largest US bunker-buster munitions, arguing covert and diplomatic options are more viable.',
  },
  {
    id: 'n10',
    headline: 'Houthi Forces Launch Drone Attack on Saudi Aramco Pipeline — Third This Month',
    source: 'Reuters',
    url: 'https://example.com/houthi-aramco-attack',
    timestamp: '06:40 UTC',
    minutesAgo: 472,
    urgency: 'update',
    category: 'military',
    summary: 'Yemeni Houthi forces, backed by Iran, targeted the East-West oil pipeline in what analysts call coordinated pressure on Gulf energy infrastructure coinciding with nuclear crisis.',
  },
  {
    id: 'n11',
    headline: 'China Proposes "Grand Bargain" Framework — Security Guarantees for Nuclear Freeze',
    source: 'South China Morning Post',
    url: 'https://example.com/china-iran-framework',
    timestamp: '05:20 UTC',
    minutesAgo: 552,
    urgency: 'analysis',
    category: 'diplomatic',
    summary: 'Beijing\'s five-point framework would see Iran freeze enrichment at 60% in exchange for sanctions relief and a US non-aggression declaration. Western officials reportedly receptive but Israel opposes.',
  },
  {
    id: 'n12',
    headline: 'Iran Nuclear Archive Documents Revealed: Weapons Design More Advanced Than Disclosed',
    source: 'New York Times',
    url: 'https://example.com/iran-nuclear-archive',
    timestamp: '04:00 UTC',
    minutesAgo: 632,
    urgency: 'analysis',
    category: 'intelligence',
    summary: 'Documents from the 2018 Mossad extraction of the Tehran nuclear archive, newly declassified, show Iran had advanced to a miniaturized warhead design capable of fitting an ICBM before the 2003 program pause.',
  },
];

const urgencyConfig = {
  breaking: {
    color: '#ef4444',
    bg: 'bg-red-950/40',
    border: 'border-red-800/50',
    label: '⚡ BREAKING',
    dot: 'bg-red-500 animate-pulse',
  },
  important: {
    color: '#f97316',
    bg: 'bg-orange-950/30',
    border: 'border-orange-800/40',
    label: '● IMPORTANT',
    dot: 'bg-orange-500',
  },
  update: {
    color: '#eab308',
    bg: 'bg-yellow-950/20',
    border: 'border-yellow-800/30',
    label: '◌ UPDATE',
    dot: 'bg-yellow-500',
  },
  analysis: {
    color: '#60a5fa',
    bg: 'bg-blue-950/20',
    border: 'border-blue-800/30',
    label: '◈ ANALYSIS',
    dot: 'bg-blue-500',
  },
};

const categoryColors: Record<string, string> = {
  nuclear: '#f87171',
  military: '#60a5fa',
  diplomatic: '#34d399',
  economic: '#fbbf24',
  intelligence: '#a78bfa',
};

const categoryIcons: Record<string, string> = {
  nuclear: '☢',
  military: '⚔',
  diplomatic: '🕊',
  economic: '💹',
  intelligence: '◈',
};

function timeAgo(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h ago` : `${h}h ${m}m ago`;
}

interface Props {
  simulationBreakingNews?: string[];
}

export function NewsPanel({ simulationBreakingNews = [] }: Props) {
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date());
      setRefreshing(false);
    }, 1200);
  }, []);

  // Inject simulation breaking news as virtual items
  const simItems: NewsItem[] = simulationBreakingNews.map((text, i) => ({
    id: `sim-${i}`,
    headline: text,
    source: 'SIMULATION ALERT',
    url: '#',
    timestamp: 'LIVE',
    minutesAgo: i,
    urgency: 'breaking',
    category: 'military',
    summary: 'Generated by Iran Crisis Escalation Simulator based on your decision path.',
  }));

  const allItems = [...simItems, ...SAMPLE_NEWS];

  const filtered = allItems.filter((item) => {
    if (filterUrgency !== 'all' && item.urgency !== filterUrgency) return false;
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-700 bg-slate-800/60">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">Latest Developments</span>
        <div className="flex-1" />
        <span className="text-slate-600 text-xs font-mono">
          {lastRefreshed.toLocaleTimeString('en-US', { hour12: false })} UTC
        </span>
        <button
          onClick={handleRefresh}
          className="text-slate-500 hover:text-white text-xs border border-slate-700 hover:border-slate-500 px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
        >
          <span className={refreshing ? 'animate-spin' : ''}>↻</span>
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="px-3 py-2 border-b border-slate-700 flex gap-2 flex-wrap">
        {/* Urgency filter */}
        <div className="flex gap-1 flex-wrap">
          {['all', 'breaking', 'important', 'update', 'analysis'].map((u) => {
            const cfg = u === 'all' ? null : urgencyConfig[u as keyof typeof urgencyConfig];
            const isActive = filterUrgency === u;
            return (
              <button
                key={u}
                onClick={() => setFilterUrgency(u)}
                className="text-xs px-2 py-0.5 rounded border cursor-pointer transition-all"
                style={{
                  borderColor: isActive ? (cfg?.color ?? '#94a3b8') : '#334155',
                  color: isActive ? (cfg?.color ?? '#94a3b8') : '#64748b',
                  background: isActive ? ((cfg?.color ?? '#94a3b8') + '18') : 'transparent',
                }}
              >
                {u === 'all' ? 'All' : cfg?.label}
              </button>
            );
          })}
        </div>
        <div className="w-px bg-slate-700 hidden sm:block" />
        {/* Category filter */}
        <div className="flex gap-1 flex-wrap">
          {['all', 'nuclear', 'military', 'diplomatic', 'economic', 'intelligence'].map((cat) => {
            const isActive = filterCategory === cat;
            const color = cat === 'all' ? '#94a3b8' : (categoryColors[cat] ?? '#94a3b8');
            const icon = cat === 'all' ? '' : (categoryIcons[cat] ?? '');
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className="text-xs px-2 py-0.5 rounded border cursor-pointer transition-all capitalize"
                style={{
                  borderColor: isActive ? color : '#334155',
                  color: isActive ? color : '#64748b',
                  background: isActive ? color + '18' : 'transparent',
                }}
              >
                {icon} {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* News items */}
      <div className="divide-y divide-slate-700/50 max-h-[520px] overflow-y-auto">
        {filtered.length === 0 && (
          <div className="px-4 py-6 text-center text-slate-500 text-sm">No items match current filters</div>
        )}
        {filtered.map((item) => {
          const urg = urgencyConfig[item.urgency];
          const isExpanded = expanded === item.id;
          const isSimItem = item.id.startsWith('sim-');

          return (
            <div
              key={item.id}
              className={`p-3 hover:bg-slate-700/20 transition-colors cursor-pointer ${urg.bg}`}
              onClick={() => setExpanded(isExpanded ? null : item.id)}
            >
              <div className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${urg.dot}`} />
                <div className="flex-1 min-w-0">
                  {/* Meta row */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: urg.color }}
                    >
                      {urg.label}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: categoryColors[item.category] ?? '#94a3b8' }}
                    >
                      {categoryIcons[item.category]} {item.category.toUpperCase()}
                    </span>
                    <span className="text-slate-600 text-xs font-mono ml-auto">
                      {isSimItem ? 'SIMULATION' : item.source} · {isSimItem ? 'LIVE' : timeAgo(item.minutesAgo)}
                    </span>
                  </div>

                  {/* Headline */}
                  <p className="text-slate-200 text-xs font-semibold leading-snug mb-1">
                    {item.headline}
                  </p>

                  {/* Expanded: summary + read more */}
                  {isExpanded && (
                    <div className="mt-2">
                      <p className="text-slate-400 text-xs leading-relaxed mb-2">{item.summary}</p>
                      {!isSimItem && item.url !== '#' && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 px-2.5 py-1 rounded transition-colors"
                        >
                          Read full article →
                        </a>
                      )}
                    </div>
                  )}

                  {!isExpanded && (
                    <p className="text-slate-500 text-xs truncate">{item.summary}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="border-t border-slate-700 px-3 py-2 flex items-center justify-between">
        <span className="text-slate-600 text-xs">
          {filtered.length} items · Sample data for simulation purposes
        </span>
        <span className="text-slate-700 text-xs">
          Click item to expand · External links are illustrative only
        </span>
      </div>
    </div>
  );
}
