import {
  AdherenceLevel,
  ComputedDishNutrition,
  CustomDish,
  DailyLog,
  DayAdherenceSummary,
  FoodItem,
  MacroNutrients,
  NutritionGoals
} from './types';

export function round1(val: number): number {
  return Math.round(val * 10) / 10;
}

export function roundInt(val: number): number {
  return Math.round(val);
}

/**
 * Calculates macros for a given food item and weight in grams.
 */
export function calculateFoodMacros(food: FoodItem, grams: number): MacroNutrients {
  const safeGrams = Math.max(0, grams);
  const factor = safeGrams / 100;
  return {
    calories: roundInt(food.per100g.calories * factor),
    protein: round1(food.per100g.protein * factor),
    carbs: round1(food.per100g.carbs * factor),
    fat: round1(food.per100g.fat * factor)
  };
}

/**
 * Calculates full nutritional breakdown of a custom dish (recipe)
 * derived strictly from the sum of its individual ingredients.
 */
export function calculateDishNutrition(
  dish: Pick<CustomDish, 'ingredients' | 'servings'>,
  foodCatalog: FoodItem[]
): ComputedDishNutrition {
  const foodMap = new Map<string, FoodItem>(foodCatalog.map((f) => [f.id, f]));

  let totalWeightGrams = 0;
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  const ingredientDetails: ComputedDishNutrition['ingredientDetails'] = [];

  for (const item of dish.ingredients) {
    const food = foodMap.get(item.foodId);
    if (!food || item.grams <= 0) continue;

    const itemMacros = calculateFoodMacros(food, item.grams);
    totalWeightGrams += item.grams;
    totalCalories += itemMacros.calories;
    totalProtein += itemMacros.protein;
    totalCarbs += itemMacros.carbs;
    totalFat += itemMacros.fat;

    ingredientDetails.push({
      food,
      grams: item.grams,
      macros: itemMacros
    });
  }

  const servings = Math.max(1, dish.servings || 1);
  const totalMacros: MacroNutrients = {
    calories: roundInt(totalCalories),
    protein: round1(totalProtein),
    carbs: round1(totalCarbs),
    fat: round1(totalFat)
  };

  const perServingMacros: MacroNutrients = {
    calories: roundInt(totalCalories / servings),
    protein: round1(totalProtein / servings),
    carbs: round1(totalCarbs / servings),
    fat: round1(totalFat / servings)
  };

  const perServingGrams = roundInt(totalWeightGrams / servings);

  const weightFactor = totalWeightGrams > 0 ? 100 / totalWeightGrams : 0;
  const per100gMacros: MacroNutrients = {
    calories: roundInt(totalCalories * weightFactor),
    protein: round1(totalProtein * weightFactor),
    carbs: round1(totalCarbs * weightFactor),
    fat: round1(totalFat * weightFactor)
  };

  return {
    totalWeightGrams: roundInt(totalWeightGrams),
    totalMacros,
    perServingMacros,
    perServingGrams,
    per100gMacros,
    ingredientDetails
  };
}

/**
 * Aggregates all entries in a DailyLog into total macros.
 */
export function sumDailyMacros(log?: DailyLog): MacroNutrients {
  if (!log || !log.entries.length) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  }

  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  for (const entry of log.entries) {
    calories += entry.macros.calories;
    protein += entry.macros.protein;
    carbs += entry.macros.carbs;
    fat += entry.macros.fat;
  }

  return {
    calories: roundInt(calories),
    protein: round1(protein),
    carbs: round1(carbs),
    fat: round1(fat)
  };
}

/**
 * Evaluates how close a day's intake was to the user's calorie goal.
 * Used to illuminate the calendar heatmap in Progress view.
 */
export function evaluateDayAdherence(
  date: string,
  log: DailyLog | undefined,
  goals: NutritionGoals
): DayAdherenceSummary {
  const macrosConsumed = sumDailyMacros(log);
  const caloriesConsumed = macrosConsumed.calories;
  const entryCount = log?.entries.length ?? 0;
  const calorieGoal = Math.max(500, goals.calories);

  if (entryCount === 0 || caloriesConsumed === 0) {
    return {
      date,
      caloriesConsumed: 0,
      calorieGoal,
      macrosConsumed,
      deviationRatio: 1,
      signedDelta: -calorieGoal,
      score: 0,
      level: 'empty',
      entryCount: 0
    };
  }

  const signedDelta = caloriesConsumed - calorieGoal;
  const deviationRatio = Math.abs(signedDelta) / calorieGoal;
  // Score from 0 to 100 where 100 = exact hit, 0 = >= 45% off target
  const rawScore = Math.max(0, 1 - deviationRatio / 0.45) * 100;
  const score = roundInt(rawScore);

  let level: AdherenceLevel = 'optimal';
  if (deviationRatio <= 0.065) {
    level = 'optimal'; // Within ±6.5% -> Deepest Teal illumination
  } else if (deviationRatio <= 0.14) {
    level = 'close'; // Within ±14% -> Rich Sage illumination
  } else if (deviationRatio <= 0.25) {
    level = 'moderate'; // Within ±25% -> Soft Sage illumination
  } else if (signedDelta > 0) {
    level = 'far_over'; // >25% over calorie goal -> Terracotta highlight
  } else {
    level = 'far_under'; // >25% under calorie goal -> Muted tint
  }

  return {
    date,
    caloriesConsumed,
    calorieGoal,
    macrosConsumed,
    deviationRatio,
    signedDelta,
    score,
    level,
    entryCount
  };
}

/**
 * Converts macro percentages (e.g., 30% P, 40% C, 30% F) into grams for a target calorie budget.
 */
export function macrosFromPercentages(
  calories: number,
  proteinPct: number,
  carbsPct: number,
  fatPct: number
): NutritionGoals {
  return {
    calories: roundInt(calories),
    proteinGrams: roundInt((calories * (proteinPct / 100)) / 4),
    carbsGrams: roundInt((calories * (carbsPct / 100)) / 4),
    fatGrams: roundInt((calories * (fatPct / 100)) / 9)
  };
}

/**
 * Calculates calorie total implied by macro grams (4 kcal/g P, 4 kcal/g C, 9 kcal/g F).
 */
export function caloriesFromMacroGrams(proteinGrams: number, carbsGrams: number, fatGrams: number): number {
  return roundInt(proteinGrams * 4 + carbsGrams * 4 + fatGrams * 9);
}

/**
 * Mifflin-St Jeor TDEE Calculator for optional assistant in Goals module.
 */
export function estimateCalorieTarget(params: {
  sex: 'male' | 'female';
  weightKg: number;
  heightCm: number;
  age: number;
  activityMultiplier: number; // 1.2 to 1.9
  goalDelta: number; // e.g., -400 (cut), 0 (maintain), +300 (bulk)
}): number {
  const base =
    10 * params.weightKg +
    6.25 * params.heightCm -
    5 * params.age +
    (params.sex === 'male' ? 5 : -161);
  const tdee = base * params.activityMultiplier;
  return Math.max(1200, Math.round((tdee + params.goalDelta) / 25) * 25);
}
