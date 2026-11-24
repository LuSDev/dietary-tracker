import { MotionConfig, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DishBuilderSheet } from './components/DishBuilderSheet';
import { FloatingPillNavbar } from './components/FloatingPillNavbar';
import { FoodsView } from './components/FoodsView';
import { GoalsView } from './components/GoalsView';
import { BootPhase, LaunchIntro } from './components/LaunchIntro';
import { ProgressView } from './components/ProgressView';
import { QuickAddSheet } from './components/QuickAddSheet';
import { TodayView } from './components/TodayView';
import { CustomDish } from './domain/types';
import { useNutritionStore } from './store/useNutritionStore';

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

  const [bootPhase, setBootPhase] = useState<BootPhase>('intro');
  const [globalQuickAddOpen, setGlobalQuickAddOpen] = useState(false);
  const [globalDishBuilderOpen, setGlobalDishBuilderOpen] = useState(false);
  const [newlyCreatedDishToLog, setNewlyCreatedDishToLog] = useState<CustomDish | null>(null);

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

  return (
    <MotionConfig reducedMotion="user">
      {bootPhase !== 'ready' && (
        <LaunchIntro
          phase={bootPhase}
          onSkip={() => setBootPhase('handoff')}
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

        {globalQuickAddOpen && (
          <QuickAddSheet
            open={globalQuickAddOpen}
            onClose={() => setGlobalQuickAddOpen(false)}
            dateKey={selectedDate}
            initialMealSlot="snack"
            onOpenDishBuilder={() => {
              setGlobalQuickAddOpen(false);
              setGlobalDishBuilderOpen(true);
            }}
          />
        )}

        {globalDishBuilderOpen && (
          <DishBuilderSheet
            open={globalDishBuilderOpen}
            onClose={() => setGlobalDishBuilderOpen(false)}
            onSavedAndLog={(dish) => setNewlyCreatedDishToLog(dish)}
          />
        )}

        {newlyCreatedDishToLog && (
          <QuickAddSheet
            open={Boolean(newlyCreatedDishToLog)}
            onClose={() => setNewlyCreatedDishToLog(null)}
            dateKey={selectedDate}
            initialMealSlot="lunch"
            preselectedDish={newlyCreatedDishToLog}
          />
        )}
      </div>
    </MotionConfig>
  );
}

export default App;
