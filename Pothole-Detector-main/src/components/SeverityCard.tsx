import { motion } from 'motion/react';
import { AlertCircle, AlertTriangle, Flame } from 'lucide-react';

export type SeverityType = 'minor' | 'moderate' | 'severe';

interface SeverityCardProps {
  value: SeverityType;
  onChange: (value: SeverityType) => void;
}

export default function SeverityCard({ value, onChange }: SeverityCardProps) {
  const cards = [
    {
      type: 'minor' as const,
      label: 'Minor Damage',
      description: 'Shallow surface pitting; low speed impact. No urgent hazard.',
      icon: AlertCircle,
      color: 'var(--status-minor)',
      borderClass: 'border-l-4 border-l-[var(--status-minor)]',
      glowColor: 'rgba(34, 197, 94, 0.15)',
    },
    {
      type: 'moderate' as const,
      label: 'Moderate Hazard',
      description: 'Noticeable depth; drivers swerving slightly to avoid. Mid-severity damage potential.',
      icon: AlertTriangle,
      color: 'var(--status-moderate)',
      borderClass: 'border-l-4 border-l-[var(--status-moderate)]',
      glowColor: 'rgba(245, 158, 11, 0.15)',
    },
    {
      type: 'severe' as const,
      label: 'Severe Danger',
      description: 'Deep canyon, tire rim structure hazard. Immediate remediation required.',
      icon: Flame,
      color: 'var(--status-severe)',
      borderClass: 'border-l-4 border-l-[var(--status-severe)]',
      glowColor: 'rgba(239, 104, 104, 0.2)',
    },
  ];

  return (
    <div className="grid gap-3.5 sm:grid-cols-3" id="severity-selection-cards">
      {cards.map((card) => {
        const isSelected = value === card.type;
        const Icon = card.icon;

        return (
          <motion.div
            key={card.type}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(card.type)}
            className={`relative flex cursor-pointer flex-col justify-between rounded-xl p-4 transition-all duration-300 ${card.borderClass} ${
              isSelected
                ? 'bg-[var(--bg-surface-elevated)] border-r border-t border-b border-[var(--border-subtle)] text-white shadow-2xl'
                : 'bg-[var(--bg-surface)] border-r border-t border-b border-[var(--border-subtle)]/40 text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]/80 hover:text-[var(--text-primary)]'
            }`}
            style={{
              boxShadow: isSelected 
                ? `0 10px 30px -10px ${card.glowColor}, inset 0 0 12px ${card.glowColor}` 
                : undefined,
            }}
          >
            {/* Outline highlight ring inside the card */}
            {isSelected && (
              <motion.div
                layoutId="activeGlowRing"
                className="absolute inset-0 rounded-xl pointer-events-none ring-2"
                style={{ ringColor: card.color, color: card.color }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}

            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-sm font-semibold tracking-wide text-[var(--text-primary)]">
                  {card.label}
                </span>
                <div 
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{ 
                    backgroundColor: isSelected ? `${card.color}15` : 'rgba(255,255,255,0.02)',
                    color: card.color 
                  }}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]">
                {card.description}
              </p>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--text-tertiary)]">
                {card.type} Category
              </span>
              <div className={`h-2 w-2 rounded-full ${isSelected ? 'animate-pulse' : ''}`} style={{ backgroundColor: card.color }} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
