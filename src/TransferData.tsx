import { FloatButton, Modal, Button, Checkbox } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

interface TransferDataProps {
  favoriteDrinks: number[];
  drinksTried: number[];
}

const TransferData: React.FC<TransferDataProps> = ({
  favoriteDrinks,
  drinksTried,
}) => {
  const plainOptions = ["Include Drinks Tried", "Include Favorites"];

  // Add your component logic here
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState("transfer");
  const [checkedList, setCheckedList] =
    useState<CheckboxValueType[]>(plainOptions);
  const location = useLocation();

  const getTransferLink = () => {
    if (modalState === "transfer") {
      const params = new URLSearchParams(location.search);
      params.delete("sharedfavoriteDrinks");
      params.delete("shareddrinksTried");
      params.delete("search");
      params.delete("dietaryOptions");
      params.delete("locationOptions");
      params.delete("storeOptions");
      params.delete("date");
      params.delete("current");
      if (checkedList.includes("Include Favorites")) {
        params.set("favoriteDrinks", JSON.stringify(favoriteDrinks));
      }
      if (checkedList.includes("Include Drinks Tried")) {
        params.set("drinksTried", JSON.stringify(drinksTried));
      }
      return `${window.location.origin}${
        location.pathname
      }?${params.toString()}`;
    } else {
      const params = new URLSearchParams(location.search);
      params.delete("sharedfavoriteDrinks");
      params.delete("shareddrinksTried");
      params.delete("search");
      params.delete("dietaryOptions");
      params.delete("locationOptions");
      params.delete("storeOptions");
      params.delete("date");
      params.delete("current");
      if (checkedList.includes("Include Favorites")) {
        params.set("sharedfavoriteDrinks", JSON.stringify(favoriteDrinks));
      }
      if (checkedList.includes("Include Drinks Tried")) {
        params.set("shareddrinksTried", JSON.stringify(drinksTried));
      }
      return `${window.location.origin}${
        location.pathname
      }?${params.toString()}`;
    }
  };

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
  };

  const showModal = (mode: string) => {
    setModalState(mode);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    navigator.clipboard.writeText(getTransferLink());
    console.log("copied");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const openMap = () => {
    window.open(
      "https://www.google.com/maps/d/u/0/viewer?mid=1aamzGQJ_b58e7SOxfl15eX7HuYI09wTU&femb=1&ll=49.16253285152246%2C-122.91547176591797&z=11",
      "_blank"
    );
  };

  const ShareIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
        />
      </svg>
    );
  };

  const TransferIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
        />
      </svg>
    );
  };

  const MapIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
      </svg>
    );
  };

  return (
    <>
      <FloatButton.Group shape="circle">
        <FloatButton
          tooltip={<div>Transfer Data</div>}
          icon={<TransferIcon />}
          onClick={() => showModal("transfer")}
        />
        <FloatButton
          tooltip={<div>Share Drinks</div>}
          icon={<ShareIcon />}
          onClick={() => showModal("share")}
        />
        <FloatButton
          tooltip={<div>Map (Official)</div>}
          icon={<MapIcon />}
          onClick={() => openMap()}
        />
        <FloatButton.BackTop />
      </FloatButton.Group>
      <Modal
        title={modalState === "transfer" ? "Transfer Data" : "Share Data"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" onClick={handleOk}>
            Copy To Clipboard
          </Button>,
        ]}
      >
        <p>
          {modalState === "transfer"
            ? "If you would like to transfers your bookmarks to another device, just copy this URL to the new browser."
            : "If you would like to just share the drinks that you have tried to friends, just copy this URL to the new browser."}
        </p>
        <p>{getTransferLink()}</p>

        <Checkbox.Group
          options={plainOptions}
          value={checkedList}
          onChange={onChange}
        />
      </Modal>
    </>
  );
};

export default TransferData;
