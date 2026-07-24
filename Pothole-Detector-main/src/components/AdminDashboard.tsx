import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpDown, Filter, ThumbsUp, Calendar, AlertTriangle, 
  CheckCircle, Loader2, RefreshCw, ChevronDown, Check, Trash2 
} from 'lucide-react';
import { api } from '../lib/api';
import { Report } from '../types';

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Sort State
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'priority_score' | 'upvotes_count' | 'created_at'>('priority_score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Active Dropdown Row Trackers
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to sync administrative reports database:', err);
      setError('Could not establish synchronization link with structural database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Sort Toggle Handler
  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Status Updater with Optimistic UI updates & Robust API Rollback
  const handleUpdateStatus = async (id: string, newStatus: Report['status']) => {
    // Locate original report in state for potential rollback
    const originalReport = reports.find(r => r.id === id);
    if (!originalReport) return;
    if (originalReport.status === newStatus) {
      setActiveDropdownId(null);
      return;
    }

    // Optimistically update local state immediately
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setIsUpdatingId(id);
    setActiveDropdownId(null);

    try {
      await api.updateReportStatus(id, newStatus);
    } catch (err) {
      console.error('Database reject on status update, rolling back:', err);
      // Rollback to previous state on API error
      setReports(prev => prev.map(r => r.id === id ? originalReport : r));
      alert('Status modification rejected by backend. Rollback executed.');
    } finally {
      setIsUpdatingId(null);
    }
  };

  // Filter & Sort Operations
  const processedReports = useMemo(() => {
    let result = [...reports];

    // 1. Status Filter
    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }

    // 2. Severity Filter
    if (severityFilter !== 'all') {
      result = result.filter(r => r.severity === severityFilter);
    }

    // 3. Sort Order
    result.sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      if (sortField === 'priority_score') {
        valA = a.priority_score ?? 0;
        valB = b.priority_score ?? 0;
      } else if (sortField === 'upvotes_count') {
        valA = a.upvotes_count;
        valB = b.upvotes_count;
      } else if (sortField === 'created_at') {
        valA = a.created_at ? new Date(a.created_at).getTime() : 0;
        valB = b.created_at ? new Date(b.created_at).getTime() : 0;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [reports, statusFilter, severityFilter, sortField, sortDirection]);

  // Formatted date generator
  const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'Pending';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'N/A';
    }
  };

  // Available Status Categories
  const statusOptions: { value: Report['status']; label: string; bg: string; text: string }[] = [
    { value: 'reported', label: 'Reported', bg: 'bg-zinc-500/10', text: 'text-zinc-400' },
    { value: 'acknowledged', label: 'Acknowledged', bg: 'bg-amber-500/10', text: 'text-amber-400' },
    { value: 'in_progress', label: 'In Progress', bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
    { value: 'resolved', label: 'Resolved', bg: 'bg-[var(--status-resolved)]/10', text: 'text-[var(--status-resolved)]' },
  ];

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-2xl space-y-6" id="admin-dashboard-root">
      
      {/* Header operations panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-glass)] pb-5">
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight text-[var(--text-primary)]">Infrastructure Control Panel</h1>
          <p className="text-xs text-[var(--text-tertiary)]">Real-time telemetry, threat weighting index (priority scores), and repair dispatch routing.</p>
        </div>

        <button
          onClick={fetchReports}
          className="self-start flex items-center gap-2 rounded-lg border border-[var(--border-glass)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-white transition-all active:scale-95"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[var(--accent-primary)]' : ''}`} />
          <span>Sync Database</span>
        </button>
      </div>

      {/* FILTER BAR PANEL */}
      <div className="flex flex-col md:flex-row gap-3 bg-[var(--bg-base)]/50 p-4 border border-[var(--border-glass)] rounded-xl items-center justify-between">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <Filter className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
            <span className="font-medium">Filter Engine:</span>
          </div>

          {/* Severity filter dropdown */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-lg border border-[var(--border-glass)] bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-primary)] px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
          >
            <option value="all">All Severities</option>
            <option value="minor">Minor Damage</option>
            <option value="moderate">Moderate Hazards</option>
            <option value="severe">Severe Danger</option>
          </select>

          {/* Status filter dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[var(--border-glass)] bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-primary)] px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
          >
            <option value="all">All Statuses</option>
            <option value="reported">Reported</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Display matched result stats count */}
        <span className="text-[10px] font-mono text-[var(--text-tertiary)] w-full text-left md:w-auto md:text-right">
          Matched records: <strong className="text-[var(--text-secondary)] font-semibold">{processedReports.length}</strong> / {reports.length}
        </span>
      </div>

      {/* TABLE DATA PORTAL */}
      <div className="rounded-xl border border-[var(--border-glass)] bg-[var(--bg-surface)] min-h-[360px] pb-24">
        
        {loading ? (
          // Skeleton loader for table rows
          <div className="p-6 space-y-4">
            <div className="h-8 w-full rounded bg-[var(--bg-surface-elevated)] animate-pulse"></div>
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <div className="h-10 w-10 rounded bg-[var(--bg-surface-elevated)] animate-pulse shrink-0"></div>
                <div className="h-6 flex-1 rounded bg-[var(--bg-surface-elevated)] animate-pulse"></div>
                <div className="h-6 w-20 rounded bg-[var(--bg-surface-elevated)] animate-pulse shrink-0"></div>
                <div className="h-6 w-20 rounded bg-[var(--bg-surface-elevated)] animate-pulse shrink-0"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error State
          <div className="flex flex-col items-center justify-center text-center p-12 bg-red-950/5">
            <AlertTriangle className="h-8 w-8 text-red-500 mb-3" />
            <h3 className="font-display font-semibold text-[var(--text-primary)]">Control Panel Out of Sync</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-sm">{error}</p>
            <button
              onClick={fetchReports}
              className="mt-6 flex items-center gap-1.5 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-xs font-semibold text-white px-4 py-2 transition-all active:scale-95"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry Control Link</span>
            </button>
          </div>
        ) : processedReports.length === 0 ? (
          // Empty State Matching Filters
          <div className="flex flex-col items-center justify-center text-center p-16">
            <CheckCircle className="h-8 w-8 text-[var(--text-tertiary)] mb-3" />
            <h3 className="font-display font-medium text-[var(--text-secondary)] text-sm">Telemetry Clear</h3>
            <p className="text-xs text-[var(--text-tertiary)] mt-1 max-w-xs">No unresolved infrastructure issues match your current filters.</p>
          </div>
        ) : (
          <>
            {/* DESKTOP HIGH-DENSITY GRID DATA TABLE */}
            <div className="hidden lg:block overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-glass)] bg-[var(--bg-surface-elevated)]/40 text-[11px] font-semibold text-[var(--text-secondary)] tracking-wider uppercase select-none">
                    <th className="px-5 py-4 w-16">Evidence</th>
                    <th className="px-5 py-4 max-w-[240px]">Geological Assessment</th>
                    
                    {/* Interactive header sorting columns */}
                    <th className="px-5 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('priority_score')}>
                      <div className="flex items-center gap-1.5">
                        Priority Index
                        <ArrowUpDown className={`h-3 w-3 ${sortField === 'priority_score' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)]'}`} />
                      </div>
                    </th>

                    <th className="px-5 py-4">Severity</th>
                    <th className="px-5 py-4">Status Flag</th>
                    
                    <th className="px-5 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('upvotes_count')}>
                      <div className="flex items-center gap-1.5">
                        Upvotes
                        <ArrowUpDown className={`h-3 w-3 ${sortField === 'upvotes_count' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)]'}`} />
                      </div>
                    </th>

                    <th className="px-5 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('created_at')}>
                      <div className="flex items-center gap-1.5">
                        Reported At
                        <ArrowUpDown className={`h-3 w-3 ${sortField === 'created_at' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)]'}`} />
                      </div>
                    </th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-glass)] text-xs">
                  {processedReports.map((report) => (
                    <tr 
                      key={report.id} 
                      className={`hover:bg-[var(--bg-surface-elevated)]/30 transition-colors ${
                        isUpdatingId === report.id ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <td className="px-5 py-3.5">
                        {report.image_url ? (
                          <div className="h-10 w-10 overflow-hidden rounded-lg border border-[var(--border-glass)]">
                            <img
                              src={report.image_url}
                              alt="Pothole Document"
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-base)] text-[var(--text-tertiary)] text-[10px] border border-[var(--border-glass)]">
                            N/A
                          </div>
                        )}
                      </td>

                      {/* Description */}
                      <td className="px-5 py-3.5 max-w-[240px]">
                        <p className="font-medium text-[var(--text-primary)] truncate" title={report.description}>
                          {report.description}
                        </p>
                        <p className="text-[10px] text-[var(--text-tertiary)] font-mono mt-0.5">
                          ID: {String(report.id).substring(0, 8)} | LAT: {Number(report.lat ?? 0).toFixed(4)} LNG: {Number(report.lng ?? 0).toFixed(4)}
                        </p>
                      </td>

                      {/* Priority Score Index */}
                      <td className="px-5 py-3.5 font-mono">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                          (report.priority_score ?? 0) >= 70 ? 'bg-red-500/10 text-red-400 font-bold' :
                          (report.priority_score ?? 0) >= 40 ? 'bg-amber-500/10 text-amber-400' :
                          'bg-zinc-500/10 text-zinc-400'
                        }`}>
                          {report.priority_score?.toFixed(1) || '0.0'}
                        </span>
                      </td>

                      {/* Severity badge */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          report.severity === 'severe' ? 'bg-[var(--status-severe)]/10 text-[var(--status-severe)] border border-[var(--status-severe)]/20' :
                          report.severity === 'moderate' ? 'bg-[var(--status-moderate)]/10 text-[var(--status-moderate)] border border-[var(--status-moderate)]/20' :
                          'bg-[var(--status-minor)]/10 text-[var(--status-minor)] border border-[var(--status-minor)]/20'
                        }`}>
                          {report.severity}
                        </span>
                      </td>

                      {/* Status flag */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${
                          report.status === 'resolved' ? 'bg-[var(--status-resolved)]/10 text-[var(--status-resolved)]' :
                          report.status === 'in_progress' ? 'bg-indigo-500/10 text-indigo-400' :
                          report.status === 'acknowledged' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-zinc-500/10 text-zinc-400'
                        }`}>
                          <div className={`h-1.5 w-1.5 rounded-full ${
                            report.status === 'resolved' ? 'bg-[var(--status-resolved)]' :
                            report.status === 'in_progress' ? 'bg-indigo-400' :
                            report.status === 'acknowledged' ? 'bg-amber-400' :
                            'bg-zinc-400'
                          }`} />
                          {report.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Upvotes count */}
                      <td className="px-5 py-3.5 font-mono text-[var(--text-secondary)] font-semibold">
                        <div className="flex items-center gap-1.5">
                          <ThumbsUp className="h-3 w-3 text-[var(--text-tertiary)]" />
                          {report.upvotes_count}
                        </div>
                      </td>

                      {/* Date Reported */}
                      <td className="px-5 py-3.5 text-[var(--text-secondary)] font-mono">
                        {formatDateTime(report.created_at)}
                      </td>

                      {/* Administrative Action Dropdown Menu */}
                      <td className="px-5 py-3.5 text-right relative">
                        <button
                          onClick={() => setActiveDropdownId(prev => prev === report.id ? null : report.id)}
                          className="inline-flex items-center gap-1 rounded border border-[var(--border-glass)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-subtle)] px-2.5 py-1 text-[10px] font-bold text-white transition-all active:scale-95 cursor-pointer"
                        >
                          <span>Manage</span>
                          <ChevronDown className="h-3 w-3" />
                        </button>

                        {/* Dropdown Box Overlay */}
                        <AnimatePresence>
                          {activeDropdownId === report.id && (
                            <>
                              <div className="fixed inset-0 z-[100]" onClick={() => setActiveDropdownId(null)}></div>
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute right-5 mt-1.5 w-44 rounded-xl border border-[var(--border-glass)] bg-[var(--bg-surface-elevated)] p-1.5 shadow-2xl z-[101] text-left max-h-52 overflow-y-auto"
                              >
                                <span className="block text-[9px] font-bold text-[var(--text-tertiary)] px-2.5 py-1 uppercase tracking-widest border-b border-[var(--border-glass)] mb-1">
                                  Mark Status:
                                </span>
                                {statusOptions.map((opt) => (
                                  <button
                                    key={opt.value}
                                    onClick={() => handleUpdateStatus(report.id, opt.value)}
                                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                                      report.status === opt.value
                                        ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-semibold'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-white'
                                    }`}
                                  >
                                    <span className="capitalize">{opt.label.replace('_', ' ')}</span>
                                    {report.status === opt.value && <Check className="h-3.5 w-3.5 text-[var(--accent-primary)]" />}
                                  </button>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE SANE LAYOUT - MULTI-CARD LIST */}
            <div className="block lg:hidden space-y-4 p-4">
              {processedReports.map((report) => (
                <div 
                  key={report.id} 
                  className={`rounded-xl border border-[var(--border-glass)] bg-[var(--bg-base)] p-4 space-y-4 relative overflow-hidden ${
                    isUpdatingId === report.id ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <div className="flex gap-3 items-start justify-between">
                    {report.image_url && (
                      <img
                        src={report.image_url}
                        alt="Mobile Preview"
                        className="h-14 w-14 rounded object-cover border border-[var(--border-glass)]"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{report.description}</p>
                      <p className="text-[9px] text-[var(--text-tertiary)] font-mono mt-0.5">ID: {String(report.id).substring(0, 8)}</p>
                      <p className="text-[9px] text-[var(--text-tertiary)] font-mono">LAT: {Number(report.lat ?? 0).toFixed(4)} | LNG: {Number(report.lng ?? 0).toFixed(4)}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`inline-block text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        report.severity === 'severe' ? 'bg-red-500/10 text-red-400' :
                        report.severity === 'moderate' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-green-500/10 text-green-400'
                      }`}>
                        {report.severity}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-zinc-500/10 px-1.5 py-0.5 rounded text-white">
                        Idx: {report.priority_score?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[var(--border-glass)] pt-3 text-[10px]">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3 text-[var(--text-tertiary)]" />
                      <span className="font-semibold text-white">{report.upvotes_count}</span>
                      <span className="text-[var(--text-tertiary)]">upvotes</span>
                    </div>
                    
                    <span className="text-[var(--text-tertiary)] font-mono">{formatDateTime(report.created_at)}</span>
                  </div>

                  {/* Mobile Direct Action Controls */}
                  <div className="grid grid-cols-4 gap-1.5 border-t border-[var(--border-glass)] pt-3">
                    {statusOptions.map((opt) => {
                      const isCurrent = report.status === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleUpdateStatus(report.id, opt.value)}
                          className={`text-[9px] py-1.5 rounded font-semibold text-center transition-all ${
                            isCurrent 
                              ? 'bg-[var(--accent-primary)]/20 text-white font-bold ring-1 ring-[var(--accent-primary)]' 
                              : 'bg-[var(--bg-surface-elevated)] text-[var(--text-tertiary)] hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
