import React, { useRef } from "react";
import CategoriesCard from "./CategoriesCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCategories } from "../hooks/useCategories";

const CategorySection = () => {
  const carouselRef = useRef(null);
  
  const { categories, isLoading, isError } = useCategories({
    isActive: true,
    limit: 12,
  });
  
  const handleScrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  const handleScrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  if (isLoading) {
    return (
      <div className="w-full py-10 max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-normal">Categories</h2>
        </div>
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </div>
    );
  }
  
  if (isError || !categories.length) {
    return (
      <div className="w-full py-10 max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-normal">Categories</h2>
        </div>
        <div className="alert alert-info">
          <span>No categories available at the moment.</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full py-10 max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-normal">Categories</h2>
        <div className="join">
          <button 
            className="btn btn-sm btn-ghost join-item btn-circle"
            onClick={handleScrollLeft}
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            className="btn btn-sm btn-ghost join-item btn-circle"
            onClick={handleScrollRight}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div 
        ref={carouselRef}
        className="carousel carousel-center carousel-horizontal w-full h-full py-2"
        style={{ scrollBehavior: 'smooth' }}
      >
        {categories.map((category) => (
          <div className="carousel-item" key={category.id}>
            <CategoriesCard
              id={category.id}
              category={category}
              iconClassName="text-neutral"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
