import { addDaysToKey, toDateKey } from '../domain/dateUtils';
import { calculateDishNutrition, calculateFoodMacros } from '../domain/nutritionCalculator';
import { CustomDish, DailyLog, FoodItem, MealLogEntry, MealSlot, NutritionGoals } from '../domain/types';

export const DEFAULT_GOALS: NutritionGoals = {
  calories: 2150,
  proteinGrams: 155,
  carbsGrams: 220,
  fatGrams: 72
};

function makeFoodEntry(
  foodMap: Map<string, FoodItem>,
  id: string,
  mealSlot: MealSlot,
  foodId: string,
  grams: number,
  timestamp: string
): MealLogEntry | null {
  const food = foodMap.get(foodId);
  if (!food) return null;
  return {
    id,
    mealSlot,
    sourceType: 'food',
    sourceId: food.id,
    name: food.name,
    grams,
    macros: calculateFoodMacros(food, grams),
    timestamp
  };
}

function makeDishEntry(
  dish: CustomDish,
  foodCatalog: FoodItem[],
  id: string,
  mealSlot: MealSlot,
  servingsCount: number,
  timestamp: string
): MealLogEntry {
  const computed = calculateDishNutrition(dish, foodCatalog);
  const ratio = servingsCount;
  return {
    id,
    mealSlot,
    sourceType: 'dish',
    sourceId: dish.id,
    name: dish.name,
    grams: Math.round(computed.perServingGrams * ratio),
    servings: servingsCount,
    macros: {
      calories: Math.round(computed.perServingMacros.calories * ratio),
      protein: Math.round(computed.perServingMacros.protein * ratio * 10) / 10,
      carbs: Math.round(computed.perServingMacros.carbs * ratio * 10) / 10,
      fat: Math.round(computed.perServingMacros.fat * ratio * 10) / 10
    },
    ingredientSummary: computed.ingredientDetails
      .slice(0, 3)
      .map((i) => i.food.name.split(' (')[0])
      .join(', '),
    timestamp
  };
}

/**
 * Generates realistic daily logs for the past 28 days plus today's morning/lunch
 * so the Progress Heatmap Calendar and Today Dashboard work out-of-the-box.
 */
