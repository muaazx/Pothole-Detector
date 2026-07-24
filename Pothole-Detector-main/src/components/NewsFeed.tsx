import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, AlertTriangle, Info, ExternalLink, RefreshCw, Layers } from 'lucide-react';
import { api } from '../lib/api';
import { NewsAlert } from '../types';

export default function NewsFeed() {
  const [news, setNews] = useState<NewsAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortNewsByDanger = (items: NewsAlert[]): NewsAlert[] => {
    return [...items].sort((a, b) => {
      // Prioritize alarming/critical news first
      const weightA = a.alarm_level === 'alarming' ? 1 : 0;
      const weightB = b.alarm_level === 'alarming' ? 1 : 0;

      if (weightA !== weightB) {
        return weightB - weightA;
      }

      // Secondary sort: most recent publication timestamp
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });
  };

  const fetchNewsFeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getNews();
      setNews(sortNewsByDanger(data));
    } catch (err) {
      console.error('Failed to sync news alerts:', err);
      setError('Could not establish satellite feed for road hazard bulletins.');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncNews = async () => {
    setIsSyncing(true);
    setError(null);
    try {
      const data = await api.syncNews();
      setNews(sortNewsByDanger(data));
    } catch (err) {
      console.error('Failed to web scrape live news:', err);
      setError('Live web scraping of Al Jazeera news feeds failed.');
    } finally {
      setIsSyncing(false);
    }
  };


  useEffect(() => {
    fetchNewsFeed();
  }, []);

  // Helper to compute human relative timestamps
  const getRelativeTime = (isoString: string) => {
    try {
      const now = new Date();
      const past = new Date(isoString);
      const diffMs = now.getTime() - past.getTime();
      
      if (isNaN(diffMs)) return 'recently';

      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHr / 24);

      if (diffSec < 60) return 'just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHr < 24) return `${diffHr}h ago`;
      return `${diffDays}d ago`;
    } catch (e) {
      return 'recently';
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border-glass)] bg-[var(--bg-surface)]/40 backdrop-blur-xl p-5 shadow-2xl flex flex-col h-full max-h-[550px]" id="news-feed-panel">
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-red-400 opacity-75"></span>
            <Radio className="h-3.5 w-3.5 z-10" />
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold tracking-tight text-[var(--text-primary)]">Civic Hazard Broadcast</h2>
            <p className="text-[10px] text-[var(--text-tertiary)]">Live regional road updates</p>
          </div>
        </div>

        <button 
          onClick={handleSyncNews} 
          disabled={isSyncing || loading}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border-glass)] bg-[var(--bg-surface-elevated)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[var(--accent-primary)] active:scale-95 disabled:opacity-50 cursor-pointer"
          title="Scrape latest news from Al Jazeera and global road safety feeds"
        >
          <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin text-blue-400' : 'text-blue-400'}`} />
          <span>{isSyncing ? 'Scraping...' : 'Sync News'}</span>
        </button>
      </div>


      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3.5" id="news-list-container">
        <AnimatePresence mode="popLayout">
          {loading ? (
            // Skeleton Loading State
            Array.from({ length: 4 }).map((_, i) => (
              <div 
                key={`skeleton-news-${i}`} 
                className="animate-pulse rounded-xl border border-[var(--border-glass)] bg-[var(--bg-surface)]/30 p-3.5 space-y-2.5"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 w-16 rounded bg-[var(--border-subtle)]"></div>
                  <div className="h-3 w-12 rounded bg-[var(--border-subtle)]"></div>
                </div>
                <div className="h-3.5 w-full rounded bg-[var(--border-subtle)]"></div>
                <div className="h-3 w-2/3 rounded bg-[var(--border-subtle)]"></div>
              </div>
            ))
          ) : error ? (
            // Error State with Retry Button
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center p-6 h-48 border border-red-500/10 rounded-xl bg-red-950/5"
            >
              <AlertTriangle className="h-6 w-6 text-red-400 mb-2.5" />
              <p className="text-xs text-[var(--text-secondary)] mb-4">{error}</p>
              <button
                onClick={fetchNewsFeed}
                className="flex items-center gap-1.5 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[10px] font-bold text-white px-3 py-1.5 transition-all"
              >
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span>Reconnect Feed</span>
              </button>
            </motion.div>
          ) : news.length === 0 ? (
            // Empty State
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center p-8 h-48 border border-[var(--border-subtle)] rounded-xl"
            >
              <Layers className="h-6 w-6 text-[var(--text-tertiary)] mb-2" />
              <h4 className="text-xs font-semibold text-[var(--text-secondary)]">All Clear</h4>
              <p className="text-[10px] text-[var(--text-tertiary)] mt-1 max-w-[180px]">No active road blocks, severe pothole alerts, or maintenance works reported.</p>
            </motion.div>
          ) : (
            // Staggered news list
            news.map((item, index) => {
              const isAlarming = item.alarm_level === 'alarming';
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className={`rounded-xl p-3.5 transition-all duration-300 border bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] flex flex-col justify-between group ${
                    isAlarming 
                      ? 'border-l-4 border-l-[var(--status-severe)] border-t-[var(--border-glass)] border-r-[var(--border-glass)] border-b-[var(--border-glass)] shadow-[0_4px_16px_rgba(239,68,68,0.04)]' 
                      : 'border-l-4 border-l-[var(--accent-primary)] border-t-[var(--border-glass)] border-r-[var(--border-glass)] border-b-[var(--border-glass)]'
                  }`}
                >
                  <div>
                    {/* Header bar of news item */}
                    <div className="flex items-center justify-between text-[10px] font-semibold text-[var(--text-tertiary)] mb-2">
                      <span className="flex items-center gap-1.5 uppercase font-mono tracking-wider">
                        {isAlarming ? (
                          <span className="flex items-center gap-1 text-[var(--status-severe)]">
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                            CRITICAL BULLET
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[var(--accent-primary)]">
                            <Info className="h-3 w-3 shrink-0" />
                            CIVIC NOTICE
                          </span>
                        )}
                      </span>
                      <span className="font-medium text-[var(--text-tertiary)]">{getRelativeTime(item.published_at)}</span>
                    </div>

                    {/* Headline text */}
                    <h3 className="text-xs font-medium text-[var(--text-primary)] leading-snug tracking-tight group-hover:text-white mb-2.5">
                      {item.headline}
                    </h3>
                  </div>

                  {/* Source and link footer */}
                  <div className="flex items-center justify-between border-t border-[var(--border-glass)]/60 pt-2 text-[10px]">
                    <span className="text-[var(--text-tertiary)] font-medium">Source: <strong className="text-[var(--text-secondary)] font-semibold">{item.source_name}</strong></span>
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-bold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-all"
                    >
                      <span>Read Source</span>
                      <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
