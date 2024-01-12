import React from "react";
import { Switch } from "antd";

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
}
const Header: React.FC = ({ isDarkMode, setIsDarkMode }) => {
  const onChange = (checked: boolean) => {
    setIsDarkMode(checked);
  };
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold tracking-tight">
        Hot Chocolate Passport{" "}
        {/* <Switch
          checkedChildren="dark"
          unCheckedChildren="light"
          onChange={onChange}
          defaultChecked={isDarkMode}
        /> */}
      </h2>
      <p className="text-muted-foreground">
        Here's a list of hot chocolate drink for this years festival.
      </p>
    </div>
  );
};

export default Header;
