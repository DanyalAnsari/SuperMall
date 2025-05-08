import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ 
  products = [], 
  isLoading = false, 
  isError = false, 
  error = null,
  emptyMessage = "No products found",
  className = ""
}) => {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="w-full py-8">
        <div className="alert alert-error">
          <span>Error loading products: {error?.data?.message || "Unknown error"}</span>
        </div>
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <div className="w-full py-8">
        <div className="alert alert-info">
          <span>{emptyMessage}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList; 