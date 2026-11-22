import { Check, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { calculateDishNutrition, calculateFoodMacros } from '../domain/nutritionCalculator';
import { CustomDish, DishIngredient, FoodItem } from '../domain/types';
import { useNutritionStore } from '../store/useNutritionStore';
import { BottomSheet } from './BottomSheet';

interface DishBuilderSheetProps {
  open: boolean;
  onClose: () => void;
  editingDish?: CustomDish | null;
  onSavedAndLog?: (dish: CustomDish) => void;
}

export function DishBuilderSheet({
  open,
  onClose,
  editingDish = null,
  onSavedAndLog
}: DishBuilderSheetProps) {
  const foods = useNutritionStore((s) => s.foods);
  const saveDish = useNutritionStore((s) => s.saveDish);

  const [name, setName] = useState(editingDish?.name ?? '');
  const [description, setDescription] = useState(editingDish?.description ?? '');
  const [servings, setServings] = useState(editingDish?.servings ?? 1);
  const [ingredients, setIngredients] = useState<DishIngredient[]>(
    editingDish?.ingredients ?? []
  );
  const [ingredientQuery, setIngredientQuery] = useState('');
  const [showIngredientPicker, setShowIngredientPicker] = useState(
    (editingDish?.ingredients.length ?? 0) === 0
  );

  const foodMap = useMemo(() => new Map(foods.map((f) => [f.id, f])), [foods]);

  const liveNutrition = useMemo(
    () => calculateDishNutrition({ ingredients, servings }, foods),
    [ingredients, servings, foods]
  );

  const filteredCandidateFoods = useMemo(() => {
    const q = ingredientQuery.trim().toLowerCase();
    const list = q
      ? foods.filter((f) => f.name.toLowerCase().includes(q))
      : foods.slice(0, 24);
    return list;
  }, [foods, ingredientQuery]);

  const handleAddIngredient = (food: FoodItem) => {
    setIngredients((prev) => {
      const existingIdx = prev.findIndex((i) => i.foodId === food.id);
      if (existingIdx >= 0) {
        return prev.map((item, idx) =>
          idx === existingIdx
            ? { ...item, grams: item.grams + food.defaultPortionGrams }
            : item
        );
      }
      return [...prev, { foodId: food.id, grams: food.defaultPortionGrams }];
    });
    setIngredientQuery('');
    setShowIngredientPicker(false);
  };

  const handleUpdateGrams = (foodId: string, grams: number) => {
    const safeGrams = Math.max(1, Math.min(3000, Math.round(grams)));
    setIngredients((prev) =>
      prev.map((item) => (item.foodId === foodId ? { ...item, grams: safeGrams } : item))
    );
  };

  const handleRemoveIngredient = (foodId: string) => {
    setIngredients((prev) => prev.filter((item) => item.foodId !== foodId));
  };

  const canSave = name.trim().length > 0 && ingredients.length > 0;

  const handleSave = (andLog = false) => {
    if (!canSave) return;
    const saved = saveDish({
      id: editingDish?.id,
      name,
      description,
      servings,
      ingredients
    });
    onClose();
    if (andLog && onSavedAndLog) {
      onSavedAndLog(saved);
    }
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={editingDish ? 'Editar plato' : 'Nuevo plato o receta'}
      subtitle="Los macros se calculan automáticamente según sus ingredientes"
      maxHeightClass="max-h-[92dvh]"
      footer={
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={!canSave}
            onClick={() => handleSave(false)}
            className={`pressable flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold transition-opacity ${
              canSave
                ? 'bg-[#013230] text-[#F3EBDD] shadow-[0_6px_18px_rgba(1,50,48,0.2)]'
                : 'cursor-not-allowed bg-[#E8DEC8] text-[#53625F]'
            }`}
          >
            <Check className="h-5 w-5" />
            Guardar plato
          </button>
          {onSavedAndLog && (
            <button
              type="button"
              disabled={!canSave}
              onClick={() => handleSave(true)}
              className={`pressable flex min-h-[50px] items-center justify-center gap-1.5 rounded-full border px-5 text-[14px] font-semibold ${
                canSave
                  ? 'border-[#013230]/20 bg-[#D7E6E3] text-[#013230]'
                  : 'cursor-not-allowed border-transparent bg-[#E8DEC8]/50 text-[#53625F]'
              }`}
            >
              Guardar y añadir a hoy
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Live Calculated Macros Banner */}
        <div className="rounded-[22px] bg-[#013230] p-4 text-[#F3EBDD]">
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#D7E6E3]">
              Porción ({servings === 1 ? 'plato completo' : `1 de ${servings}`})
            </span>
            <span className="tabular-nums text-[12px] opacity-80">
              {liveNutrition.perServingGrams}g / porción · Total {liveNutrition.totalWeightGrams}g
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-4 gap-2 text-center">
            <div className="rounded-xl bg-[#FAF6EE]/12 px-2 py-2">
              <div className="text-[11px] opacity-80">Calorías</div>
              <div className="tabular-nums text-[18px] font-bold">
                {liveNutrition.perServingMacros.calories}
              </div>
            </div>
            <div className="rounded-xl bg-[var(--color-macro-protein)]/35 px-2 py-2">
              <div className="text-[11px] opacity-90">Proteína</div>
              <div className="tabular-nums text-[18px] font-bold">
                {liveNutrition.perServingMacros.protein}g
              </div>
            </div>
            <div className="rounded-xl bg-[var(--color-macro-carbs)]/30 px-2 py-2">
              <div className="text-[11px] opacity-90">Carbos</div>
              <div className="tabular-nums text-[18px] font-bold">
                {liveNutrition.perServingMacros.carbs}g
              </div>
            </div>
            <div className="rounded-xl bg-[var(--color-macro-fats)]/40 px-2 py-2">
              <div className="text-[11px] opacity-90">Grasas</div>
              <div className="tabular-nums text-[18px] font-bold">
                {liveNutrition.perServingMacros.fat}g
              </div>
            </div>
          </div>
        </div>

        {/* Dish Name & Servings */}
        <div className="space-y-3">
          <div>
            <label
              htmlFor="dish-name-input"
              className="mb-1 block text-[13px] font-semibold text-[#101918]"
            >
              Nombre del plato
            </label>
            <input
              id="dish-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Bowl de pollo y quinoa"
              className="h-11 w-full rounded-2xl border border-[#013230]/15 bg-[#FFFDF9] px-3.5 text-[16px] font-medium text-[#101918] placeholder:text-[#53625F] focus:border-[#013230] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="dish-desc-input"
                className="mb-1 block text-[13px] font-semibold text-[#101918]"
              >
                Nota opcional
              </label>
              <input
                id="dish-desc-input"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Ideal post-entreno"
                className="h-11 w-full rounded-2xl border border-[#013230]/15 bg-[#FFFDF9] px-3.5 text-[16px] text-[#101918] placeholder:text-[#53625F] focus:border-[#013230] focus:outline-none"
              />
            </div>

            <div>
              <span className="mb-1 block text-[13px] font-semibold text-[#101918]">
                Porciones que rinde
              </span>
              <div className="flex h-11 items-center justify-between rounded-2xl border border-[#013230]/15 bg-[#FFFDF9] px-2">
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.max(1, s - 1))}
                  className="pressable-sm flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8DEC8] text-[18px] font-bold text-[#101918]"
                  aria-label="Reducir porciones"
                >
                  −
                </button>
                <span className="tabular-nums text-[15px] font-bold text-[#101918]">
                  {servings} {servings === 1 ? 'porción' : 'porciones'}
                </span>
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.min(12, s + 1))}
                  className="pressable-sm flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8DEC8] text-[18px] font-bold text-[#101918]"
                  aria-label="Aumentar porciones"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients List */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#101918]">
              Ingredientes ({ingredients.length})
            </h3>
            <button
              type="button"
              onClick={() => setShowIngredientPicker((v) => !v)}
              className="pressable-sm inline-flex items-center gap-1 rounded-full bg-[#D7E6E3] px-3 py-1.5 text-[12px] font-bold text-[#013230]"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              {showIngredientPicker ? 'Ocultar buscador' : 'Añadir ingrediente'}
            </button>
          </div>

          {ingredients.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#013230]/20 bg-[#F3EBDD]/60 px-4 py-5 text-center text-[13px] text-[#485856]">
              Busca y añade alimentos individuales abajo para calcular el valor nutricional de tu plato.
            </div>
          ) : (
            <div className="space-y-2">
              {ingredients.map((item) => {
                const food = foodMap.get(item.foodId);
                if (!food) return null;
                const itemMacros = calculateFoodMacros(food, item.grams);
                return (
                  <div
                    key={item.foodId}
                    className="flex items-center justify-between gap-2 rounded-2xl border border-[#013230]/10 bg-[#FFFDF9] p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-semibold text-[#101918]">
                        {food.name}
                      </div>
                      <div className="tabular-nums mt-0.5 text-[12px] text-[#485856]">
                        {itemMacros.calories} kcal · P {itemMacros.protein}g · C {itemMacros.carbs}g · G{' '}
                        {itemMacros.fat}g
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={3000}
                        aria-label={`Gramos de ${food.name}`}
                        value={item.grams}
                        onChange={(e) =>
                          handleUpdateGrams(item.foodId, Number(e.target.value) || 1)
                        }
                        className="tabular-nums h-11 w-16 rounded-xl border border-[#013230]/15 bg-[#F3EBDD]/60 px-2 text-center text-[16px] font-bold text-[#101918] focus:border-[#013230] focus:outline-none"
                      />
                      <span className="text-[12px] font-medium text-[#53625F]">g</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(item.foodId)}
                        aria-label={`Quitar ${food.name}`}
                        className="pressable-sm flex h-11 w-11 items-center justify-center rounded-full text-[#53625F] hover:bg-[#F5E1D8] hover:text-[#B54E28]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Inline Ingredient Picker */}
        {showIngredientPicker && (
          <div className="space-y-2.5 rounded-[22px] border border-[#013230]/12 bg-[#F3EBDD]/75 p-3.5">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#53625F]" />
              <input
                type="search"
                enterKeyHint="search"
                value={ingredientQuery}
                onChange={(e) => setIngredientQuery(e.target.value)}
                placeholder="Buscar ingrediente (ej: arroz, pollo, oliva)..."
                className="h-11 w-full rounded-2xl border border-[#013230]/12 bg-[#FFFDF9] pr-4 pl-10 text-[16px] text-[#101918] placeholder:text-[#53625F] focus:border-[#013230] focus:outline-none"
              />
            </div>

            <div className="max-h-52 space-y-1.5 overflow-y-auto pr-1">
              {filteredCandidateFoods.map((food) => {
                const defaultMacros = calculateFoodMacros(food, food.defaultPortionGrams);
                return (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() => handleAddIngredient(food)}
                    className="pressable-sm flex w-full items-center justify-between gap-2 rounded-xl bg-[#FFFDF9] px-3 py-2.5 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-semibold text-[#101918]">
                        {food.name}
                      </div>
                      <div className="tabular-nums text-[11px] text-[#485856]">
                        +{food.defaultPortionGrams}g ({defaultMacros.calories} kcal · P{' '}
                        {defaultMacros.protein}g)
                      </div>
                    </div>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#013230] text-[#F3EBDD]">
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
