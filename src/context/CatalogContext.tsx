import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    DiningEntry,
    Dish,
    Restaurant,
    RestaurantStats,
} from '../types/catalog';

const STORAGE_KEY = '@restaurant_catalog_v1';

interface CatalogContextType {
  isLoading: boolean;
  restaurants: Restaurant[];
  dishes: Dish[];
  entries: DiningEntry[];
  cuisines: string[];
  categories: string[];
  dietaryTags: string[];
  // Active draft selection when creating a restaurant/dish mid-entry
  pendingRestaurantId: string | null;
  setPendingRestaurantId: (id: string | null) => void;
  // Actions
  addRestaurant: (
    data: Omit<Restaurant, 'id' | 'isFavorite' | 'createdAt'>
  ) => Promise<Restaurant>;
  toggleFavoriteRestaurant: (id: string) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;
  getRestaurantStats: (restaurantId: string) => RestaurantStats;
}

const DEFAULT_CUISINES = [
  'Italian',
  'Japanese',
  'Mexican',
  'Thai',
  'American',
  'Mediterranean',
  'Indian',
  'Chinese',
];

const DEFAULT_CATEGORIES = [
  'Appetizer',
  'Main',
  'Antipasta',
  'Dessert',
  'Side',
  'Drink',
];

const DEFAULT_DIETARY_TAGS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Lactose-Free',
  'Nut-Free',
];

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [entries, setEntries] = useState<DiningEntry[]>([]);
  const [cuisines, setCuisines] = useState<string[]>(DEFAULT_CUISINES);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [dietaryTags, setDietaryTags] = useState<string[]>(DEFAULT_DIETARY_TAGS);
  const [pendingRestaurantId, setPendingRestaurantId] = useState<string | null>(
    null
  );

  // Load saved data on startup
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.restaurants) setRestaurants(parsed.restaurants);
          if (parsed.dishes) setDishes(parsed.dishes);
          if (parsed.entries) setEntries(parsed.entries);
          if (parsed.cuisines) setCuisines(parsed.cuisines);
          if (parsed.categories) setCategories(parsed.categories);
          if (parsed.dietaryTags) setDietaryTags(parsed.dietaryTags);
        }
      } catch (e) {
        console.error('Failed to load catalog data:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persist = async (next: {
    restaurants?: Restaurant[];
    dishes?: Dish[];
    entries?: DiningEntry[];
    cuisines?: string[];
    categories?: string[];
    dietaryTags?: string[];
  }) => {
    const payload = {
      restaurants: next.restaurants ?? restaurants,
      dishes: next.dishes ?? dishes,
      entries: next.entries ?? entries,
      cuisines: next.cuisines ?? cuisines,
      categories: next.categories ?? categories,
      dietaryTags: next.dietaryTags ?? dietaryTags,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const addRestaurant = async (
    data: Omit<Restaurant, 'id' | 'isFavorite' | 'createdAt'>
  ): Promise<Restaurant> => {
    const newRestaurant: Restaurant = {
      ...data,
      id: `rest_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newRestaurant, ...restaurants];
    setRestaurants(updated);
    await persist({ restaurants: updated });
    return newRestaurant;
  };

  const toggleFavoriteRestaurant = async (id: string) => {
    const updated = restaurants.map((r) =>
      r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
    );
    setRestaurants(updated);
    await persist({ restaurants: updated });
  };

  const deleteRestaurant = async (id: string) => {
    const updated = restaurants.filter((r) => r.id !== id);
    setRestaurants(updated);
    await persist({ restaurants: updated });
  };

  // Dynamically aggregates all entries linked to a specific restaurant
  const getRestaurantStats = (restaurantId: string): RestaurantStats => {
    const linked = entries
      .filter((e) => e.restaurantId === restaurantId)
      .sort(
        (a, b) =>
          new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime()
      );

    const atmScores = linked
      .map((e) => e.atmosphereRating)
      .filter((v): v is number => typeof v === 'number');
    const srvScores = linked
      .map((e) => e.serviceRating)
      .filter((v): v is number => typeof v === 'number');

    const avg = (arr: number[]) =>
      arr.length
        ? Math.round((arr.reduce((sum, n) => sum + n, 0) / arr.length) * 10) /
          10
        : null;

    return {
      visitCount: linked.length,
      avgAtmosphere: avg(atmScores),
      avgService: avg(srvScores),
      lastVisitDate: linked.length > 0 ? linked[0].visitedAt : null,
      visitNotes: linked
        .filter((e) => e.notes && e.notes.trim().length > 0)
        .map((e) => ({
          entryId: e.id,
          visitedAt: e.visitedAt,
          notes: e.notes!.trim(),
        })),
    };
  };

  return (
    <CatalogContext.Provider
      value={{
        isLoading,
        restaurants,
        dishes,
        entries,
        cuisines,
        categories,
        dietaryTags,
        pendingRestaurantId,
        setPendingRestaurantId,
        addRestaurant,
        toggleFavoriteRestaurant,
        deleteRestaurant,
        getRestaurantStats,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error('useCatalog must be used inside a CatalogProvider');
  }
  return ctx;
}