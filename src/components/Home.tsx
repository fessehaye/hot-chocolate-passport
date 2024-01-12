import React, { useState, useEffect } from "react";
import { Menu, ConfigProvider } from "antd";
import type { MenuProps } from 'antd';
import DetailBox from "./DetailBox";
import Header from "./Header";
import DrinkGrid from "./DrinkGrid";
import FilterHeader from "./FilterHeader";

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
}

interface HomeProps {
  drinks: Drink[];
}

const Home: React.FC<HomeProps> = ({ drinks }) => {
  const [open, setOpen] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<Drink>();
  const [favoriteDrinks, setFavoriteDrinks] = useState<number[]>([]);
  const [drinksTried, setDrinksTried] = useState<number[]>([]);
  const [searchText, setSearchText] = useState("");
  const [dietaryOptions, setDietaryOptions] = useState<string[]>([]);
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [storeOptions, setStoreOptions] = useState<string[]>([]);
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteDrinks");
    const storedDrinksTried = localStorage.getItem("drinksTried");
    if (storedFavorites) {
      setFavoriteDrinks(JSON.parse(storedFavorites));
    }
    if (storedDrinksTried) {
      setDrinksTried(JSON.parse(storedDrinksTried));
    }
  }, []);

  const showDrawer = (drink: Drink) => {
    setOpen(true);
    setSelectedDrink(drink);
  };

  const onClose = () => {
    setOpen(false);
    setSelectedDrink(undefined);
  };
  const [current, setCurrent] = useState("All");

  const items: MenuProps["items"] = [
    {
      label: "All Drinks",
      key: "All",
    },
    {
      label: "Favorites",
      key: "Favorites",
    },
    {
      label: "Drinks I've Tried",
      key: "Tried",
    },
  ];

  const onMenuClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const clearFilters = () => {
    setSearchText("");
    setDietaryOptions([]);
    setLocationOptions([]);
    setStoreOptions([]);
    setDateString("");
    setCurrent("All");
  };

  const filteredDrinks = drinks.filter((drink) => {
    const searchTextMatch =
      drink.drinkName.toLowerCase().includes(searchText.toLowerCase()) ||
      drink.storeName.toLowerCase().includes(searchText.toLowerCase()) ||
      drink.description.toLowerCase().includes(searchText.toLowerCase());

    const dietaryOptionsMatch =
      dietaryOptions.length === 0 ||
      (dietaryOptions.includes("Stores with Vegan Options") &&
        drink.veganOption) ||
      (dietaryOptions.includes("Stores with Gluten Free Options") &&
        drink.glutenFreeOption) ||
      (dietaryOptions.includes("Stores with Dairy Free Options") &&
        drink.dairyFreeOption);

    const locationOptionsMatch =
      locationOptions.length === 0 ||
      drink.cities.some((city) => locationOptions.includes(city));

    const storeOptionsMatch =
      storeOptions.length === 0 || storeOptions.includes(drink.storeName);

    const dateOptionsMatch =
      dateString.length === 0 ||
      (new Date(drink.startDate) <= new Date(dateString) &&
        new Date(drink.endDate) >= new Date(dateString));

    const favoriteDrinksMatch =
      current === "All" ||
      (current === "Favorites" && favoriteDrinks.includes(drink.id)) ||
      (current === "Tried" && drinksTried.includes(drink.id));

    return (
      searchTextMatch &&
      dietaryOptionsMatch &&
      locationOptionsMatch &&
      storeOptionsMatch &&
      dateOptionsMatch &&
      favoriteDrinksMatch
    );
  });

  return (
    <ConfigProvider>
      <div className="h-full w-full flex-1 flex-col space-y-8 flex">
        <DetailBox
          selectedDrink={selectedDrink}
          open={open}
          onClose={onClose}
          favoriteDrinks={favoriteDrinks}
          setFavoriteDrinks={setFavoriteDrinks}
          drinksTried={drinksTried}
          setDrinksTried={setDrinksTried}
        />

        <div className="mb-20">
          <Header />
          <Menu
            onClick={onMenuClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
            className="bg-slate-100"
          />
          <FilterHeader
            drinks={drinks}
            searchText={searchText}
            dietaryOptions={dietaryOptions}
            setSearchText={setSearchText}
            setDietaryOptions={setDietaryOptions}
            storeOptions={storeOptions}
            locationOptions={locationOptions}
            setStoreOptions={setStoreOptions}
            setLocationOptions={setLocationOptions}
            setDateString={setDateString}
            dateString={dateString}
            clearFilters={clearFilters}
          />
          <DrinkGrid drinks={filteredDrinks} showDrawer={showDrawer} />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Home;
