import {
  ArrowDownAZ,
  ArrowDownWideNarrow,
  ArrowUpAZ,
  ArrowUpNarrowWide,
  Check,
  ChefHat,
  ChevronLeft,
  Menu,
  Plus,
  RotateCcw,
  ShoppingCart,
  Sparkles,
  X
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { calculateDishNutrition, calculateFoodMacros } from '../domain/nutritionCalculator';
import {
  CustomDish,
  FOOD_CATEGORY_META,
  FoodCategory,
  FoodItem,
  MEAL_SLOT_META,
  MealSlot
} from '../domain/types';
import { useNutritionStore } from '../store/useNutritionStore';
import { AnimatedSearchInput, buildInterleavedPlaceholders } from './AnimatedSearchInput';

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
type SortOption = 'default' | 'name_asc' | 'name_desc' | 'calories_asc' | 'calories_desc';

const SORT_OPTIONS: Array<{
  id: SortOption;
  label: string;
  Icon: typeof ArrowDownAZ;
}> = [
  { id: 'name_asc', label: 'Nombre (A → Z)', Icon: ArrowDownAZ },
  { id: 'name_desc', label: 'Nombre (Z → A)', Icon: ArrowUpAZ },
  { id: 'calories_asc', label: 'Calorías (menor a mayor)', Icon: ArrowUpNarrowWide },
  { id: 'calories_desc', label: 'Calorías (mayor a menor)', Icon: ArrowDownWideNarrow }
];

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
  const shouldReduceMotion = useReducedMotion();

  const [mealSlot, setMealSlot] = useState<MealSlot>(initialMealSlot);
  const [mode, setMode] = useState<SourceMode>(preselectedDish ? 'dishes' : 'foods');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(preselectedFood);
  const [selectedDish, setSelectedDish] = useState<CustomDish | null>(preselectedDish);
  const [gramsInput, setGramsInput] = useState<number>(
    preselectedFood?.defaultPortionGrams ?? 100
  );
  const [servingsInput, setServingsInput] = useState<number>(1);
  const [addedFeedback, setAddedFeedback] = useState<string | null>(null);

  const openedWithPreselection = Boolean(preselectedFood || preselectedDish);

  // Lock body scroll while full-screen view is open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Escape key: close drawer -> exit item detail -> close full view
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (drawerOpen) {
        setDrawerOpen(false);
      } else if ((selectedFood || selectedDish) && !openedWithPreselection) {
        setSelectedFood(null);
        setSelectedDish(null);
      } else {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, drawerOpen, selectedFood, selectedDish, openedWithPreselection, onClose]);

  const placeholderCandidates = useMemo(() => {
    if (mode === 'dishes') {
      return dishes.length > 0
        ? dishes.map((d) => `Buscar "${d.name}"...`)
        : ['Buscar en tus platos guardados...'];
    }
    return buildInterleavedPlaceholders(foods, 'Buscar alimentos...');
  }, [mode, foods, dishes]);

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
    const filtered = foods.filter((f) => {
      const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
      const matchesQuery =
        !q ||
        f.name.toLowerCase().includes(q) ||
        FOOD_CATEGORY_META[f.category].label.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });

    if (sortBy === 'default') return filtered;

    return [...filtered].sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name, 'es');
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name, 'es');
      const calA = calculateFoodMacros(a, a.defaultPortionGrams).calories;
      const calB = calculateFoodMacros(b, b.defaultPortionGrams).calories;
      return sortBy === 'calories_asc' ? calA - calB : calB - calA;
    });
  }, [foods, query, selectedCategory, sortBy]);

  const dishWithNutrition = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = dishes
      .filter((d) => {
        if (!q) return true;
        return (
          d.name.toLowerCase().includes(q) ||
          (d.description && d.description.toLowerCase().includes(q))
        );
      })
      .map((dish) => ({
        dish,
        computed: calculateDishNutrition(dish, foods)
      }));

    if (sortBy === 'default') return list;

    return [...list].sort((a, b) => {
      if (sortBy === 'name_asc') return a.dish.name.localeCompare(b.dish.name, 'es');
      if (sortBy === 'name_desc') return b.dish.name.localeCompare(a.dish.name, 'es');
      const calA = a.computed.perServingMacros.calories;
      const calB = b.computed.perServingMacros.calories;
      return sortBy === 'calories_asc' ? calA - calB : calB - calA;
    });
  }, [dishes, foods, query, sortBy]);

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
      setSelectedFood(null);
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
      setSelectedDish(null);
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
    window.setTimeout(() => setAddedFeedback(null), 1800);
  };

  const isInspectingItem = Boolean(selectedFood || selectedDish);
  const hasActiveFilterOrSort = selectedCategory !== 'all' || sortBy !== 'default';
  const activeCount = mode === 'foods' ? filteredFoods.length : dishWithNutrition.length;

  const handleTopBack = () => {
    if (isInspectingItem && !openedWithPreselection) {
      setSelectedFood(null);
      setSelectedDish(null);
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={
            selectedFood
              ? selectedFood.name
              : selectedDish
                ? selectedDish.name
                : 'Añadir a tu día'
          }
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{
            type: 'spring',
            bounce: 0,
            duration: shouldReduceMotion ? 0.14 : 0.32
          }}
          className="fixed inset-0 z-50 flex flex-col bg-[#F3EBDD] text-[#101918]"
        >
          {/* Fixed Top Header */}
          <header className="liquid-glass-header shrink-0 z-20 pt-[env(safe-area-inset-top,0px)]">
            <div className="mx-auto max-w-lg px-4 pt-3 pb-3">
              {/* Top Navigation Row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTopBack}
                    aria-label={
                      isInspectingItem && !openedWithPreselection
                        ? 'Volver al buscador'
                        : 'Cerrar'
                    }
                    className="pressable-sm flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8DEC8]/85 text-[#101918]"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
                  </button>
                  <div className="min-w-0">
                    <h1 className="heading-tight truncate text-[20px] font-bold text-[#101918]">
                      {selectedFood
                        ? selectedFood.name
                        : selectedDish
                          ? selectedDish.name
                          : 'Añadir a tu día'}
                    </h1>
                    <p className="truncate text-[12.5px] font-medium text-[#41514F]">
                      {isInspectingItem
                        ? `Se registrará en ${MEAL_SLOT_META[mealSlot].label}`
                        : 'Elige un alimento individual o uno de tus platos'}
                    </p>
                  </div>
                </div>

                {!isInspectingItem && (
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    aria-label="Abrir filtros y ordenación"
                    className="pressable-sm relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8DEC8]/85 text-[#013230]"
                  >
                    <Menu className="h-5 w-5" strokeWidth={2.2} />
                    {hasActiveFilterOrSort && (
                      <span
                        aria-hidden="true"
                        className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#D46A43] ring-2 ring-[#FAF6EE]"
                      />
                    )}
                  </button>
                )}
              </div>

              {/* Meal Slot Picker Pills */}
              <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-0.5">
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
                          : 'bg-[#E8DEC8]/75 text-[#485856]'
                      }`}
                    >
                      {MEAL_SLOT_META[slot].label}
                    </button>
                  );
                })}
              </div>

              {/* Fixed Segmented Control + Animated Search Bar when browsing */}
              {!isInspectingItem && (
                <div className="mt-3 space-y-2.5">
                  <div className="grid grid-cols-2 rounded-2xl bg-[#E8DEC8]/85 p-1">
                    <button
                      type="button"
                      onClick={() => setMode('foods')}
                      className={`pressable-sm flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl py-2 text-[14px] font-semibold transition-colors ${
                        mode === 'foods'
                          ? 'bg-[#FAF6EE] text-[#101918] shadow-sm'
                          : 'text-[#485856]'
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Alimentos ({foods.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('dishes')}
                      className={`pressable-sm flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl py-2 text-[14px] font-semibold transition-colors ${
                        mode === 'dishes'
                          ? 'bg-[#FAF6EE] text-[#101918] shadow-sm'
                          : 'text-[#485856]'
                      }`}
                    >
                      <ChefHat className="h-4 w-4" />
                      Mis Platos ({dishes.length})
                    </button>
                  </div>

                  <AnimatedSearchInput
                    value={query}
                    onChange={setQuery}
                    placeholders={placeholderCandidates}
                    resetKey={mode}
                    ariaLabel={
                      mode === 'foods'
                        ? 'Buscar alimentos para añadir'
                        : 'Buscar en tus platos guardados'
                    }
                  />
                </div>
              )}
            </div>
          </header>

          {/* Scrollable Body */}
          <div className="sheet-scroll flex-1">
            <div className="mx-auto max-w-lg px-4 pt-3.5 pb-10">
              {/* Transient confirmation banner when quick-adding multiple items */}
              {addedFeedback && (
                <div className="mb-3 flex items-center gap-2 rounded-2xl bg-[#D7E6E3] px-3.5 py-2.5 text-[13px] font-semibold text-[#013230]">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{addedFeedback}</span>
                </div>
              )}

              {/* Active filter/sort summary chips */}
              {!isInspectingItem && hasActiveFilterOrSort && (
                <div className="mb-3 flex flex-wrap items-center gap-1.5">
                  {mode === 'foods' && selectedCategory !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className="pressable-sm inline-flex items-center gap-1 rounded-full bg-[#D7E6E3] px-3 py-1 text-[12px] font-semibold text-[#013230]"
                    >
                      {FOOD_CATEGORY_META[selectedCategory].shortLabel}
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {sortBy !== 'default' && (
                    <button
                      type="button"
                      onClick={() => setSortBy('default')}
                      className="pressable-sm inline-flex items-center gap-1 rounded-full bg-[#E8DEC8] px-3 py-1 text-[12px] font-semibold text-[#101918]"
                    >
                      {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Detailed Food Portion Configuration View */}
              {selectedFood && previewMacros && (
                <div className="space-y-5">
                  <div className="rounded-[22px] border border-[#013230]/10 bg-[#FAF6EE] p-4">
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
                          onChange={(e) =>
                            setGramsInput(Math.max(1, Number(e.target.value) || 0))
                          }
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
                              : 'border border-[#013230]/10 bg-[#FFFDF9] text-[#485856]'
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
                  <div className="rounded-[22px] border border-[#013230]/10 bg-[#FAF6EE] p-4">
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
                          className={`pressable-sm tabular-nums flex-1 rounded-2xl py-3 text-[15px] font-bold transition-colors ${
                            servingsInput === s
                              ? 'bg-[#013230] text-[#F3EBDD]'
                              : 'border border-[#013230]/10 bg-[#FFFDF9] text-[#101918]'
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
                      {calculateDishNutrition(selectedDish, foods).ingredientDetails.map(
                        (item) => (
                          <li key={item.food.id} className="flex justify-between gap-2">
                            <span className="truncate">{item.food.name}</span>
                            <span className="tabular-nums shrink-0 text-[#485856]">
                              {Math.round(
                                (item.grams / selectedDish.servings) * servingsInput
                              )}
                              g ·{' '}
                              {Math.round(
                                (item.macros.calories / selectedDish.servings) *
                                  servingsInput
                              )}{' '}
                              kcal
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Foods / Dishes List */}
              {!isInspectingItem &&
                (mode === 'foods' ? (
                  <div className="space-y-2">
                    {filteredFoods.length === 0 ? (
                      <p className="py-10 text-center text-[14px] text-[#53625F]">
                        No encontramos alimentos con esos filtros.
                      </p>
                    ) : (
                      filteredFoods.map((food) => {
                        const portionMacros = calculateFoodMacros(
                          food,
                          food.defaultPortionGrams
                        );
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
                                {food.portionLabel} ·{' '}
                                <strong className="text-[#013230]">
                                  {portionMacros.calories} kcal
                                </strong>{' '}
                                · P {portionMacros.protein}g
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

                    {dishWithNutrition.length === 0 ? (
                      <p className="py-10 text-center text-[14px] text-[#53625F]">
                        No encontramos platos con "{query}".
                      </p>
                    ) : (
                      dishWithNutrition.map(({ dish, computed }) => (
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
                              · P {computed.perServingMacros.protein}g · C{' '}
                              {computed.perServingMacros.carbs}g
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              logDishToDay({ dateKey, mealSlot, dish, servings: 1 });
                              setAddedFeedback(`+${dish.name} (1 porción)`);
                              window.setTimeout(() => setAddedFeedback(null), 1800);
                            }}
                            aria-label={`Añadir 1 porción de ${dish.name}`}
                            className="pressable-sm flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#013230] text-[#F3EBDD]"
                          >
                            <Plus className="h-5 w-5" strokeWidth={2.4} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Sticky Bottom CTA when configuring an item */}
          {isInspectingItem && previewMacros && (
            <div className="shrink-0 border-t border-[#013230]/8 bg-[#FAF6EE]/95 px-4 pt-3 pb-[max(0.9rem,env(safe-area-inset-bottom,0px))] backdrop-blur-md">
              <div className="mx-auto max-w-lg">
                <button
                  type="button"
                  onClick={handleConfirmAdd}
                  className="pressable btn-primary-teal flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#013230] px-6 text-[16px] font-semibold text-[#F3EBDD] shadow-[0_8px_20px_rgba(1,50,48,0.22)]"
                >
                  <Check className="h-5 w-5" strokeWidth={2.4} />
                  <span>
                    Agregar ·{' '}
                    <span className="tabular-nums">{previewMacros.calories} kcal</span>
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Right Slide-Over Filter & Sort Drawer */}
          <AnimatePresence>
            {drawerOpen && (
              <div
                className="fixed inset-0 z-[60] flex justify-end"
                role="dialog"
                aria-modal="true"
                aria-label="Filtros y ordenación"
              >
                {/* Scrim */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
                  onClick={() => setDrawerOpen(false)}
                  className="fixed inset-0 bg-[#101918]/40 backdrop-blur-[2px]"
                />

                {/* Drawer Panel */}
                <motion.aside
                  initial={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
                  transition={{
                    type: 'spring',
                    bounce: 0,
                    duration: shouldReduceMotion ? 0.12 : 0.34
                  }}
                  className="relative z-10 flex h-full w-[86%] max-w-[340px] flex-col bg-[#FAF6EE] pt-[env(safe-area-inset-top,0px)] shadow-[-16px_0_40px_rgba(1,50,48,0.18)]"
                >
                  <div className="flex items-center justify-between border-b border-[#013230]/8 px-5 py-4">
                    <div>
                      <h2 className="heading-tight text-[18px] font-bold text-[#101918]">
                        Filtros y orden
                      </h2>
                      <p className="text-[12px] text-[#41514F]">
                        {activeCount} {activeCount === 1 ? 'resultado' : 'resultados'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {hasActiveFilterOrSort && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory('all');
                            setSortBy('default');
                          }}
                          className="pressable-sm inline-flex h-9 items-center gap-1 rounded-full bg-[#E8DEC8] px-3 text-[12px] font-semibold text-[#101918]"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Limpiar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDrawerOpen(false)}
                        aria-label="Cerrar menú de filtros"
                        className="pressable-sm flex h-10 w-10 items-center justify-center rounded-full bg-[#E8DEC8]/75 text-[#101918]"
                      >
                        <X className="h-4 w-4" strokeWidth={2.2} />
                      </button>
                    </div>
                  </div>

                  <div className="sheet-scroll flex-1 space-y-6 px-5 py-4">
                    {/* Sort Section */}
                    <section>
                      <h3 className="mb-2.5 text-[12px] font-bold uppercase tracking-wider text-[#41514F]">
                        Ordenar por
                      </h3>
                      <div className="space-y-1.5">
                        {SORT_OPTIONS.map(({ id, label, Icon }) => {
                          const active = sortBy === id;
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setSortBy(active ? 'default' : id)}
                              className={`pressable-sm flex min-h-[44px] w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-left text-[14px] font-semibold transition-colors ${
                                active
                                  ? 'bg-[#013230] text-[#F3EBDD]'
                                  : 'bg-[#FFFDF9] text-[#101918] border border-[#013230]/8'
                              }`}
                            >
                              <span className="flex items-center gap-2.5">
                                <Icon className="h-4 w-4 shrink-0" />
                                {label}
                              </span>
                              {active && <Check className="h-4 w-4 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </section>

                    {/* Category Filter Section */}
                    <section>
                      <div className="mb-2.5 flex items-center justify-between">
                        <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#41514F]">
                          Categoría de alimentos
                        </h3>
                        {mode === 'dishes' && (
                          <span className="text-[11px] font-medium text-[#53625F]">
                            Aplica a Alimentos
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory('all');
                            if (mode === 'dishes') setMode('foods');
                          }}
                          className={`pressable-sm flex min-h-[44px] w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-left text-[14px] font-semibold transition-colors ${
                            selectedCategory === 'all'
                              ? 'bg-[#D7E6E3] text-[#013230]'
                              : 'bg-[#FFFDF9] text-[#101918] border border-[#013230]/8'
                          }`}
                        >
                          <span>Todas las categorías</span>
                          {selectedCategory === 'all' && (
                            <Check className="h-4 w-4 shrink-0" />
                          )}
                        </button>

                        {(Object.keys(FOOD_CATEGORY_META) as FoodCategory[]).map((cat) => {
                          const active = selectedCategory === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setSelectedCategory(cat);
                                if (mode === 'dishes') setMode('foods');
                              }}
                              className={`pressable-sm flex min-h-[44px] w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-left text-[14px] font-semibold transition-colors ${
                                active
                                  ? 'bg-[#D7E6E3] text-[#013230]'
                                  : 'bg-[#FFFDF9] text-[#101918] border border-[#013230]/8'
                              }`}
                            >
                              <span>{FOOD_CATEGORY_META[cat].label}</span>
                              {active && <Check className="h-4 w-4 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  </div>

                  <div className="border-t border-[#013230]/8 px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
                    <button
                      type="button"
                      onClick={() => setDrawerOpen(false)}
                      className="pressable btn-primary-teal flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#013230] px-5 text-[15px] font-semibold text-[#F3EBDD]"
                    >
                      Ver {activeCount} {activeCount === 1 ? 'resultado' : 'resultados'}
                    </button>
                  </div>
                </motion.aside>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
