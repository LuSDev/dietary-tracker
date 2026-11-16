import { Check } from 'lucide-react';
import { useState } from 'react';
import { FOOD_CATEGORY_META, FoodCategory, FoodItem } from '../domain/types';
import { useNutritionStore } from '../store/useNutritionStore';
import { BottomSheet } from './BottomSheet';

interface CustomFoodSheetProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (food: FoodItem) => void;
}

export function CustomFoodSheet({ open, onClose, onCreated }: CustomFoodSheetProps) {
  const addCustomFood = useNutritionStore((s) => s.addCustomFood);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('proteins');
  const [calories, setCalories] = useState('150');
  const [protein, setProtein] = useState('20');
  const [carbs, setCarbs] = useState('5');
  const [fat, setFat] = useState('5');
  const [portionGrams, setPortionGrams] = useState('100');
  const [portionLabel, setPortionLabel] = useState('1 porción (100g)');

  const canSave = name.trim().length > 1 && Number(calories) >= 0 && Number(portionGrams) > 0;

  const handleSave = () => {
    if (!canSave) return;
    const g = Math.max(1, Number(portionGrams) || 100);
    const created = addCustomFood({
      name: name.trim(),
      category,
      per100g: {
        calories: Math.max(0, Number(calories) || 0),
        protein: Math.max(0, Number(protein) || 0),
        carbs: Math.max(0, Number(carbs) || 0),
        fat: Math.max(0, Number(fat) || 0)
      },
      defaultPortionGrams: g,
      portionLabel: portionLabel.trim() || `1 porción (${g}g)`
    });
    if (onCreated) onCreated(created);
    onClose();
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Crear alimento propio"
      subtitle="Ingresa los valores nutricionales por cada 100g"
      footer={
        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          className={`pressable flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold ${
            canSave
              ? 'bg-[#013230] text-[#F3EBDD]'
              : 'cursor-not-allowed bg-[#E8DEC8] text-[#53625F]'
          }`}
        >
          <Check className="h-5 w-5" />
          Guardar alimento en catálogo
        </button>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-[13px] font-semibold text-[#101918]">
            Nombre del alimento
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Pan proteico casero"
            className="h-11 w-full rounded-2xl border border-[#013230]/15 bg-[#FFFDF9] px-3.5 text-[16px] text-[#101918] focus:border-[#013230] focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-[13px] font-semibold text-[#101918]">
            Categoría
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as FoodCategory)}
            className="h-11 w-full rounded-2xl border border-[#013230]/15 bg-[#FFFDF9] px-3.5 text-[16px] text-[#101918] focus:border-[#013230] focus:outline-none"
          >
            {(Object.keys(FOOD_CATEGORY_META) as FoodCategory[]).map((cat) => (
              <option key={cat} value={cat}>
                {FOOD_CATEGORY_META[cat].label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[#485856]">
              Calorías (por 100g)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="tabular-nums h-11 w-full rounded-2xl border border-[#013230]/15 bg-[#FFFDF9] px-3.5 text-[16px] font-bold text-[#101918] focus:border-[#013230] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[#2A6F68]">
              Proteína g (por 100g)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="tabular-nums h-11 w-full rounded-2xl border border-[#013230]/15 bg-[#FFFDF9] px-3.5 text-[16px] font-bold text-[#101918] focus:border-[#013230] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[#B54E28]">
              Carbohidratos g (por 100g)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              className="tabular-nums h-11 w-full rounded-2xl border border-[#013230]/15 bg-[#FFFDF9] px-3.5 text-[16px] font-bold text-[#101918] focus:border-[#013230] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[#485856]">
              Grasas g (por 100g)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              className="tabular-nums h-11 w-full rounded-2xl border border-[#013230]/15 bg-[#FFFDF9] px-3.5 text-[16px] font-bold text-[#101918] focus:border-[#013230] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[#485856]">
              Porción habitual (g)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={portionGrams}
              onChange={(e) => setPortionGrams(e.target.value)}
              className="tabular-nums h-11 w-full rounded-2xl border border-[#013230]/15 bg-[#FFFDF9] px-3.5 text-[16px] font-bold text-[#101918] focus:border-[#013230] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[#485856]">
              Etiqueta de porción
            </label>
            <input
              type="text"
              value={portionLabel}
              onChange={(e) => setPortionLabel(e.target.value)}
              placeholder="Ej: 1 rebanada (45g)"
              className="h-11 w-full rounded-2xl border border-[#013230]/15 bg-[#FFFDF9] px-3.5 text-[16px] text-[#101918] focus:border-[#013230] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
