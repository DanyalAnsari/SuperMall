import React from "react";
import SmallBanner from "./SmallBanner";

const SmallBanners = () => {
  return (
    <div className="w-full flex items-start">
      <SmallBanner
        product={{ bgColor: "bg-[#ffffff]", textColor: "text-black" }}
      />
      <SmallBanner
        product={{ bgColor: "bg-[#f9f9f9]", textColor: "text-black" }}
      />
      <SmallBanner
        product={{ bgColor: "bg-[#eaeaea]", textColor: "text-black" }}
      />
      <SmallBanner
        product={{ bgColor: "bg-[#2c2c2c]", textColor: "text-white" }}
      />
    </div>
  );
};

export default SmallBanners;
