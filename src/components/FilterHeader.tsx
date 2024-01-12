import { DatePicker, Input, Select, Checkbox, type SelectProps } from "antd";
import React from "react";
import type { Drink } from "./Home";

interface FilterHeaderProps {
  drinks: Drink[];
  searchText: string;
  setSearchText: (searchText: string) => void;
  dietaryOptions: string[];
  setDietaryOptions: (dietaryOptions: string[]) => void;
  locationOptions: string[];
  setLocationOptions: (locationOptions: string[]) => void;
  storeOptions: string[];
  setStoreOptions: (storeOptions: string[]) => void;
  dateString: string;
  setDateString: (dateString: string) => void;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({
  drinks,
  searchText,
  setSearchText,
  dietaryOptions,
  setDietaryOptions,
  locationOptions,
  setLocationOptions,
  storeOptions,
  setStoreOptions,
  dateString,
  setDateString,
}) => {
  const allCities = drinks.reduce((acc, drink) => {
    return [...acc, ...drink.cities];
  }, [] as string[]);

  const allStores = drinks.reduce((acc, drink) => {
    return [...acc, drink.storeName];
  }, [] as string[]);

  const uniqueCities = [...new Set(allCities)];
  const uniqueStores = [...new Set(allStores)];
  const locationChoices: SelectProps["options"] = uniqueCities.map((city) => ({
    label: city,
    value: city,
  }));
  const storeChoices: SelectProps["options"] = uniqueStores.map((store) => ({
    label: store,
    value: store,
  }));

  const onCheckChange = (checkedValues: CheckboxValueType[]) => {
    setDietaryOptions(checkedValues as string[]);
  };

  const plainOptions = [
    "Stores with Vegan Options",
    "Stores with Dairy Free Options",
    "Stores with Gluten Free Options",
  ];
  const handleLocations = (value: string[]) => {
    setLocationOptions(value);
  };
  const handleStores = (value: string[]) => {
    setStoreOptions(value);
  };

  const onDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    setDateString(dateString);
  };

  return (
    <div className="sticky top-0 z-10 py-8 bg-slate-100 mb-4">
      <div className="flex items-center flex-wrap gap-y-2 lg:flex-nowrap">
        <Input
          type="text"
          placeholder="Search"
          className="w-full lg:w-48 "
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="lg:ml-auto flex gap-2 flex-wrap lg:flex-nowrap">
          <DatePicker onChange={onDateChange} />
          <Select
            mode="multiple"
            allowClear
            showSearch
            className="min-w-48"
            placeholder="Locations"
            defaultValue={locationOptions}
            onChange={handleLocations}
            options={locationChoices}
          />
          <Select
            mode="multiple"
            allowClear
            showSearch
            className="min-w-48"
            placeholder="Stores"
            defaultValue={storeOptions}
            onChange={handleStores}
            options={storeChoices}
          />
        </div>
      </div>
      <div className="mt-4 flex items-center flex-wrap gap-y-2 lg:flex-nowrap">
        <Checkbox.Group
          options={plainOptions}
          defaultValue={dietaryOptions}
          onChange={onCheckChange}
        />
      </div>
    </div>
  );
};

export default FilterHeader;
