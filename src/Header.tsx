import React from "react";

const Header: React.FC = () => {

  return (
    <div className="w-full mb-4">
      <a href="/" className="no-underline hover:text-red-700 transition text-black">
        <h1 className="text-2xl font-bold tracking-tight">
          Hot Chocolate Passport
        </h1>
      </a>
      <p className="my-2">
        Here's a list of hot chocolate drinks for this year's festival. 
        You can visit the original site for more information <a href="https://hotchocolatefest.com/list-of-flavours">here</a>!
      </p>
      <p className="my-2">You can mark the drinks you've tried and save your favorites.</p>
      <p className="my-2">Remember to always check the original site and stores for accuracy. The map from the original site is also added when you click on the map icon.</p>
    </div>
  );
};

export default Header;
