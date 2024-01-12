import React from "react";

const Header: React.FC = () => {

  return (
    <div className="w-full mb-4">
      <h2 className="text-2xl font-bold tracking-tight">
        Hot Chocolate Passport
      </h2>
      <p className="my-2">
        Here's a list of hot chocolate drinks for this year's festival. 
        You can visit the original site for more information <a href="https://hotchocolatefest.com/list-of-flavours">here</a>!
      </p>
      <p className="my-2">You can mark the drinks you've tried and save your favorites.</p>
    </div>
  );
};

export default Header;
