import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SimpleProductCard from './SimpleProductCard';
import { useProducts } from '../hooks/useProducts';

const FeaturedProductsCarousel = () => {
  const {
    products,
    isLoading,
    isError,
  } = useProducts({
    limit: 12,
    featured: true,
  });
  
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-6">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }
  
  if (isError || products.length === 0) {
    return null;
  }
  
  return (
    <div className="w-full py-8 max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-normal">Featured Products</h2>
        <div className="join">
          <button 
            className="btn btn-sm btn-ghost join-item btn-circle"
            onClick={() => {
              const carousel = document.getElementById('featured-carousel');
              carousel.scrollBy({ left: -200, behavior: 'smooth' });
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            className="btn btn-sm btn-ghost join-item btn-circle"
            onClick={() => {
              const carousel = document.getElementById('featured-carousel');
              carousel.scrollBy({ left: 200, behavior: 'smooth' });
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      
      <div 
        id="featured-carousel"
        className="carousel carousel-center carousel-horizontal w-full h-full py-2"
        style={{ scrollBehavior: 'smooth' }}
      >
        {products.map((product) => (
          <div className="carousel-item" key={product.id}>
            <SimpleProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProductsCarousel; 