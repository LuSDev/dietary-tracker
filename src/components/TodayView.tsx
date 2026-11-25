import {
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Cookie,
  Flame,
  Moon,
  Plus,
  RotateCcw,
  Sun,
  Sunset,
  Trash2
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
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
import { CalendarModal } from './CalendarModal';
import { CalorieRing } from './CalorieRing';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
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
  dinner: Moon,
  extra_snack: Cookie
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
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MealLogEntry | null>(null);
  const [editValue, setEditValue] = useState<number>(100);
  const [pendingDeleteEntry, setPendingDeleteEntry] = useState<MealLogEntry | null>(null);

  // Undo state for deleted log entries
  const [deletedUndo, setDeletedUndo] = useState<{
    dateKey: string;
    entry: MealLogEntry;
  } | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  const todayKey = toDateKey();
  const yesterdayKey = addDaysToKey(todayKey, -1);
  const isYesterday = selectedDate === yesterdayKey;
  const isBeforeYesterday = selectedDate < yesterdayKey;
  const shouldReduceMotion = useReducedMotion();
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
      dinner: [],
      extra_snack: []
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

          <div className="flex items-center gap-1.5">
            <div
              className="flex items-center gap-1.5 rounded-full border border-[#D46A43]/25 bg-[#F5E1D8] px-3 py-1.5"
              title="Días consecutivos cerca de tu objetivo"
            >
              <Flame className="h-4 w-4 text-[#B54E28]" strokeWidth={2.3} />
              <span className="tabular-nums text-[13px] font-bold text-[#8B3B1E]">
                {streakCount} {streakCount === 1 ? 'día' : 'días'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setCalendarOpen(true)}
              aria-label="Abrir calendario"
              className="pressable-sm flex h-10 w-10 items-center justify-center rounded-full text-[#101918] hover:bg-[#E8DEC8]/50"
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6 3C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V6C21 4.34315 19.6569 3 18 3H6ZM5 8.5C5 7.94772 5.44772 7.5 6 7.5H18C18.5523 7.5 19 7.94772 19 8.5V17.5C19 18.3284 18.3284 19 17.5 19H6.5C5.67157 19 5 18.3284 5 17.5V8.5Z"
                  fill="currentColor"
                />
                <rect x="9.5" y="9.25" width="2" height="2" rx="0.5" fill="currentColor" />
                <rect x="12.5" y="9.25" width="2" height="2" rx="0.5" fill="currentColor" />
                <rect x="15.5" y="9.25" width="2" height="2" rx="0.5" fill="currentColor" />
                <rect x="6.5" y="12.25" width="2" height="2" rx="0.5" fill="currentColor" />
                <rect x="9.5" y="12.25" width="2" height="2" rx="0.5" fill="currentColor" />
                <rect x="12.5" y="12.25" width="2" height="2" rx="0.5" fill="currentColor" />
                <rect x="15.5" y="12.25" width="2" height="2" rx="0.5" fill="currentColor" />
                <rect x="6.5" y="15.25" width="2" height="2" rx="0.5" fill="currentColor" />
                <rect x="9.5" y="15.25" width="2" height="2" rx="0.5" fill="currentColor" />
                <rect x="12.5" y="15.25" width="2" height="2" rx="0.5" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isBeforeYesterday && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.96 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.96 }}
              transition={{
                type: 'spring',
                bounce: 0,
                duration: shouldReduceMotion ? 0.14 : 0.26
              }}
              className="pointer-events-none absolute inset-x-0 top-full z-20 flex justify-center pt-2"
            >
              <button
                type="button"
                onClick={() => setSelectedDate(todayKey)}
                className="pressable-sm pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-[#DFD2B8] px-3.5 py-1.5 text-[12.5px] font-semibold text-[#101918] shadow-[0_6px_18px_rgba(1,50,48,0.12),inset_0_1px_0_rgba(255,255,255,0.45)]"
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.2} />
                Volver a hoy
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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

        {isYesterday && (
          <RevealSection
            revealed={revealed}
            offsetY={10}
            delay={0.03}
            duration={0.5}
            className="flex flex-col items-center px-2 pt-1 text-center"
          >
            <p className="text-[13px] font-medium text-[#41514F]">
              ¿Te olvidaste de agregar algo?
              <br />
              <span className="whitespace-nowrap">
                ¡No hay problema! todavía estás a tiempo.
              </span>
            </p>
            <button
              type="button"
              onClick={() => openQuickAddForSlot('lunch')}
              className="pressable mt-2.5 inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#013230] px-4 py-1.5 text-[13px] font-semibold text-[#F3EBDD]"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
              Añadir Comida
            </button>
          </RevealSection>
        )}

        {/* Meals Breakdown (only slots with logged items) */}
        <RevealSection
          aria-label="Comidas registradas"
          revealed={revealed}
          offsetY={14}
          delay={0.05}
          duration={0.58}
          className="space-y-3.5"
        >
          {(() => {
            const activeSlots = (Object.keys(MEAL_SLOT_META) as MealSlot[]).filter(
              (slot) => entriesBySlot[slot].length > 0
            );

            if (activeSlots.length === 0) {
              return (
                <div className="surface-card rounded-[24px] px-5 py-7 text-center">
                  <p className="text-[15px] font-semibold text-[#101918]">
                    Mmm... Parece que no hay comida por aquí
                  </p>
                  <p className="mt-1 text-[13px] text-[#41514F]">
                    {isBeforeYesterday
                      ? 'No hay comidas registradas para este día'
                      : '¡Prueba añadiendo algo!'}
                  </p>
                  {!isBeforeYesterday && (
                    <button
                      type="button"
                      onClick={() => openQuickAddForSlot('breakfast')}
                      className="pressable mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#013230] px-5 py-2.5 text-[14px] font-semibold text-[#F3EBDD]"
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.4} />
                      Registrar comida
                    </button>
                  )}
                </div>
              );
            }

            return activeSlots.map((slot) => {
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
                          {slotCalories} kcal · {items.length}{' '}
                          {items.length === 1 ? 'ítem' : 'ítems'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Logged Entries */}
                  <div className="divide-y divide-[#013230]/8 border-t border-[#013230]/8 bg-[#FFFDF9]/75">
                    {items.map((entry) => (
                      <div
                        key={entry.id}
                        className={`flex items-center justify-between gap-2 py-2.5 pl-4 ${
                          isBeforeYesterday ? 'pr-4' : 'pr-2'
                        }`}
                      >
                        <button
                          type="button"
                          disabled={isBeforeYesterday}
                          onClick={() => !isBeforeYesterday && openEditEntry(entry)}
                          className={`min-h-[44px] min-w-0 flex-1 py-1 text-left ${
                            isBeforeYesterday ? 'cursor-default' : ''
                          }`}
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
                          {!isBeforeYesterday && (
                            <button
                              type="button"
                              onClick={() => setPendingDeleteEntry(entry)}
                              aria-label={`Eliminar ${entry.name}`}
                              className="pressable-sm flex h-11 w-11 items-center justify-center rounded-full text-[#53625F] hover:bg-[#F5E1D8] hover:text-[#B54E28]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            });
          })()}
        </RevealSection>
      </main>

      <UndoToast
        message={deletedUndo ? `Eliminado: ${deletedUndo.entry.name}` : null}
        onUndo={handleUndoRemove}
        onDismiss={() => setDeletedUndo(null)}
      />

      <ConfirmDeleteModal
        open={Boolean(pendingDeleteEntry)}
        title="¿Eliminar registro?"
        description={
          pendingDeleteEntry
            ? `Se eliminará «${pendingDeleteEntry.name}» de ${MEAL_SLOT_META[pendingDeleteEntry.mealSlot].label}.`
            : ''
        }
        onCancel={() => setPendingDeleteEntry(null)}
        onConfirm={() => {
          if (!pendingDeleteEntry) return;
          handleRemoveEntry(pendingDeleteEntry);
          setPendingDeleteEntry(null);
        }}
      />

      {/* Quick Add Bottom Sheet */}
      <QuickAddSheet
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        dateKey={selectedDate}
        initialMealSlot={quickAddSlot}
        onOpenDishBuilder={onOpenDishBuilder}
      />

      {/* Calendar Rings Modal */}
      <CalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        selectedDate={selectedDate}
        onSelectDate={(dateKey) => setSelectedDate(dateKey)}
      />

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
