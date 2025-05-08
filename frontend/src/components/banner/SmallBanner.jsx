import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { assets } from "@/assets/images/assets";

const SmallBanner = ({ product }) => {
  return (
    <div
      className={`flex flex-col min-w-[280px] flex-1 grow relative ${product.bgColor}`}
    >
      <div className="relative h-[376px] w-full">
        <img
          src={assets.ipad_image}
          className="w-[360px] h-[360px] absolute left-0 top-0 object-cover"
        />
      </div>
      <Card className={`border-none shadow-none ${product.bgColor}`}>
        <CardHeader className="pt-0">
          <CardTitle
            className={`font-light text-3xl leading-12 ${product.textColor}`}
          >
            Popular Products
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-0 px-8">
          <p className="text-sm text-slate-400 leading-6 font-medium">
            iPad combines a magnificent 10.2-inch Retina display, incredible
            performance, multitasking and ease of use.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className={`${product.textColor === "text-white" ? "border-white text-white": "border-black text-black"} bg-transparent font-medium text-base rounded-sm px-10 py-6`}>Shop Now</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SmallBanner;
