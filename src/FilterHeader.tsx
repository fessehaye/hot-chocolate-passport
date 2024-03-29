import {
  DatePicker,
  Input,
  Select,
  Checkbox,
  Button,
  type SelectProps,
} from "antd";
import React from "react";
import { DietaryOptions, type Drink } from "./types";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import type { DatePickerProps } from "antd";
import dayjs from "dayjs";
import type { RangePickerProps } from "antd/es/date-picker";
import { useSearchParams } from "react-router-dom";

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
  clearFilters: () => void;
  drinksTried: number[];
}
const MAX_COUNT = 6;

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
  setDateString,
  clearFilters,
  dateString,
  drinksTried,
}) => {
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current >= dayjs("02-14-2024") || current <= dayjs("01-13-2024");
  };

  const [searchParams] = useSearchParams();

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
    DietaryOptions.Vegan,
    DietaryOptions.DairyFree,
    DietaryOptions.GlutenFree,
    DietaryOptions.Late,
  ];
  if (
    drinksTried &&
    drinksTried.length > 0 &&
    searchParams.get("current") !== "Tried"
  ) {
    plainOptions.push(DietaryOptions.NotTried);
  }

  const handleLocations = (value: string[]) => {
    setLocationOptions(value);
  };
  const handleStores = (value: string[]) => {
    setStoreOptions(value);
  };

  const onDateChange: DatePickerProps["onChange"] = (
    _,
    dateString: string | string[]
  ) => {
    setDateString(dateString as string);
  };

  return (
    <div className="lg:sticky top-0 z-10 py-8 bg-slate-100 mb-4">
      <div className="flex items-center flex-wrap gap-y-2 lg:flex-nowrap">
        <Input
          type="text"
          placeholder="Search"
          className="w-full lg:w-48 "
          value={searchText}
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={(e) => e.currentTarget.blur()}
        />
        <Button className="ml-2 hidden lg:block" onClick={() => clearFilters()}>
          Clear All Filters
        </Button>
        <div className="lg:ml-auto flex gap-2 flex-wrap lg:flex-nowrap w-full lg:w-auto">
          <DatePicker
            className="min-w-40 flex-1"
            format={"MM-DD-YYYY"}
            inputReadOnly
            onChange={onDateChange}
            disabledDate={disabledDate}
            value={dateString ? dayjs(dateString) : undefined}
          />
          <Select
            mode="multiple"
            allowClear
            showSearch
            className="min-w-48 flex-1"
            placeholder="Location Areas"
            value={locationOptions}
            onChange={handleLocations}
            maxTagCount={"responsive"}
            options={locationChoices}
          />
          <Select
            mode="multiple"
            allowClear
            showSearch
            className="min-w-48 flex-1"
            placeholder="Stores"
            maxCount={MAX_COUNT}
            maxTagCount={"responsive"}
            value={storeOptions}
            onChange={handleStores}
            options={storeChoices}
          />
          <Button
            className="block lg:hidden w-full"
            onClick={() => clearFilters()}
          >
            Clear Filters
          </Button>
        </div>
      </div>
      <div className="mt-4 flex items-center flex-wrap gap-y-2 lg:flex-nowrap">
        <Checkbox.Group
          options={plainOptions}
          value={dietaryOptions}
          onChange={onCheckChange}
        />
      </div>
    </div>
  );
};

export default FilterHeader;
