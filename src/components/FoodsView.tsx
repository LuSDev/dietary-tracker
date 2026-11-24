import { ChefHat, Edit3, Plus, Search, Sparkles, Trash2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { calculateDishNutrition, calculateFoodMacros } from '../domain/nutritionCalculator';
import { CustomDish, FOOD_CATEGORY_META, FoodCategory, FoodItem } from '../domain/types';
import { useNutritionStore } from '../store/useNutritionStore';
import { CustomFoodSheet } from './CustomFoodSheet';
import { DishBuilderSheet } from './DishBuilderSheet';
import { QuickAddSheet } from './QuickAddSheet';
import { RevealSection } from './RevealSection';
import { UndoToast } from './UndoToast';

type FoodsSubTab = 'foods' | 'dishes';

export function FoodsView() {
  const foods = useNutritionStore((s) => s.foods);
  const dishes = useNutritionStore((s) => s.dishes);
  const selectedDate = useNutritionStore((s) => s.selectedDate);
  const deleteDish = useNutritionStore((s) => s.deleteDish);
  const restoreDish = useNutritionStore((s) => s.restoreDish);

  const [subTab, setSubTab] = useState<FoodsSubTab>('foods');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');

  const [dishBuilderOpen, setDishBuilderOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<CustomDish | null>(null);
  const [customFoodOpen, setCustomFoodOpen] = useState(false);

  const [quickLogFood, setQuickLogFood] = useState<FoodItem | null>(null);
  const [quickLogDish, setQuickLogDish] = useState<CustomDish | null>(null);

  const [deletedDishUndo, setDeletedDishUndo] = useState<CustomDish | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  const filteredFoods = useMemo(() => {
    const q = query.trim().toLowerCase();
    return foods.filter((food) => {
      const matchesCat = selectedCategory === 'all' || food.category === selectedCategory;
      const matchesQuery =
        !q ||
        food.name.toLowerCase().includes(q) ||
        FOOD_CATEGORY_META[food.category].label.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [foods, query, selectedCategory]);

  const filteredDishes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dishes;
    return dishes.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q))
    );
  }, [dishes, query]);

  const handleDeleteDish = (dish: CustomDish) => {
    deleteDish(dish.id);
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    setDeletedDishUndo(dish);
    undoTimerRef.current = window.setTimeout(() => {
      setDeletedDishUndo(null);
    }, 4500);
  };

  const handleUndoDeleteDish = () => {
    if (!deletedDishUndo) return;
    restoreDish(deletedDishUndo);
    setDeletedDishUndo(null);
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
  };

  return (
    <div className="pb-32">
      {/* Translucent Sticky Header */}
      <header className="liquid-glass-header sticky top-0 z-30 pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto max-w-lg px-4 pt-3.5 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="heading-tight text-[24px] font-bold text-[#101918]">
                Comidas
              </h1>
              <p className="text-[13px] font-medium text-[#41514F]">
                Catálogo nutricional y tus platos armados
              </p>
            </div>

            {subTab === 'foods' ? (
              <button
                type="button"
                onClick={() => setCustomFoodOpen(true)}
                className="pressable-sm flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#013230] px-4 text-[13px] font-semibold text-[#F3EBDD]"
              >
                <Plus className="h-4 w-4" strokeWidth={2.4} />
                Alimento
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEditingDish(null);
                  setDishBuilderOpen(true);
                }}
                className="pressable-sm flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#013230] px-4 text-[13px] font-semibold text-[#F3EBDD]"
              >
                <Plus className="h-4 w-4" strokeWidth={2.4} />
                Nuevo plato
              </button>
            )}
          </div>

          {/* Segmented Control */}
          <div className="mt-3 grid grid-cols-2 rounded-2xl bg-[#E8DEC8]/85 p-1">
            <button
              type="button"
              onClick={() => setSubTab('foods')}
              className={`pressable-sm min-h-[40px] rounded-xl py-2 text-[14px] font-semibold transition-colors ${
                subTab === 'foods'
                  ? 'bg-[#FAF6EE] text-[#101918] shadow-sm'
                  : 'text-[#41514F]'
              }`}
            >
              Alimentos ({foods.length})
            </button>
            <button
              type="button"
              onClick={() => setSubTab('dishes')}
              className={`pressable-sm flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl py-2 text-[14px] font-semibold transition-colors ${
                subTab === 'dishes'
                  ? 'bg-[#FAF6EE] text-[#101918] shadow-sm'
                  : 'text-[#41514F]'
              }`}
            >
              <ChefHat className="h-4 w-4" />
              Mis Platos ({dishes.length})
            </button>
          </div>

          {/* Search Input (16px) */}
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#53625F]" />
            <input
              type="search"
              enterKeyHint="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                subTab === 'foods'
                  ? 'Buscar entre más de 135 alimentos...'
                  : 'Buscar en tus platos o recetas...'
              }
              className="h-11 w-full rounded-2xl border border-[#013230]/12 bg-[#FFFDF9] pr-4 pl-10 text-[16px] text-[#101918] placeholder:text-[#53625F] focus:border-[#013230] focus:outline-none"
            />
          </div>

          {/* Category Filter Chips for Foods */}
          {subTab === 'foods' && (
            <div className="no-scrollbar mt-2.5 flex gap-1.5 overflow-x-auto pb-0.5">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`pressable-sm min-h-[34px] shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
                  selectedCategory === 'all'
                    ? 'bg-[#013230] text-[#F3EBDD]'
                    : 'bg-[#E8DEC8]/75 text-[#41514F]'
                }`}
              >
                Todos
              </button>
              {(Object.keys(FOOD_CATEGORY_META) as FoodCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`pressable-sm min-h-[34px] shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
                    selectedCategory === cat
                      ? 'bg-[#013230] text-[#F3EBDD]'
                      : 'bg-[#E8DEC8]/75 text-[#41514F]'
                  }`}
                >
                  {FOOD_CATEGORY_META[cat].shortLabel}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-3.5">
        {subTab === 'foods' ? (
          <RevealSection key="foods" offsetY={12} duration={0.54} className="space-y-2.5">
            {filteredFoods.length === 0 ? (
              <div className="surface-card rounded-[24px] p-8 text-center">
                <p className="text-[15px] font-semibold text-[#101918]">
                  Sin resultados para "{query}"
                </p>
                <p className="mt-1 text-[13px] text-[#41514F]">
                  Puedes crear este alimento en segundos con sus valores por 100g.
                </p>
                <button
                  type="button"
                  onClick={() => setCustomFoodOpen(true)}
                  className="pressable mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#013230] px-5 py-2.5 text-[14px] font-semibold text-[#F3EBDD]"
                >
                  <Plus className="h-4 w-4" />
                  Crear alimento personalizado
                </button>
              </div>
            ) : (
              filteredFoods.map((food) => {
                const portion = calculateFoodMacros(food, food.defaultPortionGrams);
                return (
                  <div
                    key={food.id}
                    className="surface-card flex items-center justify-between gap-3 rounded-[22px] p-3.5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[15px] font-bold text-[#101918]">
                          {food.name}
                        </span>
                        {food.isCustom && (
                          <span className="shrink-0 rounded-md bg-[#F5E1D8] px-1.5 py-0.5 text-[11px] font-bold text-[#8B3B1E]">
                            Propio
                          </span>
                        )}
                      </div>
                      <div className="tabular-nums mt-1 text-[12px] font-medium text-[#41514F]">
                        100g: <strong className="text-[#101918]">{food.per100g.calories} kcal</strong> · P{' '}
                        {food.per100g.protein}g · C {food.per100g.carbs}g · G {food.per100g.fat}g
                      </div>
                      <div className="tabular-nums mt-0.5 text-[12px] font-medium text-[#1F5B55]">
                        {food.portionLabel} = {portion.calories} kcal
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setQuickLogFood(food)}
                      aria-label={`Registrar ${food.name} en hoy`}
                      className="pressable-sm flex h-11 shrink-0 items-center gap-1 rounded-full bg-[#D7E6E3]/90 px-3.5 text-[13px] font-bold text-[#013230]"
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.4} />
                      Hoy
                    </button>
                  </div>
                );
              })
            )}
          </RevealSection>
        ) : (
          <RevealSection key="dishes" offsetY={12} duration={0.54} className="space-y-3.5">
            {/* CTA Card to build a new dish */}
            <button
              type="button"
              onClick={() => {
                setEditingDish(null);
                setDishBuilderOpen(true);
              }}
              className="pressable flex min-h-[64px] w-full items-center justify-between gap-3 rounded-[24px] border border-dashed border-[#2A6F68]/45 bg-[#D7E6E3]/55 p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#013230] text-[#F3EBDD]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#013230]">
                    Armar un plato desde ingredientes
                  </div>
                  <div className="text-[12px] font-medium text-[#1F5B55]">
                    Calcula calorías y macros exactos sumando cada alimento
                  </div>
                </div>
              </div>
              <Plus className="h-5 w-5 shrink-0 text-[#013230]" />
            </button>

            {filteredDishes.map((dish) => {
              const computed = calculateDishNutrition(dish, foods);
              return (
                <article
                  key={dish.id}
                  className="surface-card overflow-hidden rounded-[24px] p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-[17px] font-bold text-[#101918]">
                        {dish.name}
                      </h2>
                      {dish.description && (
                        <p className="mt-0.5 text-[13px] text-[#41514F]">
                          {dish.description}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDish(dish);
                          setDishBuilderOpen(true);
                        }}
                        aria-label={`Editar ${dish.name}`}
                        className="pressable-sm flex h-11 w-11 items-center justify-center rounded-full bg-[#E8DEC8]/70 text-[#101918]"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDish(dish)}
                        aria-label={`Eliminar ${dish.name}`}
                        className="pressable-sm flex h-11 w-11 items-center justify-center rounded-full text-[#53625F] hover:bg-[#F5E1D8] hover:text-[#B54E28]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Calculated Macro Pills */}
                  <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                    <div className="rounded-2xl bg-[#013230] px-2 py-2 text-[#F3EBDD]">
                      <div className="text-[11px] opacity-85">1 porción</div>
                      <div className="tabular-nums text-[15px] font-bold">
                        {computed.perServingMacros.calories} kcal
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[var(--color-macro-protein-bg)] px-2 py-2 text-[var(--color-macro-protein)]">
                      <div className="text-[11px] font-semibold">Proteína</div>
                      <div className="tabular-nums text-[15px] font-bold">
                        {computed.perServingMacros.protein}g
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[var(--color-macro-carbs-bg)] px-2 py-2 text-[var(--color-macro-carbs)]">
                      <div className="text-[11px] font-semibold">Carbos</div>
                      <div className="tabular-nums text-[15px] font-bold">
                        {computed.perServingMacros.carbs}g
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[var(--color-macro-fats-bg)] px-2 py-2 text-[var(--color-macro-fats)]">
                      <div className="text-[11px] font-semibold">Grasas</div>
                      <div className="tabular-nums text-[15px] font-bold">
                        {computed.perServingMacros.fat}g
                      </div>
                    </div>
                  </div>

                  {/* Ingredients breakdown */}
                  <div className="mt-3 rounded-2xl bg-[#F3EBDD]/75 px-3.5 py-2.5">
                    <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#41514F]">
                      <span>Ingredientes ({computed.ingredientDetails.length})</span>
                      <span className="tabular-nums">
                        Rinde {dish.servings} {dish.servings === 1 ? 'porción' : 'porciones'} (
                        {computed.totalWeightGrams}g)
                      </span>
                    </div>
                    <ul className="space-y-1 text-[12px] text-[#101918]">
                      {computed.ingredientDetails.map((ing) => (
                        <li key={ing.food.id} className="flex justify-between gap-2">
                          <span className="truncate">{ing.food.name}</span>
                          <span className="tabular-nums shrink-0 text-[#41514F]">
                            {ing.grams}g ({ing.macros.calories} kcal)
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => setQuickLogDish(dish)}
                    className="pressable mt-3 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-full bg-[#D7E6E3]/90 text-[14px] font-bold text-[#013230]"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.4} />
                    Registrar plato en mi día
                  </button>
                </article>
              );
            })}
          </RevealSection>
        )}
      </main>

      <UndoToast
        message={deletedDishUndo ? `Plato eliminado: ${deletedDishUndo.name}` : null}
        onUndo={handleUndoDeleteDish}
        onDismiss={() => setDeletedDishUndo(null)}
      />

      {/* Modals */}
      {dishBuilderOpen && (
        <DishBuilderSheet
          open={dishBuilderOpen}
          onClose={() => {
            setDishBuilderOpen(false);
            setEditingDish(null);
          }}
          editingDish={editingDish}
          onSavedAndLog={(dish) => setQuickLogDish(dish)}
        />
      )}

      {customFoodOpen && (
        <CustomFoodSheet
          open={customFoodOpen}
          onClose={() => setCustomFoodOpen(false)}
          onCreated={(food) => setQuickLogFood(food)}
        />
      )}

      {(quickLogFood || quickLogDish) && (
        <QuickAddSheet
          open={Boolean(quickLogFood || quickLogDish)}
          onClose={() => {
            setQuickLogFood(null);
            setQuickLogDish(null);
          }}
          dateKey={selectedDate}
          initialMealSlot="lunch"
          preselectedFood={quickLogFood}
          preselectedDish={quickLogDish}
        />
      )}
    </div>
  );
}
