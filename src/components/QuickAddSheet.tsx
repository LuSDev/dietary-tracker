import { Check, ChefHat, ChevronLeft, Plus, Search, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { calculateDishNutrition, calculateFoodMacros } from '../domain/nutritionCalculator';
import {
  CustomDish,
  FOOD_CATEGORY_META,
  FoodItem,
  MEAL_SLOT_META,
  MealSlot
} from '../domain/types';
import { useNutritionStore } from '../store/useNutritionStore';
import { BottomSheet } from './BottomSheet';

interface QuickAddSheetProps {
  open: boolean;
  onClose: () => void;
  dateKey: string;
  initialMealSlot: MealSlot;
  preselectedFood?: FoodItem | null;
  preselectedDish?: CustomDish | null;
  onOpenDishBuilder?: () => void;
}

type SourceMode = 'foods' | 'dishes';

export function QuickAddSheet({
  open,
  onClose,
  dateKey,
  initialMealSlot,
  preselectedFood = null,
  preselectedDish = null,
  onOpenDishBuilder
}: QuickAddSheetProps) {
  const foods = useNutritionStore((s) => s.foods);
  const dishes = useNutritionStore((s) => s.dishes);
  const logFoodToDay = useNutritionStore((s) => s.logFoodToDay);
  const logDishToDay = useNutritionStore((s) => s.logDishToDay);

  const [mealSlot, setMealSlot] = useState<MealSlot>(initialMealSlot);
  const [mode, setMode] = useState<SourceMode>(preselectedDish ? 'dishes' : 'foods');
  const [query, setQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(preselectedFood);
  const [selectedDish, setSelectedDish] = useState<CustomDish | null>(preselectedDish);
  const [gramsInput, setGramsInput] = useState<number>(
    preselectedFood?.defaultPortionGrams ?? 100
  );
  const [servingsInput, setServingsInput] = useState<number>(1);
  const [addedFeedback, setAddedFeedback] = useState<string | null>(null);

  // Reset transient selection whenever sheet opens with new props
  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setSelectedDish(null);
    setGramsInput(food.defaultPortionGrams || 100);
  };

  const handleSelectDish = (dish: CustomDish) => {
    setSelectedDish(dish);
    setSelectedFood(null);
    setServingsInput(1);
  };

  const filteredFoods = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return foods.slice(0, 35);
    return foods.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        FOOD_CATEGORY_META[f.category].label.toLowerCase().includes(q)
    );
  }, [foods, query]);

  const filteredDishes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dishes;
    return dishes.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q))
    );
  }, [dishes, query]);

  const previewMacros = useMemo(() => {
    if (selectedFood) {
      return calculateFoodMacros(selectedFood, gramsInput);
    }
    if (selectedDish) {
      const computed = calculateDishNutrition(selectedDish, foods);
      return {
        calories: Math.round(computed.perServingMacros.calories * servingsInput),
        protein: Math.round(computed.perServingMacros.protein * servingsInput * 10) / 10,
        carbs: Math.round(computed.perServingMacros.carbs * servingsInput * 10) / 10,
        fat: Math.round(computed.perServingMacros.fat * servingsInput * 10) / 10,
        grams: Math.round(computed.perServingGrams * servingsInput)
      };
    }
    return null;
  }, [selectedFood, selectedDish, gramsInput, servingsInput, foods]);

  const handleConfirmAdd = () => {
    if (selectedFood) {
      logFoodToDay({
        dateKey,
        mealSlot,
        food: selectedFood,
        grams: gramsInput
      });
      setAddedFeedback(`${selectedFood.name} agregado`);
      setSelectedFood(null);
      setTimeout(() => setAddedFeedback(null), 1800);
      onClose();
      return;
    }

    if (selectedDish) {
      logDishToDay({
        dateKey,
        mealSlot,
        dish: selectedDish,
        servings: servingsInput
      });
      setAddedFeedback(`${selectedDish.name} agregado`);
      setSelectedDish(null);
      setTimeout(() => setAddedFeedback(null), 1800);
      onClose();
    }
  };

  const handleQuickLogFood = (food: FoodItem) => {
    logFoodToDay({
      dateKey,
      mealSlot,
      food,
      grams: food.defaultPortionGrams || 100
    });
    setAddedFeedback(`+${food.name} (${food.defaultPortionGrams}g)`);
    setTimeout(() => setAddedFeedback(null), 1800);
  };

  const isInspectingItem = Boolean(selectedFood || selectedDish);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={
        selectedFood
          ? selectedFood.name
          : selectedDish
            ? selectedDish.name
            : 'Añadir a tu día'
      }
      subtitle={
        isInspectingItem
          ? `Se registrará en ${MEAL_SLOT_META[mealSlot].label}`
          : 'Elige un alimento individual o uno de tus platos'
      }
      headerRight={
        isInspectingItem ? (
          <button
            type="button"
            onClick={() => {
              setSelectedFood(null);
              setSelectedDish(null);
            }}
            className="pressable-sm flex h-11 items-center gap-1 rounded-full bg-[#E8DEC8] px-3.5 text-[13px] font-semibold text-[#101918]"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver
          </button>
        ) : undefined
      }
      footer={
        isInspectingItem && previewMacros ? (
          <button
            type="button"
            onClick={handleConfirmAdd}
            className="pressable btn-primary-teal flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#013230] px-6 text-[16px] font-semibold text-[#F3EBDD] shadow-[0_8px_20px_rgba(1,50,48,0.22)]"
          >
            <Check className="h-5 w-5" strokeWidth={2.4} />
            <span>
              Agregar · <span className="tabular-nums">{previewMacros.calories} kcal</span>
            </span>
          </button>
        ) : undefined
      }
    >
      {/* Meal Slot Picker Pills */}
      <div className="mb-4 flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {(Object.keys(MEAL_SLOT_META) as MealSlot[]).map((slot) => {
          const active = mealSlot === slot;
          return (
            <button
              key={slot}
              type="button"
              onClick={() => setMealSlot(slot)}
              className={`pressable-sm shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                active
                  ? 'bg-[#013230] text-[#F3EBDD]'
                  : 'bg-[#E8DEC8]/70 text-[#485856]'
              }`}
            >
              {MEAL_SLOT_META[slot].label}
            </button>
          );
        })}
      </div>

      {/* Transient confirmation banner when quick-adding multiple items */}
      {addedFeedback && (
        <div className="mb-3 flex items-center gap-2 rounded-2xl bg-[#D7E6E3] px-3.5 py-2.5 text-[13px] font-semibold text-[#013230]">
          <Check className="h-4 w-4 shrink-0" />
          <span>{addedFeedback}</span>
        </div>
      )}

      {/* Detailed Portion Configuration View */}
      {selectedFood && previewMacros && (
        <div className="space-y-5">
          <div className="rounded-[22px] border border-[#013230]/10 bg-[#F3EBDD]/70 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] font-semibold text-[#485856]">
                Cantidad (gramos / ml)
              </span>
              <span className="text-[12px] text-[#53625F]">
                Ref: {selectedFood.portionLabel}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGramsInput((g) => Math.max(5, g - 10))}
                className="pressable-sm flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8DEC8] text-[20px] font-bold text-[#101918]"
                aria-label="Restar 10 gramos"
              >
                −
              </button>
              <div className="relative flex-1">
                <input
                  type="number"
                  inputMode="decimal"
                  min={1}
                  max={2500}
                  value={gramsInput}
                  onChange={(e) => setGramsInput(Math.max(1, Number(e.target.value) || 0))}
                  className="tabular-nums h-12 w-full rounded-2xl border border-[#013230]/15 bg-[#FFFDF9] px-4 text-center text-[20px] font-bold text-[#101918] focus:border-[#013230] focus:outline-none"
                />
                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[14px] font-medium text-[#53625F]">
                  g
                </span>
              </div>
              <button
                type="button"
                onClick={() => setGramsInput((g) => Math.min(2500, g + 10))}
                className="pressable-sm flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8DEC8] text-[20px] font-bold text-[#101918]"
                aria-label="Sumar 10 gramos"
              >
                +
              </button>
            </div>

            {/* Quick preset grams */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { label: 'Porción', val: selectedFood.defaultPortionGrams },
                { label: '50g', val: 50 },
                { label: '100g', val: 100 },
                { label: '150g', val: 150 },
                { label: '200g', val: 200 }
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setGramsInput(preset.val)}
                  className={`pressable-sm rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                    gramsInput === preset.val
                      ? 'bg-[#2A6F68] text-[#FAF6EE]'
                      : 'bg-[#FAF6EE] text-[#485856] border border-[#013230]/10'
                  }`}
                >
                  {preset.label} ({preset.val}g)
                </button>
              ))}
            </div>
          </div>

          {/* Live Macros Breakdown */}
          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-2xl bg-[#013230] p-3 text-center text-[#F3EBDD]">
              <div className="text-[11px] font-medium opacity-80">Calorías</div>
              <div className="tabular-nums mt-0.5 text-[18px] font-bold">
                {previewMacros.calories}
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--color-macro-protein-bg)] p-3 text-center text-[var(--color-macro-protein)]">
              <div className="text-[11px] font-semibold">Proteína</div>
              <div className="tabular-nums mt-0.5 text-[18px] font-bold">
                {previewMacros.protein}g
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--color-macro-carbs-bg)] p-3 text-center text-[var(--color-macro-carbs)]">
              <div className="text-[11px] font-semibold">Carbos</div>
              <div className="tabular-nums mt-0.5 text-[18px] font-bold">
                {previewMacros.carbs}g
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--color-macro-fats-bg)] p-3 text-center text-[var(--color-macro-fats)]">
              <div className="text-[11px] font-semibold">Grasas</div>
              <div className="tabular-nums mt-0.5 text-[18px] font-bold">
                {previewMacros.fat}g
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Dish Configuration View */}
      {selectedDish && previewMacros && (
        <div className="space-y-4">
          <div className="rounded-[22px] border border-[#013230]/10 bg-[#F3EBDD]/70 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] font-semibold text-[#485856]">
                Porciones de este plato
              </span>
              <span className="tabular-nums text-[12px] text-[#53625F]">
                ~{'grams' in previewMacros ? previewMacros.grams : 0}g totales
              </span>
            </div>

            <div className="mt-3 flex gap-2">
              {[0.5, 1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setServingsInput(s)}
                  className={`pressable-sm flex-1 rounded-2xl py-3 text-[15px] font-bold tabular-nums transition-colors ${
                    servingsInput === s
                      ? 'bg-[#013230] text-[#F3EBDD]'
                      : 'bg-[#FAF6EE] text-[#101918] border border-[#013230]/10'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-2xl bg-[#013230] p-3 text-center text-[#F3EBDD]">
              <div className="text-[11px] font-medium opacity-80">Calorías</div>
              <div className="tabular-nums mt-0.5 text-[18px] font-bold">
                {previewMacros.calories}
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--color-macro-protein-bg)] p-3 text-center text-[var(--color-macro-protein)]">
              <div className="text-[11px] font-semibold">Proteína</div>
              <div className="tabular-nums mt-0.5 text-[18px] font-bold">
                {previewMacros.protein}g
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--color-macro-carbs-bg)] p-3 text-center text-[var(--color-macro-carbs)]">
              <div className="text-[11px] font-semibold">Carbos</div>
              <div className="tabular-nums mt-0.5 text-[18px] font-bold">
                {previewMacros.carbs}g
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--color-macro-fats-bg)] p-3 text-center text-[var(--color-macro-fats)]">
              <div className="text-[11px] font-semibold">Grasas</div>
              <div className="tabular-nums mt-0.5 text-[18px] font-bold">
                {previewMacros.fat}g
              </div>
            </div>
          </div>

          {/* Ingredient breakdown preview */}
          <div className="rounded-2xl border border-[#013230]/10 bg-[#FAF6EE] p-3.5">
            <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[#485856]">
              Ingredientes incluidos (cálculo automático)
            </div>
            <ul className="space-y-1.5 text-[13px] text-[#101918]">
              {calculateDishNutrition(selectedDish, foods).ingredientDetails.map((item) => (
                <li key={item.food.id} className="flex justify-between gap-2">
                  <span className="truncate">{item.food.name}</span>
                  <span className="tabular-nums shrink-0 text-[#485856]">
                    {Math.round((item.grams / selectedDish.servings) * servingsInput)}g ·{' '}
                    {Math.round((item.macros.calories / selectedDish.servings) * servingsInput)} kcal
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Search & List View */}
      {!isInspectingItem && (
        <div className="space-y-3.5">
          {/* Segmented Control */}
          <div className="grid grid-cols-2 rounded-2xl bg-[#E8DEC8]/80 p-1">
            <button
              type="button"
              onClick={() => setMode('foods')}
              className={`pressable-sm rounded-xl py-2 text-[14px] font-semibold transition-colors ${
                mode === 'foods'
                  ? 'bg-[#FAF6EE] text-[#101918] shadow-sm'
                  : 'text-[#485856]'
              }`}
            >
              Alimentos ({foods.length})
            </button>
            <button
              type="button"
              onClick={() => setMode('dishes')}
              className={`pressable-sm flex items-center justify-center gap-1.5 rounded-xl py-2 text-[14px] font-semibold transition-colors ${
                mode === 'dishes'
                  ? 'bg-[#FAF6EE] text-[#101918] shadow-sm'
                  : 'text-[#485856]'
              }`}
            >
              <ChefHat className="h-4 w-4" />
              Mis Platos ({dishes.length})
            </button>
          </div>

          {/* Search Bar (16px font to prevent iOS Safari zoom) */}
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#53625F]" />
            <input
              type="search"
              enterKeyHint="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                mode === 'foods'
                  ? 'Buscar pollo, avena, huevo, palta...'
                  : 'Buscar en tus platos guardados...'
              }
              className="h-11 w-full rounded-2xl border border-[#013230]/12 bg-[#FFFDF9] pr-4 pl-10 text-[16px] text-[#101918] placeholder:text-[#53625F] focus:border-[#013230] focus:outline-none"
            />
          </div>

          {mode === 'foods' ? (
            <div className="space-y-2">
              {filteredFoods.length === 0 ? (
                <p className="py-8 text-center text-[14px] text-[#53625F]">
                  No encontramos alimentos con "{query}".
                </p>
              ) : (
                filteredFoods.map((food) => {
                  const portionMacros = calculateFoodMacros(food, food.defaultPortionGrams);
                  return (
                    <div
                      key={food.id}
                      className="flex items-center justify-between gap-2 rounded-2xl border border-[#013230]/8 bg-[#FFFDF9] p-3"
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectFood(food)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="truncate text-[15px] font-semibold text-[#101918]">
                          {food.name}
                        </div>
                        <div className="tabular-nums mt-0.5 text-[12px] text-[#485856]">
                          {food.portionLabel} · <strong className="text-[#013230]">{portionMacros.calories} kcal</strong> · P {portionMacros.protein}g
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickLogFood(food)}
                        aria-label={`Añadir ${food.portionLabel} de ${food.name}`}
                        className="pressable-sm flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#013230] text-[#F3EBDD]"
                      >
                        <Plus className="h-5 w-5" strokeWidth={2.4} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {onOpenDishBuilder && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDishBuilder();
                  }}
                  className="pressable flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#2A6F68]/40 bg-[#D7E6E3]/45 py-3 text-[14px] font-semibold text-[#013230]"
                >
                  <Sparkles className="h-4 w-4" />
                  Crear nuevo plato desde ingredientes
                </button>
              )}

              {filteredDishes.map((dish) => {
                const computed = calculateDishNutrition(dish, foods);
                return (
                  <div
                    key={dish.id}
                    className="flex items-center justify-between gap-2 rounded-2xl border border-[#013230]/8 bg-[#FFFDF9] p-3.5"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectDish(dish)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="truncate text-[15px] font-semibold text-[#101918]">
                        {dish.name}
                      </div>
                      <div className="tabular-nums mt-0.5 text-[12px] text-[#485856]">
                        1 porción ({computed.perServingGrams}g) ·{' '}
                        <strong className="text-[#013230]">
                          {computed.perServingMacros.calories} kcal
                        </strong>{' '}
                        · P {computed.perServingMacros.protein}g · C {computed.perServingMacros.carbs}g
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        logDishToDay({ dateKey, mealSlot, dish, servings: 1 });
                        setAddedFeedback(`+${dish.name} (1 porción)`);
                        setTimeout(() => setAddedFeedback(null), 1800);
                      }}
                      aria-label={`Añadir 1 porción de ${dish.name}`}
                      className="pressable-sm flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#013230] text-[#F3EBDD]"
                    >
                      <Plus className="h-5 w-5" strokeWidth={2.4} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
