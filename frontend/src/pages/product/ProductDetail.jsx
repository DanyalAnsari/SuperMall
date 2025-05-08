import React from "react";

const ProductDetail = () => {
  const productData = products[0];
  return (
    <section className="w-full border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* product data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* product images */}
        <ProductImage productData={productData} />
        {/* product info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-3" />
            <Star className="w-3" />
            <Star className="w-3" />
            <Star className="w-3" />
            <Star className="w-3" />
            <p className="pl-2">{122}</p>
          </div>
          <div className="mt-5 flex items-center gap-4 w-full">
            <span className="w-fit mt-[-1px] text-3xl font-medium leading-12 whitespace-nowrap">
              ${productData.discountedPrice}
            </span>
            <span className="flex-1 text-2xl text-zinc-400 font-normal leading-8 line-through">
              ${productData.price}
            </span>
          </div>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <button className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700">
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5 " />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Products</p>
            <p>Cash on Delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* --------Description  and review section-------- */}

      {/* <DescriptionReview /> */}

      {/* -------display related products-------- */}
    </section>
  );
};

import { useEffect, useState } from "react";
import products from "../../../public/mockdata/products";
import { Star } from "lucide-react";

const ProductImage = ({ productData }) => {
  const [image, setImage] = useState("");
  useEffect(() => {
    setImage(productData.images[0]);
  }, [productData]);

  return (
    <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
      <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
        {productData.images.map((image, index) => (
          <img
            src={image}
            key={index}
            onClick={() => setImage(image)}
            className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
          />
        ))}
      </div>
      <div className="w-full sm:w-[80%] ">
        <img src={image} className="w-full h-auto" />
      </div>
    </div>
  );
};

export default ProductDetail;
