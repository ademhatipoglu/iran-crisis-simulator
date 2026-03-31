import { useEffect, useRef } from 'react';
import type { TickerItem } from '../types';

interface Props {
  items: TickerItem[];
  breakingNews?: string[];
}

export function NewsTicker({ items, breakingNews = [] }: Props) {
  const tickerRef = useRef<HTMLDivElement>(null);

  const categoryColor = {
    breaking: '#ef4444',
    update: '#fbbf24',
    analysis: '#60a5fa',
  };

  const categoryLabel = {
    breaking: '⚡ BREAKING',
    update: '● UPDATE',
    analysis: '◈ ANALYSIS',
  };

  // Combine breaking news (prepended) with ticker items
  const allItems: TickerItem[] = [
    ...breakingNews.map((text, i) => ({
      id: `breaking-${i}`,
      text,
      category: 'breaking' as const,
    })),
    ...items,
  ];

  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;

    let animationId: number;
    let pos = 0;

    const tick = () => {
      pos -= 0.5;
      const scrollWidth = el.scrollWidth / 2;
      if (Math.abs(pos) >= scrollWidth) {
        pos = 0;
      }
      el.style.transform = `translateX(${pos}px)`;
      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [allItems.length]);

  return (
    <div className="border-b border-slate-800 bg-slate-900/90 overflow-hidden h-8 flex items-center">
      {/* LIVE label */}
      <div className="flex-shrink-0 flex items-center gap-2 px-3 border-r border-slate-700 h-full bg-red-950/60">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-red-400 text-xs font-bold uppercase tracking-widest whitespace-nowrap">Live Feed</span>
      </div>

      {/* Scrolling ticker */}
      <div className="flex-1 overflow-hidden relative">
        <div ref={tickerRef} className="flex items-center gap-8 whitespace-nowrap will-change-transform">
          {/* Duplicate for seamless loop */}
          {[...allItems, ...allItems].map((item, i) => (
            <div key={`${item.id}-${i}`} className="flex items-center gap-2 flex-shrink-0">
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: categoryColor[item.category] }}
              >
                {categoryLabel[item.category]}
              </span>
              <span className="text-slate-300 text-xs">{item.text}</span>
              <span className="text-slate-700 text-xs">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timestamp */}
      <div className="flex-shrink-0 px-3 border-l border-slate-700 h-full flex items-center">
        <span className="text-slate-600 text-xs font-mono">
          {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })} UTC
        </span>
      </div>
    </div>
  );
}
