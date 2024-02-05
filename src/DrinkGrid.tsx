import { Row, Col, Card, Space, Tag, Result } from "antd";
import React from "react";
import { Drink } from "./types";

interface DrinkGridProps {
  drinks: Drink[];
  showDrawer: (drink: Drink) => void;
}

const DrinkGrid: React.FC<DrinkGridProps> = ({ drinks, showDrawer }) => {
  // Implement the component logic here

  if (drinks.length === 0) {
    return <Result title="No drinks available :(" />;
  }

  const stores = drinks.reduce((acc, drink) => {
    return [...acc, drink.storeName];
  }, [] as string[]);
  const uniqueStores = [...new Set(stores)];

  return (
    <div className="w-full">
      {drinks.length > 0 && (
        <p className="my-4">
          {drinks.length} {drinks.length == 1 ? "Drink" : "Drinks"} Available
          within {uniqueStores.length} store{uniqueStores.length > 1 && "s"}.
        </p>
      )}
      <Row gutter={[16, 16]}>
        {drinks.map((drink) => {
          const startDate = new Date(drink.startDate);
          const endDate = new Date(drink.endDate);
          const formatter = new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          return (
            <Col xs={24} md={12} lg={8} key={drink.id}>
              <Card
                title={` #${drink.id} - ${drink.drinkName.toLowerCase()}`}
                onClick={() => showDrawer(drink)}
                hoverable
                className="cursor-pointer h-full capitalize"
              >
                <div className="mb-2 font-bold">{drink.storeName}</div>
                <div className="mb-8">
                  {formatter.format(startDate)} - {formatter.format(endDate)}
                </div>
                <Space size={[0, 8]} wrap>
                  {drink.cities.map((city: string) => (
                    <Tag color="purple" key={city}>
                      {city}
                    </Tag>
                  ))}
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default DrinkGrid;
