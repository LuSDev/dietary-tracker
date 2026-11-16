export type AppTab = 'today' | 'foods' | 'progress' | 'goals';

export type MealSlot = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export type FoodCategory =
  | 'proteins'
  | 'eggs_dairy'
  | 'grains_legumes'
  | 'fruits'
  | 'vegetables'
  | 'fats_nuts'
  | 'drinks_supplements';

export interface MacroNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  per100g: MacroNutrients;
  defaultPortionGrams: number;
  portionLabel: string;
  isCustom?: boolean;
}

export interface DishIngredient {
  foodId: string;
  grams: number;
}

export interface CustomDish {
  id: string;
  name: string;
  description?: string;
  servings: number;
  ingredients: DishIngredient[];
  createdAt: string;
}

export interface ComputedDishNutrition {
  totalWeightGrams: number;
  totalMacros: MacroNutrients;
  perServingMacros: MacroNutrients;
  perServingGrams: number;
  per100gMacros: MacroNutrients;
  ingredientDetails: Array<{
    food: FoodItem;
    grams: number;
    macros: MacroNutrients;
  }>;
}

export interface MealLogEntry {
  id: string;
  mealSlot: MealSlot;
  sourceType: 'food' | 'dish';
  sourceId: string;
  name: string;
  grams: number;
  servings?: number;
  macros: MacroNutrients;
  ingredientSummary?: string;
  timestamp: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  entries: MealLogEntry[];
}

export interface NutritionGoals {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export type AdherenceLevel = 'empty' | 'optimal' | 'close' | 'moderate' | 'far_under' | 'far_over';

export interface DayAdherenceSummary {
  date: string;
  caloriesConsumed: number;
  calorieGoal: number;
  macrosConsumed: MacroNutrients;
  deviationRatio: number; // |C - G| / G
  signedDelta: number; // C - G
  score: number; // 0 to 100
  level: AdherenceLevel;
  entryCount: number;
}

export const MEAL_SLOT_META: Record<
  MealSlot,
  { label: string; subtitle: string; defaultTimeHint: string }
> = {
  breakfast: {
    label: 'Desayuno',
    subtitle: 'Energía inicial del día',
    defaultTimeHint: '07:00 – 10:30'
  },
  lunch: {
    label: 'Almuerzo',
    subtitle: 'Comida principal de mediodía',
    defaultTimeHint: '12:00 – 15:00'
  },
  snack: {
    label: 'Merienda',
    subtitle: 'Colación de media tarde o pre-entreno',
    defaultTimeHint: '16:00 – 19:00'
  },
  dinner: {
    label: 'Cena',
    subtitle: 'Cierre nutricional del día',
    defaultTimeHint: '20:00 – 22:30'
  }
};

export const FOOD_CATEGORY_META: Record<
  FoodCategory,
  { label: string; shortLabel: string }
> = {
  proteins: { label: 'Carnes, Aves y Pescados', shortLabel: 'Proteínas' },
  eggs_dairy: { label: 'Huevos y Lácteos', shortLabel: 'Lácteos/Huevos' },
  grains_legumes: { label: 'Cereales, Panes y Legumbres', shortLabel: 'Carbos/Granos' },
  fruits: { label: 'Frutas Frescas', shortLabel: 'Frutas' },
  vegetables: { label: 'Verduras y Hortalizas', shortLabel: 'Verduras' },
  fats_nuts: { label: 'Grasas, Aceites y Semillas', shortLabel: 'Grasas/Frutos' },
  drinks_supplements: { label: 'Suplementos y Otros', shortLabel: 'Otros' }
};
