import React from "react";
import Titles from "./Titles";
import { Button } from "../ui/button";
import { assets } from "@/assets/images/assets";
import { NavLink } from "react-router-dom";

const Banner = () => {
  return (
    <section className="w-full flex flex-wrap items-center justify-between gap-8 lg:gap-16 px-6 lg:px-40 bg-gradient-to-r from-[#211c24] to-[#211c24]">
      <div className="flex items-center gap-6 flex-1 min-w-[300px] lg:min-w-[400px] justify-start">
        <div className="w-full flex flex-col gap-6 items-start">
          <h2 className="opacity-40  text-2xl text-white font-semibold leading-8">
            Pro.Beyond.
          </h2>
          <Titles text1="IPhone 14" text2="Pro" />
          <p className="w-full text-lg text-gray-500 font-medium leading-6">
            Created to change everything for the better. For everyone
          </p>
          <Button
            asChild={true}
            variant="outline"
            className="px-14 rounded-md border border-solid border-white text-white bg-transparent hover:bg-zinc-100"
          >
            <NavLink to='shop'>Shop Now</NavLink>
          </Button>
        </div>
        <img src={assets.iphone_image} className="relative w-full" />
      </div>
    </section>
  );
};

export default Banner;
