import { MotionConfig, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DishBuilderSheet } from './components/DishBuilderSheet';
import { FloatingPillNavbar } from './components/FloatingPillNavbar';
import { FoodsView } from './components/FoodsView';
import { GoalsView } from './components/GoalsView';
import { InstallAppModal } from './components/InstallAppModal';
import { BootPhase, LaunchIntro } from './components/LaunchIntro';
import { ProgressView } from './components/ProgressView';
import { QuickAddSheet } from './components/QuickAddSheet';
import { TodayView } from './components/TodayView';
import { addDaysToKey, toDateKey } from './domain/dateUtils';
import { isStandalonePWA } from './domain/pwa';
import { CustomDish } from './domain/types';
import { useNutritionStore } from './store/useNutritionStore';

const INSTALL_MODAL_DISMISSED_KEY = 'nura-install-modal-dismissed';

function syncLightThemeColor(color: string) {
  const lightThemeMeta = document.querySelector(
    'meta[name="theme-color"][media*="prefers-color-scheme: light"]'
  );
  if (lightThemeMeta) {
    lightThemeMeta.setAttribute('content', color);
  }
}

export function App() {
  const activeTab = useNutritionStore((s) => s.activeTab);
  const setActiveTab = useNutritionStore((s) => s.setActiveTab);
  const selectedDate = useNutritionStore((s) => s.selectedDate);
  const shouldReduceMotion = useReducedMotion();

  const [isStandalone, setIsStandalone] = useState<boolean>(() => isStandalonePWA());
  const [bootPhase, setBootPhase] = useState<BootPhase>(() =>
    isStandalonePWA() ? 'intro' : 'ready'
  );
  const [installModalOpen, setInstallModalOpen] = useState<boolean>(() => {
    if (isStandalonePWA()) return false;
    try {
      return window.sessionStorage.getItem(INSTALL_MODAL_DISMISSED_KEY) !== '1';
    } catch {
      return true;
    }
  });
  const [globalQuickAddOpen, setGlobalQuickAddOpen] = useState(false);
  const [globalDishBuilderOpen, setGlobalDishBuilderOpen] = useState(false);
  const [newlyCreatedDishToLog, setNewlyCreatedDishToLog] = useState<CustomDish | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => {
      const standalone = isStandalonePWA();
      setIsStandalone(standalone);
      if (standalone) {
        setInstallModalOpen(false);
      }
    };

    mediaQuery.addEventListener('change', handleDisplayModeChange);
    return () => mediaQuery.removeEventListener('change', handleDisplayModeChange);
  }, []);

  const handleDismissInstallModal = () => {
    setInstallModalOpen(false);
    try {
      window.sessionStorage.setItem(INSTALL_MODAL_DISMISSED_KEY, '1');
    } catch {
      // Ignore storage failures in private browsing
    }
  };

  useEffect(() => {
    if (bootPhase === 'intro') {
      syncLightThemeColor('#013230');
      const holdMs = shouldReduceMotion ? 640 : 1620;
      const timer = window.setTimeout(() => {
        setBootPhase('handoff');
      }, holdMs);
      return () => window.clearTimeout(timer);
    }

    if (bootPhase === 'handoff') {
      document.documentElement.classList.remove('booting');
      syncLightThemeColor('#F3EBDD');
      const settleMs = shouldReduceMotion ? 240 : 500;
      const timer = window.setTimeout(() => {
        setBootPhase('ready');
      }, settleMs);
      return () => window.clearTimeout(timer);
    }

    document.documentElement.classList.remove('booting');
    syncLightThemeColor('#F3EBDD');
  }, [bootPhase, shouldReduceMotion]);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('booting');
      syncLightThemeColor('#F3EBDD');
    };
  }, []);

  const isMainRevealed = bootPhase !== 'intro';
  const todayKey = toDateKey();
  const yesterdayKey = addDaysToKey(todayKey, -1);

  return (
    <MotionConfig reducedMotion="user">
      {isStandalone && bootPhase !== 'ready' && (
        <LaunchIntro
          phase={bootPhase}
          onSkip={() => setBootPhase('handoff')}
        />
      )}

      {!isStandalone && (
        <InstallAppModal
          open={installModalOpen}
          onDismiss={handleDismissInstallModal}
        />
      )}

      <div className="min-h-[100dvh] bg-[#F3EBDD] text-[#101918]">
        {activeTab === 'today' && (
          <TodayView
            onOpenDishBuilder={() => setGlobalDishBuilderOpen(true)}
            revealed={isMainRevealed}
          />
        )}
        {activeTab === 'foods' && <FoodsView />}
        {activeTab === 'progress' && <ProgressView />}
        {activeTab === 'goals' && <GoalsView />}

        <FloatingPillNavbar
          activeTab={activeTab}
          revealed={isMainRevealed}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
          }}
          onOpenQuickAdd={() => setGlobalQuickAddOpen(true)}
        />

        <QuickAddSheet
          open={globalQuickAddOpen}
          onClose={() => setGlobalQuickAddOpen(false)}
          dateKey={todayKey}
          initialMealSlot="snack"
          onOpenDishBuilder={() => {
            setGlobalQuickAddOpen(false);
            setGlobalDishBuilderOpen(true);
          }}
        />

        {globalDishBuilderOpen && (
          <DishBuilderSheet
            open={globalDishBuilderOpen}
            onClose={() => setGlobalDishBuilderOpen(false)}
            onSavedAndLog={(dish) => setNewlyCreatedDishToLog(dish)}
          />
        )}

        <QuickAddSheet
          open={Boolean(newlyCreatedDishToLog)}
          onClose={() => setNewlyCreatedDishToLog(null)}
          dateKey={selectedDate < yesterdayKey ? todayKey : selectedDate}
          initialMealSlot="lunch"
          preselectedDish={newlyCreatedDishToLog}
        />
      </div>
    </MotionConfig>
  );
}

export default App;
