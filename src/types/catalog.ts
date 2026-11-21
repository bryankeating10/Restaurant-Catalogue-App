export interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine: string;
  coverImage?: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface Dish {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  category: string;
  dietaryTags: string[];
  description: string;
  image?: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface DishReview {
  id: string;
  dishId: string;
  flavor?: number;
  size?: number;
  texture?: number;
  presentation?: number;
  description?: string;
  photos: string[];
}

export interface DiningEntry {
  id: string;
  type: 'visit' | 'takeout' | 'delivery';
  restaurantId: string;
  visitedAt: string;
  atmosphereRating?: number;
  serviceRating?: number;
  packagingRating?: number;
  totalCost?: number;
  notes?: string;
  dishReviews: DishReview[];
  isFavorite: boolean;
}

export interface RestaurantStats {
  visitCount: number;
  avgAtmosphere: number | null;
  avgService: number | null;
  lastVisitDate: string | null;
  visitNotes: { entryId: string; visitedAt: string; notes: string }[];
}