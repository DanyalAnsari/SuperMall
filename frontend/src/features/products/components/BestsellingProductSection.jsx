import React from "react";
import { useProducts } from '../hooks/useProducts';
import ProductList from './ProductList';

const BestsellingProductSection = () => {
  // Use the useProducts hook with a filter for bestseller products
  const { 
    products,
    isLoading,
    isError,
    error
  } = useProducts({
    limit: 8,
    bestseller: true // Filter by the bestseller field in the model
  });
  
  return (
    <div className="w-full flex flex-col gap-4 bg-base-100 p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold">Bestselling Products</h2>
        <p className="text-gray-500 text-sm">
          Our most popular products that customers love.
        </p>
      </div>
      
      <ProductList 
        products={products}
        isLoading={isLoading}
        isError={isError}
        error={error}
        emptyMessage="No bestselling products available at the moment"
        className="py-4"
      />
    </div>
  );
};

export default BestsellingProductSection;
