import React from "react";
import Titles from "./Titles";
import { Button } from "../ui/button";
import { assets } from "@/assets/images/assets";

const SaleBanner = () => {
  return (
    <div
      className={`w-full h-[448px] flex justify-center items-center`}
      style={{ backgroundImage: `url(${assets.banner_2})` }}
    >
      <div className="flex flex-col gap-10 justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <Titles color="white" text1="Big Summer" text2="Sale" textSize='text-7xl' />
          <p className=" text-[#787878]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
        <Button size="lg">Shop Now</Button>
      </div>
    </div>
  );
};

export default SaleBanner;
