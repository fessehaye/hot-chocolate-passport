export enum Tabs {
  All = "All",
  Tried = "Tried",
  Favorites = "Favorites",
  SharedFavorites = "SharedFavorites",
  SharedTried = "SharedTried",
}

export enum DietaryOptions {
  Vegan = "Stores with Vegan Options",
  GlutenFree = "Stores with Gluten Free Options",
  DairyFree = "Stores with Dairy Free Options",
  Late = "Stores that are open after 5pm",
  NotTried = "Drinks I haven't Tried",
}

export interface Drink {
  id: number;
  storeName: string;
  drinkName: string;
  link: string;
  description: string;
  takeoutOnly: boolean;
  startDate: string;
  endDate: string;
  cities: string[];
  veganOption: boolean;
  glutenFreeOption: boolean;
  dairyFreeOption: boolean;
  lateOption?: boolean;
}
