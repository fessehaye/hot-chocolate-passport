import { Drawer, Space, Tag, Flex, Button } from "antd";
import React from "react";
import type { Drink } from "./Home";
import { useMediaQuery } from "@uidotdev/usehooks";

interface DetailBoxProps {
  selectedDrink: Drink | undefined;
  open: boolean;
  onClose: () => void;
  favoriteDrinks: number[];
  setFavoriteDrinks: (updatedFavorites: number[]) => void;
  drinksTried: number[];
  setDrinksTried: (updatedDrinksTried: number[]) => void;
}

const DetailBox: React.FC<DetailBoxProps> = ({
  selectedDrink,
  open,
  onClose,
  favoriteDrinks,
  setFavoriteDrinks,
  drinksTried,
  setDrinksTried,
}) => {
  const isDesktop = useMediaQuery("(min-width: 992px)");

  const addToFavorite = (id: number | undefined) => {
    if (!id) {
      return;
    }

    const isFavorite = favoriteDrinks.includes(id);
    let updatedFavorites: number[];

    if (isFavorite) {
      updatedFavorites = favoriteDrinks.filter((drinkId) => drinkId !== id);
    } else {
      updatedFavorites = [...favoriteDrinks, id];
    }

    setFavoriteDrinks(updatedFavorites);
    localStorage.setItem("favoriteDrinks", JSON.stringify(updatedFavorites));
  };
  const addToTried = (id: number | undefined) => {
    if (!id) {
      return;
    }

    const isTried = drinksTried.includes(id);
    let updatedDrinksTried: number[];

    if (isTried) {
      updatedDrinksTried = drinksTried.filter((drinkId) => drinkId !== id);
    } else {
      updatedDrinksTried = [...drinksTried, id];
    }

    setDrinksTried(updatedDrinksTried);
    localStorage.setItem("drinksTried", JSON.stringify(updatedDrinksTried));
  };

  return (
    <Drawer
      title={`#${selectedDrink?.id} - ${selectedDrink?.drinkName}`}
      placement={isDesktop ? "right" : "bottom"}
      width={isDesktop ? 640 : "100%"}
      height={isDesktop ? "100%" : 540}
      onClose={onClose}
      open={open}
    >
      <div className="w-full text-lg">
        {(selectedDrink?.glutenFreeOption ||
          selectedDrink?.veganOption ||
          selectedDrink?.dairyFreeOption) && (
          <div>
            <Space size={[0, 8]} wrap>
              {selectedDrink?.glutenFreeOption && (
                <Tag color="processing">Store has Gluten Options</Tag>
              )}
              {selectedDrink?.veganOption && <Tag color="processing">Store has Vegan Options</Tag>}
              {selectedDrink?.dairyFreeOption && (
                <Tag color="processing">Store has Dairy Options</Tag>
              )}
            </Space>
          </div>
        )}
        <p className="mb-4">
          Cafe: {selectedDrink?.storeName}{" "}
          {selectedDrink?.takeoutOnly && (
            <span className="font-bold ml-2">(Takeout Only)</span>
          )}
        </p>
        <p className="mb-8 text-base">{selectedDrink?.description}</p>
        <Flex gap="middle" wrap="wrap" align={isDesktop ? "center" : ""}>
          <Button
            type="primary"
            size="large"
            className="flex items-center"
            onClick={() => addToTried(selectedDrink?.id)}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                />
              </svg>
            }
          >
            {drinksTried.includes(selectedDrink?.id || 0)
              ? "Remove from Tried"
              : "Add to Tried"}
          </Button>
          <Button
            type="primary"
            size="large"
            className="flex items-center"
            onClick={() => addToFavorite(selectedDrink?.id)}
            icon={
              favoriteDrinks.includes(selectedDrink?.id || 0) ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
              )
            }
          >
            {favoriteDrinks.includes(selectedDrink?.id || 0)
              ? "Remove from Favorites"
              : "Add to Favorites"}
          </Button>
          <Button
            type="default"
            size="large"
            className="flex items-center"
            href={selectedDrink?.link}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                />
              </svg>
            }
          >
            More Information
          </Button>
        </Flex>
      </div>
    </Drawer>
  );
};

export default DetailBox;
