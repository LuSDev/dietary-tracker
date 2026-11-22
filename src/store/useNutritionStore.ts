import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_CUSTOM_DISHES, INITIAL_FOOD_DATASET } from '../data/foodDataset';
import { buildInitialSeedLogs, DEFAULT_GOALS } from '../data/seedHistory';
import { toDateKey } from '../domain/dateUtils';
import { calculateDishNutrition, calculateFoodMacros } from '../domain/nutritionCalculator';
import {
  AppTab,
  CustomDish,
  DailyLog,
  DishIngredient,
  FoodItem,
  MealLogEntry,
  MealSlot,
  NutritionGoals
} from '../domain/types';

interface NutritionState {
  activeTab: AppTab;
  selectedDate: string;
  goals: NutritionGoals;
  foods: FoodItem[];
  dishes: CustomDish[];
  logs: Record<string, DailyLog>;

  setActiveTab: (tab: AppTab) => void;
  setSelectedDate: (dateKey: string) => void;
  updateGoals: (goals: NutritionGoals) => void;

  // Daily meal log actions
  logFoodToDay: (params: {
    dateKey: string;
    mealSlot: MealSlot;
    food: FoodItem;
    grams: number;
  }) => void;
  logDishToDay: (params: {
    dateKey: string;
    mealSlot: MealSlot;
    dish: CustomDish;
    servings: number;
  }) => void;
  updateLogEntryAmount: (dateKey: string, entryId: string, newGramsOrServings: number) => void;
  removeLogEntry: (dateKey: string, entryId: string) => void;
  restoreLogEntry: (dateKey: string, entry: MealLogEntry) => void;

  // Catalog & Custom Foods
  addCustomFood: (food: Omit<FoodItem, 'id' | 'isCustom'>) => FoodItem;

  // Custom Dishes (Platos / Recetas)
  saveDish: (dish: {
    id?: string;
    name: string;
    description?: string;
    servings: number;
    ingredients: DishIngredient[];
  }) => CustomDish;
  deleteDish: (dishId: string) => void;
  restoreDish: (dish: CustomDish) => void;

  // Data utilities
  resetToDemoSeed: () => void;
  clearAllLogs: () => void;
}

