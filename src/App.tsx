import { MotionConfig } from 'motion/react';
import { useState } from 'react';
import { DishBuilderSheet } from './components/DishBuilderSheet';
import { FloatingPillNavbar } from './components/FloatingPillNavbar';
import { FoodsView } from './components/FoodsView';
import { GoalsView } from './components/GoalsView';
import { ProgressView } from './components/ProgressView';
import { QuickAddSheet } from './components/QuickAddSheet';
import { TodayView } from './components/TodayView';
import { CustomDish } from './domain/types';
import { useNutritionStore } from './store/useNutritionStore';

export function App() {
  const activeTab = useNutritionStore((s) => s.activeTab);
  const setActiveTab = useNutritionStore((s) => s.setActiveTab);
  const selectedDate = useNutritionStore((s) => s.selectedDate);

  const [globalDishBuilderOpen, setGlobalDishBuilderOpen] = useState(false);
  const [newlyCreatedDishToLog, setNewlyCreatedDishToLog] = useState<CustomDish | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-[100dvh] bg-[#F3EBDD] text-[#101918]">
        {activeTab === 'today' && (
          <TodayView onOpenDishBuilder={() => setGlobalDishBuilderOpen(true)} />
        )}
        {activeTab === 'foods' && <FoodsView />}
        {activeTab === 'progress' && <ProgressView />}
        {activeTab === 'goals' && <GoalsView />}

        <FloatingPillNavbar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
          }}
        />

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
