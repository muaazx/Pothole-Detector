import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportForm from './components/ReportForm';
import AdminDashboard from './components/AdminDashboard';
import Facts from './pages/Facts';
import Impact from './pages/Impact';
import { ShieldAlert } from 'lucide-react';
import { AuthProvider, useAuth } from './AuthContext';




// Protected Admin Route Guard Component
function AdminRouteGuard() {
  const { user, isAdmin, loading, signIn } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-primary)] border-t-transparent"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto my-12 max-w-md rounded-2xl border border-red-500/20 bg-[var(--bg-surface)] p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-4">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="font-display text-xl font-bold text-white">Admin Access Restricted</h2>
        <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
          The Admin Control Panel is restricted exclusively to authorized administrator accounts (<span className="font-mono text-amber-400">hassanx3022@gmail.com</span>).
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          {!user ? (
            <button
              onClick={signIn}
              className="w-full rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] py-2.5 text-xs font-semibold text-white shadow-lg transition-all"
            >
              Sign In as Admin
            </button>
          ) : (
            <p className="text-[11px] text-zinc-400">Logged in as: <strong className="text-white">{user.email}</strong> (Non-Admin)</p>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full rounded-xl border border-[var(--border-glass)] bg-[var(--bg-surface-elevated)] py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-white transition-all"
          >
            Return to Live Map
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}

// Specialized routing container to orchestrate smooth Framer Motion page transition wipes
function AnimatedRouteContainer() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="flex-1"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          
          <Route 
            path="/report" 
            element={
              <div className="mx-auto max-w-2xl py-2 px-1">
                <ReportForm onSuccess={() => navigate('/')} />
              </div>
            } 
          />
          
          <Route path="/impact" element={<Impact />} />
          <Route path="/admin" element={<AdminRouteGuard />} />
          <Route path="/facts" element={<Facts />} />

          
          {/* Default 404 Route Catch */}
          <Route 
            path="*" 
            element={
              <div className="flex flex-col items-center justify-center text-center py-20 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] max-w-md mx-auto my-10">
                <ShieldAlert className="h-10 w-10 text-[var(--accent-primary)] mb-4" />
                <h2 className="font-display font-semibold text-lg text-white">Route Grid Out of Bounds</h2>
                <p className="text-xs text-[var(--text-secondary)] mt-2">The coordinate route you requested does not exist.</p>
                <button 
                  onClick={() => navigate('/')}
                  className="mt-6 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-xs font-semibold text-white px-4 py-2 transition-all active:scale-95"
                >
                  Return to Active Map
                </button>
              </div>
            } 
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function MainFooter() {
  const { isAdmin } = useAuth();
  return (
    <footer className="w-full border-t border-[var(--border-glass)] bg-[var(--bg-surface)]/20 py-4.5 text-center mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-[var(--text-tertiary)]">
        <span className="font-mono">Pothole Radar Operations Command Center &copy; {new Date().getFullYear()}</span>
        <div className="flex gap-4">
          <a href="#/report" className="hover:text-[var(--text-secondary)] transition-colors">Submit Report</a>
          {isAdmin && <a href="#/admin" className="hover:text-[var(--text-secondary)] transition-colors">Admin Terminal</a>}
          <a href="#/impact" className="hover:text-[var(--text-secondary)] transition-colors">Impact & Innovation</a>
          <a href="#/" className="hover:text-[var(--text-secondary)] transition-colors">Live Telemetry</a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="flex min-h-screen flex-col bg-[var(--bg-base)] text-[var(--text-primary)] antialiased font-sans">
          {/* Sleek sticky premium navigation bar */}
          <Navbar />

          {/* Primary Page Layout Container */}
          <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col justify-between">
            <AnimatedRouteContainer />
          </main>

          {/* Global Footer Block */}
          <MainFooter />
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

