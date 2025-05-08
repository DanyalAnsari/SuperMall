import BestsellingProductSection from "@/features/products/components/BestsellingProductSection";
import FeaturedProductsSection from "@/features/products/components/FeaturedProductsSection";
import LatestProductsSection from "@/features/products/components/LatestProductsSection";
import React from "react";

const ProductsTab = () => {
  return (
    <div className="py-8 max-w-6xl mx-auto px-4">
      <div role="tablist" className="tabs tabs-bordered">
        <input 
          type="radio" 
          name="product_tabs" 
          role="tab" 
          className="tab font-medium text-sm" 
          aria-label="Latest Products" 
          defaultChecked
        />
        <div role="tabpanel" className="tab-content py-6">
          <LatestProductsSection />
        </div>
        
        <input 
          type="radio" 
          name="product_tabs" 
          role="tab" 
          className="tab font-medium text-sm" 
          aria-label="Featured Products"
        />
        <div role="tabpanel" className="tab-content py-6">
          <FeaturedProductsSection />
        </div>
        
        <input 
          type="radio" 
          name="product_tabs" 
          role="tab" 
          className="tab font-medium text-sm" 
          aria-label="Bestselling Products"
        />
        <div role="tabpanel" className="tab-content py-6">
          <BestsellingProductSection />
        </div>
      </div>
    </div>
  );
};

export default ProductsTab;
