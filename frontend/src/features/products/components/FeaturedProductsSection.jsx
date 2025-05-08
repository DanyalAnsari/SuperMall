import React from "react";
import { useProducts } from '../hooks/useProducts';
import ProductList from './ProductList';

const FeaturedProductsSection = () => {
  // Use the useProducts hook with filter for featured products
  const { 
    products,
    isLoading,
    isError,
    error
  } = useProducts({
    limit: 8,
    featured: true // Filter by the featured field in the model
  });
  
  return (
    <div className="w-full flex flex-col gap-4 bg-base-100 p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold">Featured Products</h2>
        <p className="text-gray-500 text-sm">
          Our handpicked selection just for you.
        </p>
      </div>
      
      <ProductList 
        products={products}
        isLoading={isLoading}
        isError={isError}
        error={error}
        emptyMessage="No featured products available at the moment"
        className="py-4"
      />
    </div>
  );
};

export default FeaturedProductsSection; 