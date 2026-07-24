import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldAlert, MapPin, ClipboardList, LogIn, BookOpen, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, isAdmin, signIn, signOut, loading } = useAuth();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', label: 'Live Map', icon: MapPin },
    { path: '/report', label: 'Report Pothole', icon: ShieldAlert },
    { path: '/impact', label: 'Impact & Innovation', icon: Sparkles },
    ...(isAdmin ? [{ path: '/admin', label: 'Admin Terminal', icon: ClipboardList }] : []),
    { path: '/facts', label: 'Facts & Safety', icon: BookOpen },
  ];



  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-glass)] bg-[var(--bg-surface)]/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" id="nav-container">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-[var(--accent-primary)]/20">
            <ShieldAlert className="h-5 w-5 stroke-[2]" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-white">
            Pothole<span className="text-[var(--accent-primary)] font-medium">Radar</span>
          </span>
        </Link>

        {/* Central Navigation */}
        <nav className="hidden md:flex items-center gap-1.5" id="nav-links">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md duration-200 ${
                  isActive 
                    ? 'text-[var(--text-primary)]' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {item.label}

                {/* Animated active background/indicator with shared layoutId */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 -z-10 rounded-md bg-[var(--border-glass)] border border-[var(--border-glass)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                
                {/* Underline indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavUnderline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-[var(--accent-primary)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button Section */}
        <div className="flex items-center gap-3">
          {/* Mobile menu trigger or direct indicators */}
          <div className="flex md:hidden items-center gap-1.5 mr-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  className={`p-2 rounded-lg border transition-all duration-200 ${
                    isActive
                      ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20'
                      : 'bg-transparent text-[var(--text-secondary)] border-transparent hover:bg-[var(--border-glass)]'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                </Link>
              );
            })}
          </div>

          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-[var(--border-glass)]"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="h-7 w-7 rounded-full border border-[var(--border-subtle)]" />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white text-xs font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium text-[var(--text-primary)] max-w-[100px] truncate">{user.displayName || user.email}</span>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--text-primary)] shadow-sm transition-all duration-200 hover:bg-[var(--bg-surface-elevated)] hover:text-red-400 active:scale-95"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={signIn}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--text-primary)] shadow-sm transition-all duration-200 hover:bg-[var(--bg-surface-elevated)] hover:border-[var(--text-tertiary)] active:scale-95"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
