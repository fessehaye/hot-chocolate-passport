import React, { useState, useEffect } from "react";
import { Menu, Spin } from "antd";
import type { MenuProps } from "antd";
import DetailBox from "./DetailBox";
import Header from "./Header";
import DrinkGrid from "./DrinkGrid";
import FilterHeader from "./FilterHeader";
import TransferData from "./TransferData";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useMatch, useSearchParams } from "react-router-dom";

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

const Home: React.FC = () => {
  const { isPending, error, data } = useQuery<Drink[]>({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch(
        "https://gist.githubusercontent.com/fessehaye/3d2f70ef5fc983087612d25e9f5fa586/raw/0701bc641fb390fc3e6cd5cccf394bfe39ddfc4d/drinks.json"
      ).then((res) => res.json()),
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const drinks = data || [];
  const match = useMatch("/drink/:drink");
  const open = match !== null;
  const selectedDrink = drinks.find(
    (drink) => drink.id === Number(match?.params.drink)
  );

  const [favoriteDrinks, setFavoriteDrinks] = useState<number[]>([]);
  const [drinksTried, setDrinksTried] = useState<number[]>([]);
  const [sharedFavoriteDrinks, setSharedFavoriteDrinks] = useState<number[]>(
    []
  );
  const [sharedDrinksTried, setSharedDrinksTried] = useState<number[]>([]);

  const [searchText, setSearchText] = [
    searchParams.get("search") || "",
    (searchText: string) => {
      setSearchParams(
        (params) => {
          if (searchText === "") {
            params.delete("search");
          } else {
            params.set("search", searchText);
          }
          return params;
        },
        { replace: true }
      );
    },
  ];
  const [dietaryOptions, setDietaryOptions] = [
    searchParams.getAll("dietaryOptions") || [],
    (dietaryOptions: string[]) => {
      setSearchParams(
        (params) => {
          params.delete("dietaryOptions");
          for (const option of dietaryOptions) {
            params.append("dietaryOptions", option);
          }
          return params;
        },
        { replace: true }
      );
    },
  ];
  const [locationOptions, setLocationOptions] = [
    searchParams.getAll("locationOptions") || [],
    (dietaryOptions: string[]) => {
      setSearchParams(
        (params) => {
          params.delete("locationOptions");
          for (const option of dietaryOptions) {
            params.append("locationOptions", option);
          }
          return params;
        },
        { replace: true }
      );
    },
  ];
  const [storeOptions, setStoreOptions] = [
    searchParams.getAll("storeOptions") || [],
    (dietaryOptions: string[]) => {
      setSearchParams(
        (params) => {
          params.delete("storeOptions");
          for (const option of dietaryOptions) {
            params.append("storeOptions", option);
          }
          return params;
        },
        { replace: true }
      );
    },
  ];
  const [dateString, setDateString] = [
    searchParams.get("date") || "",
    (dateString: string) => {
      setSearchParams(
        (params) => {
          if (dateString === "") {
            params.delete("date");
          } else {
            params.set("date", dateString);
          }
          return params;
        },
        { replace: true }
      );
    },
  ];
  const [current, setCurrent] = [
    searchParams.get("current") || "All",
    (current: string) => {
      setSearchParams(
        (params) => {
          params.delete("search");
          params.delete("dietaryOptions");
          params.delete("locationOptions");
          params.delete("storeOptions");
          params.delete("date");
          if (current === "") {
            params.delete("current");
          } else {
            params.set("current", current);
          }
          return params;
        },
        { replace: true }
      );
    },
  ];

  const storedFavoriteDrinksFromURL = searchParams.get("favoriteDrinks");
  const storedDrinksTriedFromURL = searchParams.get("drinksTried");
  const sharedFavoriteDrinksFromURL = searchParams.get("sharedfavoriteDrinks");
  const sharedDrinksTriedFromURL = searchParams.get("shareddrinksTried");

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteDrinks");
    const storedDrinksTried = localStorage.getItem("drinksTried");

    if (storedFavoriteDrinksFromURL) {
      localStorage.setItem("favoriteDrinks", storedFavoriteDrinksFromURL);
    }
    if (storedDrinksTriedFromURL) {
      localStorage.setItem("drinksTried", storedDrinksTriedFromURL);
    }
    if (storedFavoriteDrinksFromURL || storedDrinksTriedFromURL) {
      navigate("/");
      return;
    }
    if (storedFavorites) {
      setFavoriteDrinks(JSON.parse(storedFavorites));
    }
    if (storedDrinksTried) {
      setDrinksTried(JSON.parse(storedDrinksTried));
    }
    if (sharedFavoriteDrinksFromURL) {
      setSharedFavoriteDrinks(JSON.parse(sharedFavoriteDrinksFromURL));
    }
    if (sharedDrinksTriedFromURL) {
      setSharedDrinksTried(JSON.parse(sharedDrinksTriedFromURL));
    }
  }, [
    navigate,
    searchParams,
    sharedDrinksTriedFromURL,
    sharedFavoriteDrinksFromURL,
    storedDrinksTriedFromURL,
    storedFavoriteDrinksFromURL,
  ]);

  const showDrawer = (drink: Drink) => {
    navigate(`/drink/${drink.id}?${searchParams.toString()}`);
  };

  const onClose = () => {
    navigate(`/?${searchParams.toString()}`);
  };

  const items: MenuProps["items"] = [
    {
      label: "All Drinks",
      key: "All",
    },
    {
      label: `Drinks You Tried (${drinksTried.length})`,
      key: "Tried",
    },
    {
      label: `Favorites (${favoriteDrinks.length})`,
      key: "Favorites",
    },
  ];

  const ShareIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-3 h-3 mr-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
        />
      </svg>
    );
  };

  if (sharedFavoriteDrinks.length > 0) {
    items.unshift({
      label: `Shared Favorites (${sharedFavoriteDrinks.length})`,
      key: "SharedFavorites",
      icon: <ShareIcon />,
    });
  }
  if (sharedDrinksTried.length > 0) {
    items.unshift({
      label: `Shared Drinks Tried (${sharedDrinksTried.length})`,
      key: "SharedTried",
      icon: <ShareIcon />,
    });
  }

  const onMenuClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const clearFilters = () => {
    setSearchParams(
      (params) => {
        params.delete("search");
        params.delete("dietaryOptions");
        params.delete("locationOptions");
        params.delete("storeOptions");
        params.delete("date");
        params.delete("current");
        return params;
      },
      { replace: true }
    );
  };

  const filteredDrinks = drinks.filter((drink) => {
    const searchTextMatch =
      drink.drinkName.toLowerCase().includes(searchText.toLowerCase()) ||
      drink.storeName.toLowerCase().includes(searchText.toLowerCase()) ||
      drink.description.toLowerCase().includes(searchText.toLowerCase());

    const dietaryOptionsMatch =
      dietaryOptions.length === 0 ||
      ((!dietaryOptions.includes("Stores with Vegan Options") ||
        drink.veganOption) &&
        (!dietaryOptions.includes("Stores with Gluten Free Options") ||
          drink.glutenFreeOption) &&
        (!dietaryOptions.includes("Stores with Dairy Free Options") ||
          drink.dairyFreeOption) &&
        (!dietaryOptions.includes("Stores that are open after 5pm") ||
          drink?.lateOption));

    const locationOptionsMatch =
      locationOptions.length === 0 ||
      drink.cities.some((city: string) => locationOptions.includes(city));

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
      (current === "SharedFavorites" &&
        sharedFavoriteDrinks.includes(drink.id)) ||
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

  if (isPending)
    return (
      <div className="h-full w-full flex-1 flex-col flex">
        <Spin size="large" />
      </div>
    );

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="h-full w-full flex-1 flex-col flex">
      <TransferData favoriteDrinks={favoriteDrinks} drinksTried={drinksTried} />
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
  );
};

export default Home;
