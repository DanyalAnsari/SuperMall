import React from "react";
import { useProducts } from '../hooks/useProducts';
import ProductList from './ProductList';

const LatestProductsSection = () => {
  // Use the useProducts hook with sorting by createdAt to get latest products
  const { 
    products,
    isLoading,
    isError,
    error
  } = useProducts({
    limit: 8,
    sort: '-createdAt' // Sort by newest first
  });
  
  return (
    <div className="w-full flex flex-col gap-4 bg-base-100 p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold">Latest Products</h2>
        <p className="text-gray-500 text-sm">
          Check out our newest arrivals.
        </p>
      </div>
      
      <ProductList 
        products={products}
        isLoading={isLoading}
        isError={isError}
        error={error}
        emptyMessage="No products available at the moment"
        className="py-4"
      />
    </div>
  );
};

export default LatestProductsSection;