const generateId = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      activeTab: 'today',
      selectedDate: toDateKey(),
      goals: DEFAULT_GOALS,
      foods: INITIAL_FOOD_DATASET,
      dishes: INITIAL_CUSTOM_DISHES,
      logs: buildInitialSeedLogs(INITIAL_FOOD_DATASET, INITIAL_CUSTOM_DISHES),

      setActiveTab: (activeTab) => set({ activeTab }),

      setSelectedDate: (selectedDate) => set({ selectedDate }),

      updateGoals: (goals) => set({ goals }),

      logFoodToDay: ({ dateKey, mealSlot, food, grams }) => {
        const safeGrams = Math.max(1, Math.round(grams));
        const macros = calculateFoodMacros(food, safeGrams);
        const entry: MealLogEntry = {
          id: generateId('entry'),
          mealSlot,
          sourceType: 'food',
          sourceId: food.id,
          name: food.name,
          grams: safeGrams,
          macros,
          timestamp: new Date().toISOString()
        };

        set((state) => {
          const existing = state.logs[dateKey] ?? { date: dateKey, entries: [] };
          return {
            logs: {
              ...state.logs,
              [dateKey]: {
                ...existing,
                entries: [...existing.entries, entry]
              }
            }
          };
        });
      },

      logDishToDay: ({ dateKey, mealSlot, dish, servings }) => {
        const safeServings = Math.max(0.25, Math.round(servings * 4) / 4);
        const computed = calculateDishNutrition(dish, get().foods);
        const entry: MealLogEntry = {
          id: generateId('entry'),
          mealSlot,
          sourceType: 'dish',
          sourceId: dish.id,
          name: dish.name,
          grams: Math.max(1, Math.round(computed.perServingGrams * safeServings)),
          servings: safeServings,
          macros: {
            calories: Math.round(computed.perServingMacros.calories * safeServings),
            protein: Math.round(computed.perServingMacros.protein * safeServings * 10) / 10,
            carbs: Math.round(computed.perServingMacros.carbs * safeServings * 10) / 10,
            fat: Math.round(computed.perServingMacros.fat * safeServings * 10) / 10
          },
          ingredientSummary: computed.ingredientDetails
            .slice(0, 3)
            .map((i) => i.food.name.split(' (')[0])
            .join(', '),
          timestamp: new Date().toISOString()
        };

        set((state) => {
          const existing = state.logs[dateKey] ?? { date: dateKey, entries: [] };
          return {
            logs: {
              ...state.logs,
              [dateKey]: {
                ...existing,
                entries: [...existing.entries, entry]
              }
            }
          };
        });
      },

      updateLogEntryAmount: (dateKey, entryId, newValue) => {
        const state = get();
        const dayLog = state.logs[dateKey];
        if (!dayLog) return;

        const updatedEntries = dayLog.entries.map((entry) => {
          if (entry.id !== entryId) return entry;

          if (entry.sourceType === 'food') {
            const food = state.foods.find((f) => f.id === entry.sourceId);
            const grams = Math.max(1, Math.round(newValue));
            if (food) {
              return {
                ...entry,
                grams,
                macros: calculateFoodMacros(food, grams)
              };
            }
            // Fallback scaling if historical or deleted food
            const factor = entry.grams > 0 ? grams / entry.grams : 1;
            return {
              ...entry,
              grams,
              macros: {
                calories: Math.round(entry.macros.calories * factor),
                protein: Math.round(entry.macros.protein * factor * 10) / 10,
                carbs: Math.round(entry.macros.carbs * factor * 10) / 10,
                fat: Math.round(entry.macros.fat * factor * 10) / 10
              }
            };
          } else {
            // Dish: newValue is servings
            const servings = Math.max(0.25, Math.round(newValue * 4) / 4);
            const dish = state.dishes.find((d) => d.id === entry.sourceId);
            if (dish) {
              const computed = calculateDishNutrition(dish, state.foods);
              return {
                ...entry,
                servings,
                grams: Math.max(1, Math.round(computed.perServingGrams * servings)),
                macros: {
                  calories: Math.round(computed.perServingMacros.calories * servings),
                  protein: Math.round(computed.perServingMacros.protein * servings * 10) / 10,
                  carbs: Math.round(computed.perServingMacros.carbs * servings * 10) / 10,
                  fat: Math.round(computed.perServingMacros.fat * servings * 10) / 10
                }
              };
            }
            const prevServings = entry.servings || 1;
            const factor = servings / prevServings;
            return {
              ...entry,
              servings,
              grams: Math.max(1, Math.round(entry.grams * factor)),
              macros: {
                calories: Math.round(entry.macros.calories * factor),
                protein: Math.round(entry.macros.protein * factor * 10) / 10,
                carbs: Math.round(entry.macros.carbs * factor * 10) / 10,
                fat: Math.round(entry.macros.fat * factor * 10) / 10
              }
            };
          }
        });

        set({
          logs: {
            ...state.logs,
            [dateKey]: {
              ...dayLog,
              entries: updatedEntries
            }
          }
        });
      },

      removeLogEntry: (dateKey, entryId) => {
        set((state) => {
          const existing = state.logs[dateKey];
          if (!existing) return state;
          return {
            logs: {
              ...state.logs,
              [dateKey]: {
                ...existing,
                entries: existing.entries.filter((e) => e.id !== entryId)
              }
            }
          };
        });
      },

      restoreLogEntry: (dateKey, entry) => {
        set((state) => {
          const existing = state.logs[dateKey] ?? { date: dateKey, entries: [] };
          if (existing.entries.some((e) => e.id === entry.id)) return state;
          return {
            logs: {
              ...state.logs,
              [dateKey]: {
                ...existing,
                entries: [...existing.entries, entry]
              }
            }
          };
        });
      },

      addCustomFood: (foodData) => {
        const newFood: FoodItem = {
          ...foodData,
          id: generateId('food_custom'),
          isCustom: true
        };
        set((state) => ({
          foods: [newFood, ...state.foods]
        }));
        return newFood;
      },

      saveDish: (dishInput) => {
        const state = get();
        if (dishInput.id) {
          const existing = state.dishes.find((d) => d.id === dishInput.id);
          if (existing) {
            const updated: CustomDish = {
              ...existing,
              name: dishInput.name.trim(),
              description: dishInput.description?.trim(),
              servings: Math.max(1, dishInput.servings),
              ingredients: dishInput.ingredients
            };
            set({
              dishes: state.dishes.map((d) => (d.id === updated.id ? updated : d))
            });
            return updated;
          }
        }

        const created: CustomDish = {
          id: generateId('dish'),
          name: dishInput.name.trim(),
          description: dishInput.description?.trim(),
          servings: Math.max(1, dishInput.servings),
          ingredients: dishInput.ingredients,
          createdAt: new Date().toISOString()
        };
        set({
          dishes: [created, ...state.dishes]
        });
        return created;
      },

      deleteDish: (dishId) => {
        set((state) => ({
          dishes: state.dishes.filter((d) => d.id !== dishId)
        }));
      },

      restoreDish: (dish) => {
        set((state) => {
          if (state.dishes.some((d) => d.id === dish.id)) return state;
          return {
            dishes: [dish, ...state.dishes]
          };
        });
      },

      resetToDemoSeed: () => {
        const todayKey = toDateKey();
        set({
          selectedDate: todayKey,
          goals: DEFAULT_GOALS,
          foods: INITIAL_FOOD_DATASET,
          dishes: INITIAL_CUSTOM_DISHES,
          logs: buildInitialSeedLogs(INITIAL_FOOD_DATASET, INITIAL_CUSTOM_DISHES, todayKey)
        });
      },

      clearAllLogs: () => {
        set({
          logs: {},
          selectedDate: toDateKey()
        });
      }
    }),
    {
      name: 'nura-nutrition-storage-v1',
      version: 1
    }
  )
);
