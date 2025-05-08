import React from 'react';
import { Link } from 'react-router';
import { useCategories } from '../hooks/useCategories';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const CategoryItem = ({ category, isChild = false }) => {
  // Get the icon component dynamically from Lucide
  const IconComponent = category.icon && LucideIcons[category.icon] 
    ? LucideIcons[category.icon] 
    : LucideIcons.ShoppingBag;

  return (
    <li className={`${isChild ? 'ml-4' : ''}`}>
      <Link 
        to={`/categories/${category.slug || category.id}`}
        className="flex items-center py-2 px-3 rounded hover:bg-base-200 transition-colors"
      >
        <div className="w-6 h-6 mr-2 flex items-center justify-center text-primary">
          <IconComponent size={18} />
        </div>
        <span className="flex-grow">{category.name}</span>
        {category.children && category.children.length > 0 && (
          <ChevronRight size={16} className="text-base-content/60" />
        )}
      </Link>
      
      {category.children && category.children.length > 0 && (
        <ul className="ml-4">
          {category.children.map((child) => (
            <CategoryItem key={child.id} category={child} isChild />
          ))}
        </ul>
      )}
    </li>
  );
};

const CategoryList = ({ className = '', showLoading = true }) => {
  const { categoriesTree, isLoading, isError, error } = useCategories();
  
  if (isLoading && showLoading) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="alert alert-error shadow-sm">
          <span>Failed to load categories: {error?.data?.message || 'Unknown error'}</span>
        </div>
      </div>
    );
  }
  
  if (!categoriesTree.length) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="alert alert-info shadow-sm">
          <span>No categories found</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <h3 className="font-medium text-lg mb-2">Categories</h3>
      <ul className="menu menu-xs">
        {categoriesTree.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </ul>
    </div>
  );
};

export default CategoryList; 