export function buildInitialSeedLogs(
  foods: FoodItem[],
  dishes: CustomDish[],
  todayKey: string = toDateKey()
): Record<string, DailyLog> {
  const foodMap = new Map(foods.map((f) => [f.id, f]));
  const dishMap = new Map(dishes.map((d) => [d.id, d]));
  const logs: Record<string, DailyLog> = {};

  // Today: Breakfast & Lunch pre-logged so user sees progress & can add snack/dinner
  const todayEntries: MealLogEntry[] = [];
  const oatsDish = dishMap.get('dish_overnight_oats');
  const bowlDish = dishMap.get('dish_bowl_mediterraneo');

  if (oatsDish) {
    todayEntries.push(
      makeDishEntry(oatsDish, foods, 'seed_today_1', 'breakfast', 1, `${todayKey}T08:30:00`)
    );
  }
  const coffee = makeFoodEntry(foodMap, 'seed_today_2', 'breakfast', 'coffee_black', 200, `${todayKey}T08:35:00`);
  if (coffee) todayEntries.push(coffee);

  if (bowlDish) {
    todayEntries.push(
      makeDishEntry(bowlDish, foods, 'seed_today_3', 'lunch', 1, `${todayKey}T13:15:00`)
    );
  }
  const apple = makeFoodEntry(foodMap, 'seed_today_4', 'lunch', 'apple', 160, `${todayKey}T13:45:00`);
  if (apple) todayEntries.push(apple);

  logs[todayKey] = {
    date: todayKey,
    entries: todayEntries
  };

  // Historical pattern for past 28 days (delta ratios relative to 2150 kcal target)
  // Mix of optimal (Deep Teal), close (Sage), moderate, one skipped day, and one over day (Terracotta)
  const dailyProfiles: Array<{ factor: number | null; pFactor: number; cFactor: number; fFactor: number }> = [
    { factor: 0.99, pFactor: 1.02, cFactor: 0.98, fFactor: 0.97 }, // -1d (optimal)
    { factor: 1.03, pFactor: 1.05, cFactor: 1.02, fFactor: 1.02 }, // -2d (optimal)
    { factor: 0.91, pFactor: 0.96, cFactor: 0.88, fFactor: 0.92 }, // -3d (close)
    { factor: 1.01, pFactor: 1.0, cFactor: 1.01, fFactor: 1.02 },  // -4d (optimal)
    { factor: 1.29, pFactor: 0.95, cFactor: 1.38, fFactor: 1.4 },  // -5d (far over -> terracotta)
    { factor: 0.97, pFactor: 1.03, cFactor: 0.95, fFactor: 0.95 }, // -6d (optimal)
    { factor: 0.88, pFactor: 0.92, cFactor: 0.84, fFactor: 0.9 },  // -7d (close)
    { factor: 1.04, pFactor: 1.06, cFactor: 1.05, fFactor: 1.0 },  // -8d (optimal)
    { factor: 0.98, pFactor: 1.01, cFactor: 0.97, fFactor: 0.97 }, // -9d (optimal)
    { factor: 0.81, pFactor: 0.85, cFactor: 0.78, fFactor: 0.82 }, // -10d (moderate)
    { factor: null, pFactor: 0, cFactor: 0, fFactor: 0 },          // -11d (unlogged)
    { factor: 1.02, pFactor: 1.04, cFactor: 1.0, fFactor: 1.02 },  // -12d (optimal)
    { factor: 0.95, pFactor: 0.98, cFactor: 0.94, fFactor: 0.95 }, // -13d (optimal)
    { factor: 1.12, pFactor: 1.05, cFactor: 1.15, fFactor: 1.15 }, // -14d (close)
    { factor: 0.99, pFactor: 1.03, cFactor: 0.98, fFactor: 0.97 }, // -15d (optimal)
    { factor: 0.93, pFactor: 0.95, cFactor: 0.9, fFactor: 0.96 },  // -16d (close)
    { factor: 1.33, pFactor: 0.92, cFactor: 1.45, fFactor: 1.45 }, // -17d (far over)
    { factor: 1.0, pFactor: 1.0, cFactor: 1.0, fFactor: 1.0 },     // -18d (optimal)
    { factor: 0.89, pFactor: 0.94, cFactor: 0.86, fFactor: 0.88 }, // -19d (close)
    { factor: 0.97, pFactor: 1.01, cFactor: 0.95, fFactor: 0.98 }, // -20d (optimal)
    { factor: 0.79, pFactor: 0.84, cFactor: 0.75, fFactor: 0.8 },  // -21d (moderate)
    { factor: 1.03, pFactor: 1.02, cFactor: 1.04, fFactor: 1.02 }, // -22d (optimal)
    { factor: 0.96, pFactor: 0.99, cFactor: 0.95, fFactor: 0.96 }, // -23d (optimal)
    { factor: 1.09, pFactor: 1.02, cFactor: 1.12, fFactor: 1.1 },  // -24d (close)
    { factor: null, pFactor: 0, cFactor: 0, fFactor: 0 },          // -25d (unlogged)
    { factor: 0.98, pFactor: 1.0, cFactor: 0.98, fFactor: 0.96 },  // -26d (optimal)
    { factor: 0.91, pFactor: 0.95, cFactor: 0.88, fFactor: 0.92 }, // -27d (close)
    { factor: 1.02, pFactor: 1.03, cFactor: 1.01, fFactor: 1.02 }  // -28d (optimal)
  ];

  dailyProfiles.forEach((profile, index) => {
    const dateKey = addDaysToKey(todayKey, -(index + 1));
    if (profile.factor === null) return;

    const targetCals = Math.round(DEFAULT_GOALS.calories * profile.factor);
    const bCals = Math.round(targetCals * 0.24);
    const lCals = Math.round(targetCals * 0.36);
    const sCals = Math.round(targetCals * 0.14);
    const dCals = targetCals - bCals - lCals - sCals;

    const pTotal = Math.round(DEFAULT_GOALS.proteinGrams * profile.pFactor);
    const cTotal = Math.round(DEFAULT_GOALS.carbsGrams * profile.cFactor);
    const fTotal = Math.round(DEFAULT_GOALS.fatGrams * profile.fFactor);

    const split = (pct: number) => ({
      protein: Math.round(pTotal * pct),
      carbs: Math.round(cTotal * pct),
      fat: Math.round(fTotal * pct)
    });

    const entries: MealLogEntry[] = [
      {
        id: `hist_${dateKey}_b`,
        mealSlot: 'breakfast',
        sourceType: 'dish',
        sourceId: 'dish_tostadas_palta_huevo',
        name: 'Tostadas Masa Madre, Palta y Huevo',
        grams: 260,
        servings: 1,
        macros: { calories: bCals, ...split(0.24) },
        timestamp: `${dateKey}T08:30:00`
      },
      {
        id: `hist_${dateKey}_l`,
        mealSlot: 'lunch',
        sourceType: 'dish',
        sourceId: 'dish_bowl_mediterraneo',
        name: 'Bowl Mediterráneo de Pollo',
        grams: 460,
        servings: 1,
        macros: { calories: lCals, ...split(0.36) },
        timestamp: `${dateKey}T13:20:00`
      },
      {
        id: `hist_${dateKey}_s`,
        mealSlot: 'snack',
        sourceType: 'food',
        sourceId: 'greek_yogurt_natural',
        name: 'Yogur griego con almendras y fruta',
        grams: 190,
        macros: { calories: sCals, ...split(0.14) },
        timestamp: `${dateKey}T17:10:00`
      },
      {
        id: `hist_${dateKey}_d`,
        mealSlot: 'dinner',
        sourceType: 'dish',
        sourceId: 'dish_salmon_batata',
        name: 'Salmón al Horno con Batata y Brócoli',
        grams: 440,
        servings: 1,
        macros: { calories: dCals, ...split(0.26) },
        timestamp: `${dateKey}T21:00:00`
      }
    ];

    logs[dateKey] = {
      date: dateKey,
      entries
    };
  });

  return logs;
}
