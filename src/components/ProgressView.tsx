import { ArrowUpRight, Calendar, Check, ChevronLeft, ChevronRight, Flame, Target, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import {
  addDaysToKey,
  formatSpanishDateHeader,
  getCalendarMonthGrid,
  parseDateKey,
  toDateKey
} from '../domain/dateUtils';
import { evaluateDayAdherence } from '../domain/nutritionCalculator';
import { AdherenceLevel } from '../domain/types';
import { useNutritionStore } from '../store/useNutritionStore';
import { RevealSection } from './RevealSection';

const WEEKDAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function getHeatmapCellStyle(level: AdherenceLevel, isFuture: boolean): string {
  if (isFuture) {
    return 'bg-transparent text-[#53625F]/40 cursor-default';
  }
  switch (level) {
    case 'optimal':
      return 'bg-[#013230] text-[#F3EBDD] shadow-[0_4px_12px_rgba(1,50,48,0.28)]';
    case 'close':
      return 'bg-[#2A6F68] text-[#FAF6EE] shadow-[0_2px_8px_rgba(42,111,104,0.22)]';
    case 'moderate':
      return 'bg-[#99C2BC] text-[#101918]';
    case 'far_under':
      return 'bg-[#E8DEC8] text-[#41514F]';
    case 'far_over':
      return 'bg-[#D46A43] text-[#FFFDF9] shadow-[0_2px_8px_rgba(212,106,67,0.25)]';
    case 'empty':
    default:
      return 'bg-[#F3EBDD]/70 text-[#53625F] border border-[#013230]/10';
  }
}

function getLevelBadge(level: AdherenceLevel): { label: string; className: string } {
  switch (level) {
    case 'optimal':
      return { label: 'Objetivo clavado', className: 'bg-[#013230] text-[#F3EBDD]' };
    case 'close':
      return { label: 'Muy cerca del objetivo', className: 'bg-[#D7E6E3] text-[#013230]' };
    case 'moderate':
      return { label: 'Adherencia moderada', className: 'bg-[#E8DEC8] text-[#101918]' };
    case 'far_over':
      return { label: 'Por encima del objetivo', className: 'bg-[#F5E1D8] text-[#8B3B1E]' };
    case 'far_under':
      return { label: 'Por debajo del objetivo', className: 'bg-[#E8DEC8] text-[#41514F]' };
    case 'empty':
    default:
      return { label: 'Sin registros', className: 'bg-[#E8DEC8]/60 text-[#53625F]' };
  }
}

export function ProgressView() {
  const logs = useNutritionStore((s) => s.logs);
  const goals = useNutritionStore((s) => s.goals);
  const setSelectedDate = useNutritionStore((s) => s.setSelectedDate);
  const setActiveTab = useNutritionStore((s) => s.setActiveTab);

  const todayKey = toDateKey();
  const todayDate = parseDateKey(todayKey);

  const [periodDays, setPeriodDays] = useState<7 | 30>(30);
  const [viewMonth, setViewMonth] = useState<{ year: number; month: number }>({
    year: todayDate.getFullYear(),
    month: todayDate.getMonth()
  });
  const [inspectedDateKey, setInspectedDateKey] = useState<string>(todayKey);

  const periodStats = useMemo(() => {
    const summaries = [];
    for (let i = 0; i < periodDays; i++) {
      const k = addDaysToKey(todayKey, -i);
      const s = evaluateDayAdherence(k, logs[k], goals);
      if (s.entryCount > 0) {
        summaries.push(s);
      }
    }

    const loggedCount = summaries.length;
    if (loggedCount === 0) {
      return {
        loggedCount: 0,
        avgScore: 0,
        avgCalories: 0,
        avgProtein: 0,
        avgCarbs: 0,
        avgFat: 0,
        onTargetCount: 0,
        dailyBars: [] as ReturnType<typeof evaluateDayAdherence>[]
      };
    }

    const avgScore = Math.round(
      summaries.reduce((acc, s) => acc + s.score, 0) / loggedCount
    );
    const avgCalories = Math.round(
      summaries.reduce((acc, s) => acc + s.caloriesConsumed, 0) / loggedCount
    );
    const avgProtein = Math.round(
      summaries.reduce((acc, s) => acc + s.macrosConsumed.protein, 0) / loggedCount
    );
    const avgCarbs = Math.round(
      summaries.reduce((acc, s) => acc + s.macrosConsumed.carbs, 0) / loggedCount
    );
    const avgFat = Math.round(
      summaries.reduce((acc, s) => acc + s.macrosConsumed.fat, 0) / loggedCount
    );
    const onTargetCount = summaries.filter(
      (s) => s.level === 'optimal' || s.level === 'close'
    ).length;

    const chartLength = periodDays === 7 ? 7 : 14;
    const dailyBars = [];
    for (let i = chartLength - 1; i >= 0; i--) {
      const k = addDaysToKey(todayKey, -i);
      dailyBars.push(evaluateDayAdherence(k, logs[k], goals));
    }

    return {
      loggedCount,
      avgScore,
      avgCalories,
      avgProtein,
      avgCarbs,
      avgFat,
      onTargetCount,
      dailyBars
    };
  }, [logs, goals, periodDays, todayKey]);

  const monthGrid = useMemo(
    () => getCalendarMonthGrid(viewMonth.year, viewMonth.month),
    [viewMonth]
  );

  const inspectedSummary = useMemo(
    () => evaluateDayAdherence(inspectedDateKey, logs[inspectedDateKey], goals),
    [inspectedDateKey, logs, goals]
  );

  const inspectedHeader = formatSpanishDateHeader(inspectedDateKey, todayKey);
  const inspectedBadge = getLevelBadge(inspectedSummary.level);

  const shiftMonth = (delta: number) => {
    setViewMonth((prev) => {
      const d = new Date(prev.year, prev.month + delta, 1, 12, 0, 0);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const maxBarCalories = Math.max(
    goals.calories * 1.35,
    ...periodStats.dailyBars.map((b) => b.caloriesConsumed)
  );

  return (
    <div className="pb-32">
      {/* Translucent Header */}
      <header className="liquid-glass-header sticky top-0 z-30 pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto max-w-lg px-4 pt-3.5 pb-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="heading-tight text-[24px] font-bold text-[#101918]">
                Progreso
              </h1>
              <p className="text-[13px] font-medium text-[#41514F]">
                Constancia y cercanía a tu objetivo
              </p>
            </div>

            <div className="flex rounded-full bg-[#E8DEC8]/85 p-1">
              {([7, 30] as const).map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setPeriodDays(days)}
                  className={`pressable-sm min-h-[36px] rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-colors ${
                    periodDays === days
                      ? 'bg-[#013230] text-[#F3EBDD]'
                      : 'text-[#41514F]'
                  }`}
                >
                  {days} días
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-5 px-4 pt-4">
        {/* KPI Summary Grid */}
        <RevealSection
          aria-label="Resumen estadístico"
          offsetY={10}
          duration={0.54}
          className="grid grid-cols-2 gap-3"
        >
          <div className="surface-card rounded-[24px] p-4">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#41514F]">
              <Target className="h-4 w-4 text-[#013230]" />
              Adherencia media
            </div>
            <div className="display-number mt-1.5 text-[30px] font-bold text-[#013230]">
              {periodStats.avgScore}%
            </div>
            <div className="mt-0.5 text-[12px] text-[#53625F]">
              {periodStats.onTargetCount} de {periodStats.loggedCount} días en rango
            </div>
          </div>

          <div className="surface-card rounded-[24px] p-4">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#41514F]">
              <Flame className="h-4 w-4 text-[#B54E28]" />
              Promedio diario
            </div>
            <div className="display-number mt-1.5 text-[30px] font-bold text-[#101918]">
              {periodStats.avgCalories}
            </div>
            <div className="tabular-nums mt-0.5 text-[12px] text-[#53625F]">
              Meta: {goals.calories} kcal/día
            </div>
          </div>

          <div className="surface-card col-span-2 rounded-[24px] p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#101918]">
                <TrendingUp className="h-4 w-4 text-[#1F5B55]" />
                Tendencia ({periodDays === 7 ? '7 días' : '14 días'})
              </div>
              <span className="tabular-nums text-[12px] font-semibold text-[#41514F]">
                Media: P {periodStats.avgProtein}g · C {periodStats.avgCarbs}g · G {periodStats.avgFat}g
              </span>
            </div>

            {/* Mini Bar Chart with Target Line */}
            <div className="relative flex h-28 items-end gap-1.5 pt-4">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 border-t border-dashed border-[#013230]/40"
                style={{
                  bottom: `${Math.min(95, (goals.calories / maxBarCalories) * 100)}%`
                }}
              >
                <span className="tabular-nums absolute -top-4 right-0 rounded bg-[#F3EBDD] px-1 text-[11px] font-semibold text-[#013230]">
                  {goals.calories}
                </span>
              </div>

              {periodStats.dailyBars.map((bar) => {
                const heightPct =
                  bar.caloriesConsumed > 0
                    ? Math.max(8, Math.round((bar.caloriesConsumed / maxBarCalories) * 100))
                    : 4;
                const barColor =
                  bar.level === 'optimal'
                    ? '#013230'
                    : bar.level === 'close'
                      ? '#2A6F68'
                      : bar.level === 'far_over'
                        ? '#D46A43'
                        : bar.entryCount > 0
                          ? '#99C2BC'
                          : '#E8DEC8';
                const d = parseDateKey(bar.date);

                return (
                  <button
                    key={bar.date}
                    type="button"
                    onClick={() => setInspectedDateKey(bar.date)}
                    aria-label={`${bar.date}: ${bar.caloriesConsumed} kcal`}
                    className="group flex h-full flex-1 flex-col items-center justify-end gap-1"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ type: 'spring', bounce: 0, duration: 0.45 }}
                      className="w-full rounded-t-lg transition-opacity"
                      style={{
                        backgroundColor: barColor,
                        opacity: inspectedDateKey === bar.date ? 1 : 0.85
                      }}
                    />
                    <span
                      className={`tabular-nums text-[11px] font-semibold ${
                        inspectedDateKey === bar.date ? 'text-[#013230]' : 'text-[#53625F]'
                      }`}
                    >
                      {d.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </RevealSection>

        {/* Illuminated Monthly Heatmap Calendar */}
        <RevealSection
          aria-label="Calendario histórico de adherencia"
          offsetY={14}
          delay={0.05}
          duration={0.58}
          className="surface-card rounded-[28px] p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#013230]" />
              <h2 className="text-[17px] font-bold text-[#101918]">
                {monthGrid.monthTitle}
              </h2>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                aria-label="Mes anterior"
                className="pressable-sm flex h-11 w-11 items-center justify-center rounded-full bg-[#E8DEC8]/75 text-[#101918]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                aria-label="Mes siguiente"
                className="pressable-sm flex h-11 w-11 items-center justify-center rounded-full bg-[#E8DEC8]/75 text-[#101918]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="mb-2 grid grid-cols-7 gap-1.5 text-center">
            {WEEKDAY_LABELS.map((day) => (
              <div key={day} className="text-[11px] font-bold text-[#53625F]">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Cells (color + non-color marker for inclusive accessibility) */}
          <div className="grid grid-cols-7 gap-1.5">
            {monthGrid.cells.map((cell, idx) => {
              if (!cell.dateKey || !cell.dayNumber) {
                return <div key={`empty_${idx}`} className="aspect-square" />;
              }

              const isFuture = cell.dateKey > todayKey;
              const summary = evaluateDayAdherence(cell.dateKey, logs[cell.dateKey], goals);
              const isInspected = inspectedDateKey === cell.dateKey;
              const isToday = cell.dateKey === todayKey;

              return (
                <button
                  key={cell.dateKey}
                  type="button"
                  disabled={isFuture}
                  onClick={() => setInspectedDateKey(cell.dateKey!)}
                  aria-label={`${cell.dateKey}: ${summary.caloriesConsumed} kcal (${getLevelBadge(summary.level).label})`}
                  aria-pressed={isInspected}
                  className={`pressable-sm relative flex aspect-square flex-col items-center justify-center rounded-2xl text-[13px] font-bold tabular-nums transition-all ${getHeatmapCellStyle(
                    summary.level,
                    isFuture
                  )} ${
                    isInspected
                      ? 'ring-2 ring-[#101918] ring-offset-2 ring-offset-[#FAF6EE]'
                      : isToday
                        ? 'ring-1 ring-[#013230]/50'
                        : ''
                  }`}
                >
                  <span>{cell.dayNumber}</span>
                  {/* Non-color status cue */}
                  {!isFuture && summary.level === 'optimal' && (
                    <Check className="mt-0.5 h-2.5 w-2.5 opacity-90" strokeWidth={3} aria-hidden="true" />
                  )}
                  {!isFuture && summary.level === 'far_over' && (
                    <span aria-hidden="true" className="text-[10px] leading-none font-black">
                      +
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Heatmap Illumination Legend */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#013230]/8 pt-3.5 text-[11px] font-medium text-[#41514F]">
            <span>Cercanía al objetivo:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#53625F]">Lejos</span>
              <span className="h-3.5 w-3.5 rounded-md bg-[#E8DEC8]" title="Lejos (déficit)" />
              <span className="h-3.5 w-3.5 rounded-md bg-[#99C2BC]" title="Moderado" />
              <span className="h-3.5 w-3.5 rounded-md bg-[#2A6F68]" title="Cercano" />
              <span
                className="flex h-3.5 w-3.5 items-center justify-center rounded-md bg-[#013230] text-[#F3EBDD]"
                title="Objetivo clavado"
              >
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              <span className="font-semibold text-[#013230]">Clavado</span>
              <span
                className="ml-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-md bg-[#D46A43] text-[9px] font-black text-white"
                title="Exceso >25%"
              >
                +
              </span>
              <span className="font-semibold text-[#8B3B1E]">Exceso</span>
            </div>
          </div>
        </RevealSection>

        {/* Interactive Day Inspector Card */}
        <RevealSection
          aria-label="Detalle del día seleccionado"
          offsetY={14}
          delay={0.1}
          duration={0.58}
          className="surface-card rounded-[24px] p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[17px] font-bold text-[#101918]">
                  {inspectedHeader.primary === 'Hoy' || inspectedHeader.primary === 'Ayer'
                    ? `${inspectedHeader.primary} · ${inspectedHeader.secondary}`
                    : inspectedHeader.primary}
                </h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${inspectedBadge.className}`}
                >
                  {inspectedBadge.label}
                </span>
              </div>
              <p className="tabular-nums mt-1 text-[13px] text-[#41514F]">
                {inspectedSummary.entryCount > 0 ? (
                  <>
                    <strong>{inspectedSummary.caloriesConsumed} kcal</strong> de{' '}
                    {inspectedSummary.calorieGoal} kcal (
                    {inspectedSummary.signedDelta >= 0 ? '+' : ''}
                    {inspectedSummary.signedDelta} kcal)
                  </>
                ) : (
                  'No hay comidas registradas en esta fecha.'
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedDate(inspectedDateKey);
                setActiveTab('today');
              }}
              className="pressable-sm flex min-h-[40px] shrink-0 items-center gap-1 rounded-full bg-[#013230] px-3.5 py-2 text-[12px] font-semibold text-[#F3EBDD]"
            >
              Abrir día
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {inspectedSummary.entryCount > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2 text-center">
              <div className="rounded-2xl bg-[#F3EBDD]/85 p-2">
                <div className="text-[11px] font-semibold text-[#41514F]">Precisión</div>
                <div className="tabular-nums text-[15px] font-bold text-[#013230]">
                  {inspectedSummary.score}%
                </div>
              </div>
              <div className="rounded-2xl bg-[var(--color-macro-protein-bg)] p-2">
                <div className="text-[11px] font-semibold text-[var(--color-macro-protein)]">
                  Proteína
                </div>
                <div className="tabular-nums text-[15px] font-bold text-[var(--color-macro-protein)]">
                  {inspectedSummary.macrosConsumed.protein}g
                </div>
              </div>
              <div className="rounded-2xl bg-[var(--color-macro-carbs-bg)] p-2">
                <div className="text-[11px] font-semibold text-[var(--color-macro-carbs)]">
                  Carbos
                </div>
                <div className="tabular-nums text-[15px] font-bold text-[var(--color-macro-carbs)]">
                  {inspectedSummary.macrosConsumed.carbs}g
                </div>
              </div>
              <div className="rounded-2xl bg-[var(--color-macro-fats-bg)] p-2">
                <div className="text-[11px] font-semibold text-[var(--color-macro-fats)]">
                  Grasas
                </div>
                <div className="tabular-nums text-[15px] font-bold text-[var(--color-macro-fats)]">
                  {inspectedSummary.macrosConsumed.fat}g
                </div>
              </div>
            </div>
          )}
        </RevealSection>
      </main>
    </div>
  );
}
