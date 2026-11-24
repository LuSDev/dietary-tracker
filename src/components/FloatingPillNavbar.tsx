import { BarChart3, Flame, Plus, User, UtensilsCrossed } from 'lucide-react';
import { motion } from 'motion/react';
import { AppTab } from '../domain/types';

interface FloatingPillNavbarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenQuickAdd: () => void;
  revealed?: boolean;
}

const LEFT_NAV_ITEMS: Array<{
  id: AppTab;
  label: string;
  Icon: typeof Flame;
}> = [
  { id: 'today', label: 'Hoy', Icon: Flame },
  { id: 'foods', label: 'Comidas', Icon: UtensilsCrossed }
];

const RIGHT_NAV_ITEMS: Array<{
  id: AppTab;
  label: string;
  Icon: typeof Flame;
}> = [
  { id: 'progress', label: 'Progreso', Icon: BarChart3 },
  { id: 'goals', label: 'Personal', Icon: User }
];

export function FloatingPillNavbar({
  activeTab,
  onSelectTab,
  onOpenQuickAdd,
  revealed = true
}: FloatingPillNavbarProps) {
  const renderTabButton = ({
    id,
    label,
    Icon
  }: {
    id: AppTab;
    label: string;
    Icon: typeof Flame;
  }) => {
    const isActive = activeTab === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => onSelectTab(id)}
        aria-current={isActive ? 'page' : undefined}
        className={`pressable-sm relative z-10 flex min-h-[48px] flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-1.5 py-1.5 text-[11px] font-semibold tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#013230] ${
          isActive
            ? 'text-[#101918]'
            : 'text-[#485856] hover:bg-[#E8DEC8]/55 hover:text-[#101918]'
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
            className="absolute inset-0 rounded-full bg-[#DFD2B8] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
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
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex flex-col items-center">
      {/* Scroll edge fade so scrolling content softens before meeting the floating pill */}
      <div
        aria-hidden="true"
        className="scroll-edge-mask-bottom h-24 w-full"
      />

      <motion.nav
        aria-label="Navegación principal"
        initial={false}
        animate={{
          y: revealed ? 0 : 20,
          opacity: revealed ? 1 : 0
        }}
        transition={{
          type: 'spring',
          bounce: 0,
          duration: 0.54,
          delay: 0.04
        }}
        className="pointer-events-auto -mt-16 mb-[max(0.75rem,calc(env(safe-area-inset-bottom,0px)*0.65))] w-[calc(100%-1.5rem)] max-w-[440px]"
      >
        <div className="liquid-glass-pill flex items-center justify-between gap-1 rounded-full p-1.5">
          {LEFT_NAV_ITEMS.map(renderTabButton)}

          {/* Center Quick-Add Action Button in Characteristic Forest Green */}
          <button
            type="button"
            onClick={onOpenQuickAdd}
            aria-label="Registrar alimento o plato"
            className="pressable btn-primary-teal relative z-20 mx-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#013230] text-[#F3EBDD] shadow-[0_6px_16px_rgba(1,50,48,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#013230]"
          >
            <Plus className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
          </button>

          {RIGHT_NAV_ITEMS.map(renderTabButton)}
        </div>
      </motion.nav>
    </div>
  );
}
