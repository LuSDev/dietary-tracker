import { X } from 'lucide-react';
import { AnimatePresence, motion, useDragControls, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getCalendarMonthGrid, parseDateKey, toDateKey } from '../domain/dateUtils';
import { sumDailyMacros } from '../domain/nutritionCalculator';
import { useNutritionStore } from '../store/useNutritionStore';

interface CalendarModalProps {
  open: boolean;
  onClose: () => void;
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
}

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export function CalendarModal({
  open,
  onClose,
  selectedDate,
  onSelectDate
}: CalendarModalProps) {
  const logs = useNutritionStore((s) => s.logs);
  const goals = useNutritionStore((s) => s.goals);
  const shouldReduceMotion = useReducedMotion();
  const dragControls = useDragControls();

  const todayKey = toDateKey();
  const todayDate = useMemo(() => parseDateKey(todayKey), [todayKey]);

  // Build 7 months: 5 months back, current month, and next month
  const months = useMemo(() => {
    const baseYear = todayDate.getFullYear();
    const baseMonth = todayDate.getMonth();
    const list = [];

    for (let offset = -5; offset <= 1; offset++) {
      const d = new Date(baseYear, baseMonth + offset, 1, 12, 0, 0);
      const year = d.getFullYear();
      const monthIndex = d.getMonth();
      const grid = getCalendarMonthGrid(year, monthIndex);
      const shortMonthRaw = new Intl.DateTimeFormat('es-ES', { month: 'short' })
        .format(d)
        .replace('.', '');
      const shortMonth = shortMonthRaw.charAt(0).toUpperCase() + shortMonthRaw.slice(1);

      list.push({
        key: `${year}-${String(monthIndex + 1).padStart(2, '0')}`,
        year,
        monthIndex,
        monthTitle: grid.monthTitle,
        shortMonth,
        cells: grid.cells
      });
    }
    return list;
  }, [todayDate]);

  const currentMonthKey = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}`;
  const [visibleMonthTitle, setVisibleMonthTitle] = useState<string>(() => {
    const found = months.find((m) => m.key === currentMonthKey);
    return found?.monthTitle ?? months[months.length - 1].monthTitle;
  });

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const monthRefs = useRef<Record<string, HTMLElement | null>>({});

  // Escape key handler
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Scroll to the selected date's month (or current month) when opening
  useEffect(() => {
    if (!open) return;
    const targetDate = parseDateKey(selectedDate);
    const targetKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
    const targetMonth =
      months.find((m) => m.key === targetKey) ??
      months.find((m) => m.key === currentMonthKey);
    if (targetMonth) {
      setVisibleMonthTitle(targetMonth.monthTitle);
    }

    const timer = window.setTimeout(() => {
      const el = monthRefs.current[targetKey] ?? monthRefs.current[currentMonthKey];
      if (el && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = Math.max(0, el.offsetTop - 12);
      }
    }, 40);

    return () => window.clearTimeout(timer);
  }, [open, selectedDate, months, currentMonthKey]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop + 48;
    let activeTitle = months[0]?.monthTitle ?? '';

    for (const m of months) {
      const el = monthRefs.current[m.key];
      if (el && el.offsetTop <= scrollTop) {
        activeTitle = m.monthTitle;
      }
    }
    setVisibleMonthTitle(activeTitle);
  };

  const ringSize = 30;
  const strokeWidth = 4.2;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center px-2.5 pt-[max(3.25rem,calc(env(safe-area-inset-top,0px)+2rem))] pb-[max(0.625rem,env(safe-area-inset-bottom,0px))]"
          role="dialog"
          aria-modal="true"
          aria-label="Calendario de progreso"
        >
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.12 : 0.22 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#101918]/45 backdrop-blur-[2px]"
          />

          {/* Floating Modal Card */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { y: '100%' }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { y: '105%' }}
            transition={{
              type: 'spring',
              bounce: 0,
              duration: shouldReduceMotion ? 0.14 : 0.36
            }}
            drag={shouldReduceMotion ? false : 'y'}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 450) {
                onClose();
              }
            }}
            className="relative z-10 flex h-full w-full max-w-lg flex-col overflow-hidden rounded-[28px] bg-[#F3EBDD] text-[#101918] shadow-[0_24px_60px_rgba(1,50,48,0.22)]"
          >
            {/* Draggable Header & Handle */}
            <header
              onPointerDown={(e) => {
                if ((e.target as HTMLElement).closest('button')) return;
                dragControls.start(e);
              }}
              className="liquid-glass-header shrink-0 z-20 cursor-grab touch-none active:cursor-grabbing"
            >
              <div className="flex justify-center pt-2.5 pb-1">
                <div className="h-1 w-9 rounded-full bg-[#101918]/20" />
              </div>

              <div className="relative flex items-center justify-center px-4 pt-1 pb-2.5">
                <h1 className="heading-tight text-[17px] font-bold text-[#101918]">
                  {visibleMonthTitle}
                </h1>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar calendario"
                  className="pressable-sm absolute right-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#E8DEC8]/85 text-[#101918]"
                >
                  <X className="h-4.5 w-4.5" strokeWidth={2.4} />
                </button>
              </div>

              {/* Weekday Initials */}
              <div className="grid grid-cols-7 px-3 pb-2 text-center">
                {WEEKDAYS.map((day, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold text-[#53625F]"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </header>

            {/* Scrollable Months */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-3 pt-2 pb-5"
            >
              <div className="space-y-6">
                {months.map((month) => {
                  const firstDayIdx = month.cells.findIndex((c) => c.dayNumber === 1);
                  const labelCol = firstDayIdx >= 0 ? firstDayIdx : 0;

                  return (
                    <section
                      key={month.key}
                      ref={(el) => {
                        monthRefs.current[month.key] = el;
                      }}
                      aria-label={month.monthTitle}
                    >
                      <div className="mb-1.5 grid grid-cols-7">
                        <div
                          style={{ gridColumnStart: labelCol + 1 }}
                          className="text-center text-[15px] font-bold text-[#101918]"
                        >
                          {month.shortMonth}
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-y-3">
                        {month.cells.map((cell, idx) => {
                          if (!cell.dateKey || !cell.dayNumber) {
                            return <div key={`empty-${month.key}-${idx}`} />;
                          }

                          const isToday = cell.dateKey === todayKey;
                          const isSelected = cell.dateKey === selectedDate;
                          const isFuture = cell.dateKey > todayKey;

                          const dayLog = logs[cell.dateKey];
                          const hasEntries = (dayLog?.entries.length ?? 0) > 0;
                          const consumed = hasEntries ? sumDailyMacros(dayLog).calories : 0;
                          const ratio = hasEntries ? consumed / Math.max(1, goals.calories) : 0;
                          const clampedRatio = Math.min(1, Math.max(0, ratio));
                          const isOverGoal = ratio > 1.12;
                          const strokeDashoffset = circumference * (1 - clampedRatio);

                          const ringColor = isOverGoal ? '#D46A43' : '#013230';

                          return (
                            <button
                              key={cell.dateKey}
                              type="button"
                              disabled={isFuture}
                              onClick={() => {
                                onSelectDate(cell.dateKey!);
                                onClose();
                              }}
                              aria-label={`${cell.dayNumber} de ${month.monthTitle}${
                                hasEntries ? `, ${consumed} kcal` : ''
                              }`}
                              className={`pressable-sm flex flex-col items-center gap-1 py-0.5 ${
                                isFuture ? 'cursor-default opacity-40' : 'cursor-pointer'
                              }`}
                            >
                              <span
                                className={`tabular-nums flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold transition-colors ${
                                  isSelected
                                    ? 'bg-[#013230] text-[#F3EBDD]'
                                    : isToday
                                      ? 'bg-[#D46A43] text-[#FFFDF9]'
                                      : 'text-[#101918]'
                                }`}
                              >
                                {cell.dayNumber}
                              </span>

                              <svg
                                width={ringSize}
                                height={ringSize}
                                viewBox={`0 0 ${ringSize} ${ringSize}`}
                                className="-rotate-90"
                                aria-hidden="true"
                              >
                                <circle
                                  cx={ringSize / 2}
                                  cy={ringSize / 2}
                                  r={radius}
                                  fill="none"
                                  stroke="#DFD2B8"
                                  strokeWidth={strokeWidth}
                                />
                                {clampedRatio > 0 && (
                                  <circle
                                    cx={ringSize / 2}
                                    cy={ringSize / 2}
                                    r={radius}
                                    fill="none"
                                    stroke={ringColor}
                                    strokeWidth={strokeWidth}
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                  />
                                )}
                              </svg>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
