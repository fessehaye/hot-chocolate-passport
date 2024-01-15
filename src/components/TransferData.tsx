import { FloatButton, Modal, Button } from 'antd';
import React, { useState } from 'react';

interface TransferDataProps {
    favoriteDrinks: number[];
    drinksTried: number[];
}

const TransferData: React.FC<TransferDataProps> = ({favoriteDrinks,drinksTried}) => {
    // Add your component logic here
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("transfer");
    
    const getTransferLink = () => {
        
        if (modalState === "transfer") {
            const params = new URLSearchParams(window.location.search);
            params.delete("sharedfavoriteDrinks");
            params.delete("shareddrinksTried");
            params.set("favoriteDrinks", JSON.stringify(favoriteDrinks));
            params.set("drinksTried", JSON.stringify(drinksTried));
            return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        }
        else {
            const params = new URLSearchParams(window.location.search);
            params.delete("sharedfavoriteDrinks");
            params.delete("shareddrinksTried");
            params.set("sharedfavoriteDrinks", JSON.stringify(favoriteDrinks));
            params.set("shareddrinksTried", JSON.stringify(drinksTried));
            return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        }
    }

    const showModal = (mode:string) => {
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

    const ShareIcon = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
      </svg>
    }  
    
    const TransferIcon = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
      </svg>
    }      

    return (
        <>
            <FloatButton.Group shape="circle">
                <FloatButton tooltip={<div>Transfer Data</div>} icon={<TransferIcon/>} onClick={() => showModal("transfer")}/>
                <FloatButton tooltip={<div>Share Drinks</div>} icon={<ShareIcon/>} onClick={() => showModal("share")}/>
                <FloatButton.BackTop />
            </FloatButton.Group>
            <Modal 
            title={modalState === "transfer" ? "Transfer Data": "Share Data"}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={[
                <Button key="submit" onClick={handleOk}>
                Copy To Clipboard
                </Button>]
                }
            >
                <p>
                    {
                        modalState === "transfer" ?
                        "If you would like to transfers your bookmarks to another device, just copy this URL to the new browser." :
                        "If you would like to just share the drinks that you have tried to friends, just copy this URL to the new browser."
                    }
                </p>
            <p>{getTransferLink()}</p>
            </Modal>
        </>
    );
};

export default TransferData;
