import products from "@/assets/data/products";
import CollectionHeader from "@/components/ui/CollectionHeader";
import CollectionSidebar from "@/components/ui/CollectionSidebar";
import ProductCard from "@/features/products/components/ProductCard";
import React from "react";

const Collection = () => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-[1fr_4fr] gap-2">
      <CollectionSidebar />
      <div className="flex flex-col gap-6 px-2 py-6">
        <CollectionHeader />
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <div className="flex-shrink-0 w-64" key={idx}>
              <ProductCard product={product} id={idx}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
