import Hero from "@/components/ui/Hero";
import ProductsTab from "@/components/ui/ProductsTab";
import CategorySection from "@/features/categories/components/CategorySection";
import React from "react";

const Home = () => {
  return (
    <div className="px-2 flex flex-col gap-4">
      <Hero />
      <CategorySection />
      <ProductsTab />
    </div>
  );
};

export default Home;
