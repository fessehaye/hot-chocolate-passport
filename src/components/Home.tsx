import React, { useState, useEffect } from "react";
import { Menu, ConfigProvider,FloatButton,Modal,Button  } from "antd";
import type { MenuProps } from 'antd';
import DetailBox from "./DetailBox";
import Header from "./Header";
import DrinkGrid from "./DrinkGrid";
import FilterHeader from "./FilterHeader";
import TransferData from "./TransferData";

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

interface HomeProps {
  drinks: Drink[];
}

const Home: React.FC<HomeProps> = ({ drinks }) => {
  // const params = new URLSearchParams(window.location.search);
  const [open, setOpen] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<Drink>();
  const [favoriteDrinks, setFavoriteDrinks] = useState<number[]>([]);
  const [drinksTried, setDrinksTried] = useState<number[]>([]);
  const [sharedFavoriteDrinks, setSharedFavoriteDrinks] = useState<number[]>([]);
  const [sharedDrinksTried, setSharedDrinksTried] = useState<number[]>([]);
  const [searchText, setSearchText] = useState("");
  const [dietaryOptions, setDietaryOptions] = useState<string[]>([]);
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [storeOptions, setStoreOptions] = useState<string[]>([]);
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteDrinks");
    const storedDrinksTried = localStorage.getItem("drinksTried");
    const params = new URLSearchParams(window.location.search);
    const storedFavoriteDrinks = params.get("favoriteDrinks");
    const storedDrinksTriedFromURL = params.get("drinksTried");
    const sharedFavoriteDrinks = params.get("sharedfavoriteDrinks");
    const sharedDrinksTriedFromURL = params.get("shareddrinksTried");
    if (storedFavoriteDrinks) {
      localStorage.setItem("favoriteDrinks", storedFavoriteDrinks);
    }
    if (storedDrinksTriedFromURL) {
      localStorage.setItem("drinksTried", storedDrinksTriedFromURL);
    }
    if(storedFavoriteDrinks || storedDrinksTriedFromURL){
      window.location.search = "";
      return;
    }
    if (storedFavorites) {
      setFavoriteDrinks(JSON.parse(storedFavorites));
    }
    if (storedDrinksTried) {
      setDrinksTried(JSON.parse(storedDrinksTried));
    }
    if(sharedFavoriteDrinks){
      setSharedFavoriteDrinks(JSON.parse(sharedFavoriteDrinks));
    }
    if(sharedDrinksTriedFromURL){
      setSharedDrinksTried(JSON.parse(sharedDrinksTriedFromURL));
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
      label: `Favorites (${favoriteDrinks.length})`,
      key: "Favorites",
    },
    {
      label: `Drinks You Tried (${drinksTried.length})`,
      key: "Tried",
    },
  ];

  if(sharedFavoriteDrinks.length > 0){
    items.unshift({
      label: `Shared Favorites (${sharedFavoriteDrinks.length})`,
      key: "SharedFavorites",
    });
  }
  if(sharedDrinksTried.length > 0){
    items.unshift({
      label: `Shared Drinks Others Tried (${sharedDrinksTried.length})`,
      key: "SharedTried",
    });
  }

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
        drink.dairyFreeOption) ||
        (dietaryOptions.includes("Stores that are open later") &&
          drink?.lateOption)

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
      (current === "Tried" && drinksTried.includes(drink.id)) ||
      (current === "SharedFavorites" && sharedFavoriteDrinks.includes(drink.id)) ||
      (current === "SharedTried" && sharedDrinksTried.includes(drink.id));

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
      <div className="h-full w-full flex-1 flex-col flex">
        <TransferData
          favoriteDrinks={favoriteDrinks}
          drinksTried={drinksTried}
        />
        <DetailBox
          selectedDrink={selectedDrink}
          open={open}
          onClose={onClose}
          favoriteDrinks={favoriteDrinks}
          setFavoriteDrinks={setFavoriteDrinks}
          drinksTried={drinksTried}
          setDrinksTried={setDrinksTried}
        />

        <div className="mb-40">
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
