import { BarChart3, Flame, Target, UtensilsCrossed } from 'lucide-react';
import { motion } from 'motion/react';
import { AppTab } from '../domain/types';

interface FloatingPillNavbarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
}

const NAV_ITEMS: Array<{
  id: AppTab;
  label: string;
  Icon: typeof Flame;
}> = [
  { id: 'today', label: 'Hoy', Icon: Flame },
  { id: 'foods', label: 'Comidas', Icon: UtensilsCrossed },
  { id: 'progress', label: 'Progreso', Icon: BarChart3 },
  { id: 'goals', label: 'Objetivos', Icon: Target }
];

export function FloatingPillNavbar({ activeTab, onSelectTab }: FloatingPillNavbarProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex flex-col items-center">
      {/* Scroll edge fade so scrolling content softens before meeting the floating pill */}
      <div
        aria-hidden="true"
        className="scroll-edge-mask-bottom h-24 w-full"
      />

      <nav
        aria-label="Navegación principal"
        className="pointer-events-auto -mt-16 mb-[calc(0.875rem+env(safe-area-inset-bottom,0px))] w-[calc(100%-1.5rem)] max-w-[420px]"
      >
        <div className="liquid-glass-pill flex items-center justify-between gap-1 rounded-full p-1.5">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelectTab(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`pressable-sm relative flex min-h-[48px] flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-2 py-1.5 text-[11px] font-semibold tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#013230] ${
                  isActive ? 'text-[#F3EBDD]' : 'text-[#485856]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="floating-pill-active"
                    transition={{
                      type: 'spring',
                      bounce: 0.14,
                      duration: 0.36
                    }}
                    className="absolute inset-0 rounded-full bg-[#013230] shadow-[0_4px_14px_rgba(1,50,48,0.28)]"
                  />
                )}
                <Icon
                  className="relative z-10 h-[19px] w-[19px]"
                  strokeWidth={isActive ? 2.25 : 1.9}
                  aria-hidden="true"
                />
                <span className="relative z-10 leading-none">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
