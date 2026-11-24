import {
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Flame,
  Moon,
  Plus,
  Sun,
  Sunset,
  Trash2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo, useRef, useState } from 'react';
import {
  addDaysToKey,
  formatSpanishDateHeader,
  toDateKey
} from '../domain/dateUtils';
import { evaluateDayAdherence, sumDailyMacros } from '../domain/nutritionCalculator';
import { MEAL_SLOT_META, MealLogEntry, MealSlot } from '../domain/types';
import { useNutritionStore } from '../store/useNutritionStore';
import { AnimatedNumber } from './AnimatedNumber';
import { BottomSheet } from './BottomSheet';
import { CalorieRing } from './CalorieRing';
import { QuickAddSheet } from './QuickAddSheet';
import { RevealSection } from './RevealSection';
import { UndoToast } from './UndoToast';

interface TodayViewProps {
  onOpenDishBuilder: () => void;
  revealed?: boolean;
}

const SLOT_ICONS: Record<MealSlot, typeof Coffee> = {
  breakfast: Coffee,
  lunch: Sun,
  snack: Sunset,
  dinner: Moon
};

export function TodayView({ onOpenDishBuilder, revealed = true }: TodayViewProps) {
  const selectedDate = useNutritionStore((s) => s.selectedDate);
  const setSelectedDate = useNutritionStore((s) => s.setSelectedDate);
  const goals = useNutritionStore((s) => s.goals);
  const logs = useNutritionStore((s) => s.logs);
  const removeLogEntry = useNutritionStore((s) => s.removeLogEntry);
  const restoreLogEntry = useNutritionStore((s) => s.restoreLogEntry);
  const updateLogEntryAmount = useNutritionStore((s) => s.updateLogEntryAmount);

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddSlot, setQuickAddSlot] = useState<MealSlot>('lunch');
  const [editingEntry, setEditingEntry] = useState<MealLogEntry | null>(null);
  const [editValue, setEditValue] = useState<number>(100);

  // Undo state for deleted log entries
  const [deletedUndo, setDeletedUndo] = useState<{
    dateKey: string;
    entry: MealLogEntry;
  } | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  const todayKey = toDateKey();
  const dateHeader = formatSpanishDateHeader(selectedDate, todayKey);

  const dayLog = logs[selectedDate];
  const consumed = useMemo(() => sumDailyMacros(dayLog), [dayLog]);

  // Calculate active logging streak ending today or yesterday
  const streakCount = useMemo(() => {
    let count = 0;
    const d = new Date();
    if (!logs[todayKey]?.entries.length) {
      d.setDate(d.getDate() - 1);
    }
    for (let i = 0; i < 60; i++) {
      const k = toDateKey(d);
      const summary = evaluateDayAdherence(k, logs[k], goals);
      if (summary.entryCount > 0 && summary.deviationRatio <= 0.28) {
        count++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  }, [logs, goals, todayKey]);

  const entriesBySlot = useMemo(() => {
    const grouped: Record<MealSlot, MealLogEntry[]> = {
      breakfast: [],
      lunch: [],
      snack: [],
      dinner: []
    };
    for (const entry of dayLog?.entries ?? []) {
      grouped[entry.mealSlot].push(entry);
    }
    return grouped;
  }, [dayLog]);

  const openQuickAddForSlot = (slot: MealSlot) => {
    setQuickAddSlot(slot);
    setQuickAddOpen(true);
  };

  const openEditEntry = (entry: MealLogEntry) => {
    setEditingEntry(entry);
    setEditValue(entry.sourceType === 'dish' ? entry.servings ?? 1 : entry.grams);
  };

  const handleSaveEntryEdit = () => {
    if (!editingEntry) return;
    updateLogEntryAmount(selectedDate, editingEntry.id, editValue);
    setEditingEntry(null);
  };

  const handleRemoveEntry = (entry: MealLogEntry) => {
    removeLogEntry(selectedDate, entry.id);
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    setDeletedUndo({ dateKey: selectedDate, entry });
    undoTimerRef.current = window.setTimeout(() => {
      setDeletedUndo(null);
    }, 4500);
  };

  const handleUndoRemove = () => {
    if (!deletedUndo) return;
    restoreLogEntry(deletedUndo.dateKey, deletedUndo.entry);
    setDeletedUndo(null);
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
  };

  const macroCards = [
    {
      label: 'Proteína',
      consumed: consumed.protein,
      goal: goals.proteinGrams,
      barColor: 'var(--color-macro-protein)'
    },
    {
      label: 'Carbos',
      consumed: consumed.carbs,
      goal: goals.carbsGrams,
      barColor: 'var(--color-macro-carbs)'
    },
    {
      label: 'Grasas',
      consumed: consumed.fat,
      goal: goals.fatGrams,
      barColor: 'var(--color-macro-fats)'
    }
  ];

  return (
    <div className="pb-32">
      {/* Translucent Top Header */}
      <header className="liquid-glass-header sticky top-0 z-30 pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 pt-3.5 pb-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedDate(addDaysToKey(selectedDate, -1))}
              aria-label="Día anterior"
              className="pressable-sm flex h-10 w-10 items-center justify-center rounded-full text-[#013230] hover:bg-[#E8DEC8]/60"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
            </button>

            <div>
              <h1 className="heading-tight text-[26px] font-bold text-[#101918]">
                {dateHeader.primary}
              </h1>
              <p className="text-[13px] font-medium text-[#41514F]">
                {dateHeader.secondary}
              </p>
            </div>

            {!dateHeader.isToday && (
              <button
                type="button"
                onClick={() => setSelectedDate(addDaysToKey(selectedDate, 1))}
                aria-label="Día siguiente"
                className="pressable-sm flex h-10 w-10 items-center justify-center rounded-full text-[#013230] hover:bg-[#E8DEC8]/60"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2.4} />
              </button>
            )}
          </div>

          <div
            className="flex items-center gap-1.5 rounded-full border border-[#D46A43]/25 bg-[#F5E1D8] px-3 py-1.5"
            title="Días consecutivos cerca de tu objetivo"
          >
            <Flame className="h-4 w-4 text-[#B54E28]" strokeWidth={2.3} />
            <span className="tabular-nums text-[13px] font-bold text-[#8B3B1E]">
              {streakCount} {streakCount === 1 ? 'día' : 'días'}
            </span>
          </div>
        </div>
      </header>

      <main key={selectedDate} className="mx-auto max-w-lg space-y-5 px-4 pt-4">
        {/* Hero Calorie Arc & Macro Progress Bars (outside cards) */}
        <RevealSection
          aria-label="Resumen calórico del día"
          revealed={revealed}
          offsetY={10}
          duration={0.54}
          className="flex flex-col items-center pt-3 pb-1"
        >
          <CalorieRing
            consumed={consumed.calories}
            goal={goals.calories}
            revealed={revealed}
          />

          {/* Macro Progress Bars (stacked full-width) */}
          <div className="mt-5 w-full space-y-3.5">
            {macroCards.map((macro, idx) => {
              const isOver = macro.consumed > macro.goal;
              const pct = Math.min(
                100,
                Math.round((macro.consumed / Math.max(1, macro.goal)) * 100)
              );
              const displayPct = revealed ? pct : 0;
              return (
                <div key={macro.label} className="w-full space-y-1.5">
                  <div className="flex items-baseline justify-between text-[14px]">
                    <span className="font-semibold text-[#101918]">{macro.label}</span>
                    <span className="tabular-nums font-medium text-[#41514F]">
                      <strong
                        className={isOver ? 'text-[var(--color-macro-over)]' : 'text-[#101918]'}
                      >
                        <AnimatedNumber
                          value={macro.consumed}
                          enabled={revealed}
                          duration={0.62}
                          delay={idx * 0.035}
                        />
                      </strong>{' '}
                      / {macro.goal} g
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E8DEC8]">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: `${displayPct}%` }}
                      transition={{
                        type: 'spring',
                        bounce: 0,
                        duration: 0.62,
                        delay: revealed ? idx * 0.035 : 0
                      }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: isOver ? 'var(--color-macro-over)' : macro.barColor
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </RevealSection>

        {/* Meals Breakdown */}
        <RevealSection
          aria-label="Comidas registradas"
          revealed={revealed}
          offsetY={14}
          delay={0.05}
          duration={0.58}
          className="space-y-3.5"
        >
          {(Object.keys(MEAL_SLOT_META) as MealSlot[]).map((slot) => {
            const meta = MEAL_SLOT_META[slot];
            const items = entriesBySlot[slot];
            const slotCalories = items.reduce((acc, i) => acc + i.macros.calories, 0);
            const SlotIcon = SLOT_ICONS[slot];

            return (
              <div key={slot} className="surface-card overflow-hidden rounded-[24px]">
                {/* Meal Slot Header */}
                <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E8DEC8]/75 text-[#013230]">
                      <SlotIcon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-[16px] font-bold text-[#101918]">{meta.label}</h2>
                      <p className="tabular-nums text-[12px] font-medium text-[#41514F]">
                        {items.length > 0
                          ? `${slotCalories} kcal · ${items.length} ${items.length === 1 ? 'ítem' : 'ítems'}`
                          : meta.defaultTimeHint}
                      </p>
                    </div>
                  </div>

                  {/* Secondary Tinted Pill (reserves solid Deep Teal for hero primary action) */}
                  <button
                    type="button"
                    onClick={() => openQuickAddForSlot(slot)}
                    aria-label={`Añadir a ${meta.label}`}
                    className="pressable-sm flex min-h-[44px] items-center gap-1 rounded-full bg-[#D7E6E3]/85 px-3.5 text-[13px] font-bold text-[#013230]"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.4} />
                    Añadir
                  </button>
                </div>

                {/* Logged Entries */}
                {items.length > 0 && (
                  <div className="divide-y divide-[#013230]/8 border-t border-[#013230]/8 bg-[#FFFDF9]/75">
                    {items.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between gap-2 py-2.5 pr-2 pl-4"
                      >
                        <button
                          type="button"
                          onClick={() => openEditEntry(entry)}
                          className="min-h-[44px] min-w-0 flex-1 py-1 text-left"
                        >
                          <div className="flex items-center gap-1.5">
                            {entry.sourceType === 'dish' && (
                              <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-[#D7E6E3] px-1.5 py-0.5 text-[11px] font-bold text-[#013230]">
                                <ChefHat className="h-3 w-3" />
                                Plato
                              </span>
                            )}
                            <span className="truncate text-[14px] font-semibold text-[#101918]">
                              {entry.name}
                            </span>
                          </div>
                          <div className="tabular-nums mt-0.5 text-[12px] text-[#41514F]">
                            {entry.sourceType === 'dish' && entry.servings
                              ? `${entry.servings} ${entry.servings === 1 ? 'porción' : 'porciones'} (${entry.grams}g)`
                              : `${entry.grams}g`}{' '}
                            · P {entry.macros.protein}g · C {entry.macros.carbs}g · G{' '}
                            {entry.macros.fat}g
                          </div>
                        </button>

                        <div className="flex shrink-0 items-center gap-1">
                          <span className="tabular-nums text-[14px] font-bold text-[#013230]">
                            {entry.macros.calories}{' '}
                            <span className="text-[11px] font-medium text-[#53625F]">kcal</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEntry(entry)}
                            aria-label={`Eliminar ${entry.name}`}
                            className="pressable-sm flex h-11 w-11 items-center justify-center rounded-full text-[#53625F] hover:bg-[#F5E1D8] hover:text-[#B54E28]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </RevealSection>
      </main>

      <UndoToast
        message={deletedUndo ? `Eliminado: ${deletedUndo.entry.name}` : null}
        onUndo={handleUndoRemove}
        onDismiss={() => setDeletedUndo(null)}
      />

      {/* Quick Add Bottom Sheet */}
      {quickAddOpen && (
        <QuickAddSheet
          open={quickAddOpen}
          onClose={() => setQuickAddOpen(false)}
          dateKey={selectedDate}
          initialMealSlot={quickAddSlot}
          onOpenDishBuilder={onOpenDishBuilder}
        />
      )}

      {/* Inline Entry Quantity Editor Sheet */}
      <BottomSheet
        open={Boolean(editingEntry)}
        onClose={() => setEditingEntry(null)}
        title={editingEntry?.name ?? ''}
        subtitle={
          editingEntry?.sourceType === 'dish'
            ? 'Ajustar porciones registradas'
            : 'Ajustar cantidad en gramos'
        }
        footer={
          <button
            type="button"
            onClick={handleSaveEntryEdit}
            className="pressable btn-primary-teal flex min-h-[50px] w-full items-center justify-center rounded-full bg-[#013230] text-[15px] font-semibold text-[#F3EBDD]"
          >
            Guardar cambios
          </button>
        }
      >
        {editingEntry && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setEditValue((v) =>
                    editingEntry.sourceType === 'dish'
                      ? Math.max(0.5, v - 0.5)
                      : Math.max(5, v - 15)
                  )
                }
                aria-label="Reducir cantidad"
                className="pressable-sm flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8DEC8] text-[20px] font-bold text-[#101918]"
              >
                −
              </button>
              <div className="relative flex-1">
                <input
                  type="number"
                  inputMode="decimal"
                  step={editingEntry.sourceType === 'dish' ? 0.25 : 1}
                  value={editValue}
                  onChange={(e) => setEditValue(Math.max(0.25, Number(e.target.value) || 0))}
                  className="tabular-nums h-12 w-full rounded-2xl border border-[#013230]/15 bg-[#FFFDF9] px-4 text-center text-[20px] font-bold text-[#101918] focus:border-[#013230] focus:outline-none"
                />
                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[13px] font-medium text-[#53625F]">
                  {editingEntry.sourceType === 'dish' ? 'porc.' : 'g'}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditValue((v) =>
                    editingEntry.sourceType === 'dish' ? v + 0.5 : v + 15
                  )
                }
                aria-label="Aumentar cantidad"
                className="pressable-sm flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8DEC8] text-[20px] font-bold text-[#101918]"
              >
                +
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
