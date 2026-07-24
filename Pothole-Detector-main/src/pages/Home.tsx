import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, ShieldCheck, Flame, Database, MapPin, 
  ChevronRight, AlertCircle, RefreshCw 
} from 'lucide-react';
import { api } from '../lib/api';
import { Report } from '../types';
import Map from '../components/Map';
import NewsFeed from '../components/NewsFeed';

export default function Home() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<[number, number] | undefined>(undefined);
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(undefined);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to sync geological dataset:', err);
      setError('Establishing link to civic database failed. Buffered reports remain offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Upvote report action with optimistic state update
  const handleUpvote = async (id: string) => {
    try {
      // Optimistically increment upvotes locally
      setReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, upvotes_count: r.upvotes_count + 1 } : r
        )
      );
      await api.upvoteReport(id);
    } catch (err) {
      console.error('Failed to commit upvote to database:', err);
      // Revert optimistic increment if it fails
      setReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, upvotes_count: Math.max(0, r.upvotes_count - 1) } : r
        )
      );
    }
  };

  // Center Map Camera on specific reported coordinate and open marker details
  const handleFocusCoordinate = (lat: number, lng: number, reportId?: string) => {
    setSelectedCenter([lat, lng]);
    if (reportId) {
      setSelectedReportId(reportId);
    }
    const mapElement = document.getElementById('map-wrapper') || document.getElementById('leaflet-map-element');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Compute live statistics for bento telemetry cards
  const stats = {
    total: reports.length,
    active: reports.filter((r) => r.status !== 'resolved').length,
    severe: reports.filter((r) => r.severity === 'severe' && r.status !== 'resolved').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
  };

  // High Priority unresolved severe potholes list for the telemetry footer
  const priorityIncidents = reports
    .filter((r) => r.severity === 'severe' && r.status !== 'resolved')
    .sort((a, b) => (b.priority_score ?? 0) - (a.priority_score ?? 0))
    .slice(0, 4);

  return (
    <div className="space-y-6" id="home-view-container">
      
      {/* Dynamic Telemetry Stats Grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4" id="stats-dashboard-grid">
        {/* Card 1: Total reports */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex items-center justify-between shadow-lg"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Reported Hazards</span>
            <h3 className="text-2xl font-display font-semibold text-[var(--text-primary)] mt-1">{loading ? '...' : stats.total}</h3>
          </div>
          <div className="h-10 w-10 rounded-lg bg-[var(--border-glass)] border border-[var(--border-glass)] flex items-center justify-center text-[var(--text-secondary)]">
            <Database className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Card 2: Active reports */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex items-center justify-between shadow-lg"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Active Remediation</span>
            <h3 className="text-2xl font-display font-semibold text-amber-400 mt-1">{loading ? '...' : stats.active}</h3>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Card 3: Critical severe alerts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex items-center justify-between shadow-lg"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Critical Danger</span>
            <h3 className="text-2xl font-display font-semibold text-red-500 mt-1">{loading ? '...' : stats.severe}</h3>
          </div>
          <div className="h-10 w-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <Flame className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Card 4: Resolved alerts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex items-center justify-between shadow-lg"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Resolved Hazards</span>
            <h3 className="text-2xl font-display font-semibold text-[var(--status-resolved)] mt-1">{loading ? '...' : stats.resolved}</h3>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[var(--status-resolved)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </motion.div>
      </div>

      {/* CORE DISPLAY: Center Map Centerpiece & News Broadcast Sidebar */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4" id="main-content-layout">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-3 space-y-6">
          <Map 
            reports={reports} 
            loading={loading} 
            error={error} 
            onRetry={fetchReports} 
            onUpvote={handleUpvote}
            selectedCenter={selectedCenter}
            selectedReportId={selectedReportId}
          />
        </div>

        {/* Right Column: Broadcast news ticker alerts sidebar */}
        <div className="lg:col-span-1 h-full">
          <NewsFeed />
        </div>
      </div>

      {/* FOOTER AREA: High-Priority Emergency Incidents Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-xl"
        id="priority-dispatch-telemetry"
      >
        <div className="flex items-center justify-between mb-4 border-b border-[var(--border-glass)] pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4.5 w-4.5 text-red-500 animate-pulse" />
            <span className="font-display text-sm font-semibold text-[var(--text-primary)]">Priority Remediation Dispatch</span>
          </div>
          <span className="text-[10px] font-mono text-[var(--text-tertiary)]">Weight calculated by Priority Index</span>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse h-16 rounded-xl bg-[var(--bg-surface-elevated)]"></div>
            ))}
          </div>
        ) : priorityIncidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <p className="text-xs text-[var(--text-secondary)]">No extreme risk structural dangers identified on current mapping coordinates.</p>
          </div>
        ) : (
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {priorityIncidents.map((rep) => (
              <div 
                key={rep.id} 
                onClick={() => handleFocusCoordinate(rep.lat, rep.lng, rep.id)}
                className="group relative flex items-center justify-between rounded-xl border border-[var(--border-glass)] bg-[var(--bg-base)] hover:bg-[var(--bg-surface-elevated)] p-3 cursor-pointer transition-all duration-300 hover:border-red-500/20"
              >
                <div className="flex gap-2.5 items-center min-w-0">
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded bg-[var(--bg-surface)] border border-[var(--border-glass)] flex items-center justify-center">
                    {rep.image_url ? (
                      <img 
                        src={rep.image_url} 
                        alt="Target" 
                        className="h-full w-full object-cover rounded" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <MapPin className="h-4.5 w-4.5 text-red-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate max-w-[130px] group-hover:text-red-400 transition-colors">
                      {rep.description || 'Severe Pothole'}
                    </p>
                    <p className="text-[9px] font-mono text-[var(--text-tertiary)] mt-0.5">
                      Index: <strong className="text-red-400 font-bold">{rep.priority_score?.toFixed(1) || '0.0'}</strong>
                    </p>
                  </div>
                </div>

                <div className="h-6 w-6 rounded-full border border-[var(--border-glass)] bg-[var(--bg-surface)] group-hover:bg-red-500/10 group-hover:text-red-400 group-hover:border-red-500/20 flex items-center justify-center text-[var(--text-secondary)] transition-all">
                  <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

    </div>
  );
}
