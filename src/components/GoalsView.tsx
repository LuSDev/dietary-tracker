import { Calculator, Check, Minus, Plus, RotateCcw, Sparkles, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  caloriesFromMacroGrams,
  estimateCalorieTarget,
  macrosFromPercentages
} from '../domain/nutritionCalculator';
import { useNutritionStore } from '../store/useNutritionStore';
import { BottomSheet } from './BottomSheet';

const MACRO_PRESETS = [
  { id: 'balanced', label: 'Equilibrado', p: 30, c: 40, f: 30 },
  { id: 'high_protein', label: 'Alto Proteína', p: 35, c: 35, f: 30 },
  { id: 'performance', label: 'Rendimiento', p: 25, c: 50, f: 25 },
  { id: 'low_carb', label: 'Low Carb', p: 35, c: 20, f: 45 }
];

export function GoalsView() {
  const goals = useNutritionStore((s) => s.goals);
  const updateGoals = useNutritionStore((s) => s.updateGoals);
  const resetToDemoSeed = useNutritionStore((s) => s.resetToDemoSeed);
  const clearAllLogs = useNutritionStore((s) => s.clearAllLogs);

  const [savedBanner, setSavedBanner] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [confirmClearLogs, setConfirmClearLogs] = useState(false);

  // TDEE Calculator local state
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(29);
  const [weightKg, setWeightKg] = useState(75);
  const [heightCm, setHeightCm] = useState(176);
  const [activity, setActivity] = useState(1.55);
  const [goalDelta, setGoalDelta] = useState(-300);

  const macroCalories = useMemo(
    () =>
      caloriesFromMacroGrams(
        goals.proteinGrams,
        goals.carbsGrams,
        goals.fatGrams
      ),
    [goals.proteinGrams, goals.carbsGrams, goals.fatGrams]
  );

  const macroPercentages = useMemo(() => {
    const total = Math.max(1, macroCalories);
    const pPct = Math.round(((goals.proteinGrams * 4) / total) * 100);
    const cPct = Math.round(((goals.carbsGrams * 4) / total) * 100);
    const fPct = Math.max(0, 100 - pPct - cPct);
    return { pPct, cPct, fPct };
  }, [goals, macroCalories]);

  const flashSaved = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 1600);
  };

  const handleCalorieStep = (delta: number) => {
    const nextCalories = Math.max(1000, Math.min(6000, goals.calories + delta));
    const updated = macrosFromPercentages(
      nextCalories,
      macroPercentages.pPct,
      macroPercentages.cPct,
      macroPercentages.fPct
    );
    updateGoals(updated);
    flashSaved();
  };

  const handlePresetClick = (p: number, c: number, f: number) => {
    updateGoals(macrosFromPercentages(goals.calories, p, c, f));
    flashSaved();
  };

  const handleMacroGramChange = (
    field: 'proteinGrams' | 'carbsGrams' | 'fatGrams',
    newVal: number
  ) => {
    const safeVal = Math.max(10, Math.min(600, Math.round(newVal)));
    const next = { ...goals, [field]: safeVal };
    next.calories = caloriesFromMacroGrams(
      next.proteinGrams,
      next.carbsGrams,
      next.fatGrams
    );
    updateGoals(next);
  };

  const estimatedTdeeCalories = useMemo(
    () =>
      estimateCalorieTarget({
        sex,
        weightKg,
        heightCm,
        age,
        activityMultiplier: activity,
        goalDelta
      }),
    [sex, weightKg, heightCm, age, activity, goalDelta]
  );

  const applyCalculatorResult = () => {
    const updated = macrosFromPercentages(
      estimatedTdeeCalories,
      macroPercentages.pPct,
      macroPercentages.cPct,
      macroPercentages.fPct
    );
    updateGoals(updated);
    setCalculatorOpen(false);
    flashSaved();
  };

  return (
    <div className="pb-32">
      {/* Translucent Header */}
      <header className="liquid-glass-header sticky top-0 z-30 pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 pt-3.5 pb-3">
          <div>
            <h1 className="heading-tight text-[24px] font-bold text-[#101918]">
              Objetivos
            </h1>
            <p className="text-[13px] font-medium text-[#485856]">
              Meta calórica diaria y distribución nutricional
            </p>
          </div>

          {savedBanner && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#D7E6E3] px-3 py-1 text-[12px] font-bold text-[#013230]">
              <Check className="h-3.5 w-3.5" />
              Actualizado
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-5 px-4 pt-4">
        {/* Daily Calorie Target Card */}
        <section className="surface-card rounded-[28px] p-5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold uppercase tracking-wider text-[#485856]">
              Objetivo Calórico Diario
            </span>
            <button
              type="button"
              onClick={() => setCalculatorOpen(true)}
              className="pressable-sm inline-flex items-center gap-1.5 rounded-full bg-[#D7E6E3] px-3 py-1.5 text-[12px] font-bold text-[#013230]"
            >
              <Calculator className="h-3.5 w-3.5" />
              Asistente TDEE
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => handleCalorieStep(-50)}
              aria-label="Restar 50 kcal"
              className="pressable-sm flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8DEC8] text-[#101918]"
            >
              <Minus className="h-5 w-5" strokeWidth={2.4} />
            </button>

            <div className="text-center">
              <div className="display-number text-[42px] font-bold text-[#013230]">
                {goals.calories}
              </div>
              <div className="text-[13px] font-semibold text-[#485856]">
                kcal por día
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCalorieStep(50)}
              aria-label="Sumar 50 kcal"
              className="pressable-sm flex h-12 w-12 items-center justify-center rounded-2xl bg-[#013230] text-[#F3EBDD]"
            >
              <Plus className="h-5 w-5" strokeWidth={2.4} />
            </button>
          </div>

          {/* Stacked Macro Ratio Bar */}
          <div className="mt-5">
            <div className="mb-1.5 flex justify-between text-[12px] font-semibold">
              <span className="text-[#2A6F68]">Proteína {macroPercentages.pPct}%</span>
              <span className="text-[#B54E28]">Carbos {macroPercentages.cPct}%</span>
              <span className="text-[#013230]">Grasas {macroPercentages.fPct}%</span>
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#E8DEC8]">
              <div
                style={{ width: `${macroPercentages.pPct}%` }}
                className="h-full bg-[#2A6F68] transition-all duration-300"
              />
              <div
                style={{ width: `${macroPercentages.cPct}%` }}
                className="h-full bg-[#D46A43] transition-all duration-300"
              />
              <div
                style={{ width: `${macroPercentages.fPct}%` }}
                className="h-full bg-[#013230] transition-all duration-300"
              />
            </div>
          </div>
        </section>

        {/* Quick Macro Presets */}
        <section className="surface-card rounded-[24px] p-4">
          <h2 className="mb-3 flex items-center gap-1.5 text-[14px] font-bold text-[#101918]">
            <Sparkles className="h-4 w-4 text-[#013230]" />
            Perfiles de distribución rápidos
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {MACRO_PRESETS.map((preset) => {
              const isSelected =
                Math.abs(macroPercentages.pPct - preset.p) <= 2 &&
                Math.abs(macroPercentages.cPct - preset.c) <= 2;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetClick(preset.p, preset.c, preset.f)}
                  className={`pressable-sm rounded-2xl border p-3 text-left transition-colors ${
                    isSelected
                      ? 'border-[#013230] bg-[#013230] text-[#F3EBDD]'
                      : 'border-[#013230]/10 bg-[#FFFDF9] text-[#101918]'
                  }`}
                >
                  <div className="text-[14px] font-bold">{preset.label}</div>
                  <div
                    className={`tabular-nums mt-0.5 text-[12px] ${
                      isSelected ? 'text-[#D7E6E3]' : 'text-[#485856]'
                    }`}
                  >
                    {preset.p}% P · {preset.c}% C · {preset.f}% G
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Individual Gram Controls */}
        <section className="surface-card space-y-4 rounded-[24px] p-4">
          <div>
            <h2 className="text-[15px] font-bold text-[#101918]">
              Ajuste fino por macronutriente
            </h2>
            <p className="text-[12px] text-[#485856]">
              Modificar los gramos recalcula automáticamente las calorías totales.
            </p>
          </div>

          {[
            {
              key: 'proteinGrams' as const,
              label: 'Proteínas',
              kcalPerG: 4,
              pct: macroPercentages.pPct,
              color: '#2A6F68',
              value: goals.proteinGrams
            },
            {
              key: 'carbsGrams' as const,
              label: 'Carbohidratos',
              kcalPerG: 4,
              pct: macroPercentages.cPct,
              color: '#D46A43',
              value: goals.carbsGrams
            },
            {
              key: 'fatGrams' as const,
              label: 'Grasas',
              kcalPerG: 9,
              pct: macroPercentages.fPct,
              color: '#013230',
              value: goals.fatGrams
            }
          ].map((macro) => (
            <div
              key={macro.key}
              className="rounded-2xl border border-[#013230]/8 bg-[#FFFDF9] p-3.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: macro.color }}
                  />
                  <span className="text-[15px] font-bold text-[#101918]">
                    {macro.label}
                  </span>
                  <span className="tabular-nums rounded-full bg-[#F3EBDD] px-2 py-0.5 text-[11px] font-semibold text-[#485856]">
                    {macro.pct}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMacroGramChange(macro.key, macro.value - 5)}
                    className="pressable-sm flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8DEC8] font-bold text-[#101918]"
                    aria-label={`Reducir ${macro.label}`}
                  >
                    −
                  </button>
                  <span className="tabular-nums w-16 text-center text-[17px] font-bold text-[#101918]">
                    {macro.value}g
                  </span>
                  <button
                    type="button"
                    onClick={() => handleMacroGramChange(macro.key, macro.value + 5)}
                    className="pressable-sm flex h-11 w-11 items-center justify-center rounded-xl bg-[#D7E6E3] font-bold text-[#013230]"
                    aria-label={`Aumentar ${macro.label}`}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="tabular-nums mt-1 text-[11px] text-[#53625F]">
                Aporta {macro.value * macro.kcalPerG} kcal ({macro.kcalPerG} kcal/g)
              </div>
            </div>
          ))}
        </section>

        {/* Local Storage Data Management */}
        <section className="surface-card rounded-[24px] p-4">
          <h2 className="text-[14px] font-bold text-[#101918]">
            Gestión de datos locales
          </h2>
          <p className="mt-0.5 text-[12px] text-[#41514F]">
            Todo se guarda offline en tu dispositivo sin necesidad de cuenta.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                resetToDemoSeed();
                setConfirmClearLogs(false);
                flashSaved();
              }}
              className="pressable-sm inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#E8DEC8] px-4 py-2 text-[13px] font-semibold text-[#101918]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Restaurar datos demo
            </button>

            {!confirmClearLogs ? (
              <button
                type="button"
                onClick={() => setConfirmClearLogs(true)}
                className="pressable-sm inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#F5E1D8] px-4 py-2 text-[13px] font-semibold text-[#8B3B1E]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Empezar diario en blanco
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    clearAllLogs();
                    setConfirmClearLogs(false);
                    flashSaved();
                  }}
                  className="pressable-sm inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#B54E28] px-4 py-2 text-[13px] font-bold text-[#FFFDF9]"
                >
                  Confirmar borrado total
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClearLogs(false)}
                  className="pressable-sm inline-flex min-h-[44px] items-center rounded-full bg-[#E8DEC8] px-4 py-2 text-[13px] font-semibold text-[#101918]"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* TDEE Guided Calculator Bottom Sheet */}
      <BottomSheet
        open={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
        title="Calculadora de Objetivo (TDEE)"
        subtitle="Estimación basada en la fórmula Mifflin-St Jeor"
        footer={
          <button
            type="button"
            onClick={applyCalculatorResult}
            className="pressable btn-primary-teal flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#013230] text-[15px] font-semibold text-[#F3EBDD]"
          >
            <Check className="h-5 w-5" />
            Aplicar {estimatedTdeeCalories} kcal/día
          </button>
        }
      >
        <div className="space-y-4">
          <div className="rounded-[22px] bg-[#013230] p-4 text-center text-[#F3EBDD]">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-[#D7E6E3]">
              Objetivo Diario Estimado
            </div>
            <div className="display-number mt-1 text-[36px] font-bold">
              {estimatedTdeeCalories} kcal
            </div>
          </div>

          <div className="grid grid-cols-2 rounded-2xl bg-[#E8DEC8] p-1">
            {([
              { id: 'male', label: 'Hombre' },
              { id: 'female', label: 'Mujer' }
            ] as const).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSex(option.id)}
                className={`pressable-sm rounded-xl py-2 text-[14px] font-semibold ${
                  sex === option.id
                    ? 'bg-[#FAF6EE] text-[#101918] shadow-sm'
                    : 'text-[#485856]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#485856]">
                Edad
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(Math.max(15, Number(e.target.value) || 15))}
                className="tabular-nums h-11 w-full rounded-2xl border border-[#013230]/15 bg-[#FFFDF9] px-3 text-center text-[16px] font-bold"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#485856]">
                Peso (kg)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={weightKg}
                onChange={(e) => setWeightKg(Math.max(35, Number(e.target.value) || 35))}
                className="tabular-nums h-11 w-full rounded-2xl border border-[#013230]/15 bg-[#FFFDF9] px-3 text-center text-[16px] font-bold"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#485856]">
                Altura (cm)
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={heightCm}
                onChange={(e) => setHeightCm(Math.max(120, Number(e.target.value) || 120))}
                className="tabular-nums h-11 w-full rounded-2xl border border-[#013230]/15 bg-[#FFFDF9] px-3 text-center text-[16px] font-bold"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[#485856]">
              Nivel de actividad
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(Number(e.target.value))}
              className="h-11 w-full rounded-2xl border border-[#013230]/15 bg-[#FFFDF9] px-3 text-[16px] font-medium text-[#101918]"
            >
              <option value={1.2}>Sedentario (oficina, poco ejercicio)</option>
              <option value={1.375}>Ligero (1–3 entrenamientos/semana)</option>
              <option value={1.55}>Moderado (3–5 entrenamientos/semana)</option>
              <option value={1.725}>Alto (6–7 entrenamientos/semana)</option>
            </select>
          </div>

          <div>
            <span className="mb-1.5 block text-[12px] font-semibold text-[#485856]">
              Meta principal
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Definir', delta: -350 },
                { label: 'Mantener', delta: 0 },
                { label: 'Volumen', delta: 250 }
              ].map((g) => (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => setGoalDelta(g.delta)}
                  className={`pressable-sm rounded-2xl py-2.5 text-[13px] font-bold ${
                    goalDelta === g.delta
                      ? 'bg-[#013230] text-[#F3EBDD]'
                      : 'bg-[#E8DEC8]/75 text-[#485856]'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
