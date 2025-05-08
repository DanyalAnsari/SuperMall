import React from 'react';
import { Link } from 'react-router';
import { formatCurrency } from '../../cart/utils/cartUtils';
import { ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  if (!product) return null;
  
  const {
    id,
    name,
    price,
    discountedPrice,
    mainImage,
    categoryName,
  } = product;
  
  const hasDiscount = discountedPrice && discountedPrice < price;
  const discountPercentage = hasDiscount 
    ? Math.round(((price - discountedPrice) / price) * 100) 
    : 0;
  
  return (
    <Link to={`/products/${id}`}>
      <div className="card group card-compact w-full border hover:border-primary transition-colors bg-base-100">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="badge badge-sm badge-secondary absolute top-2 right-2 z-10">
            {discountPercentage}% OFF
          </div>
        )}
        
        {/* Product Image */}
        <figure className="pt-3 px-3 relative">
          <img 
            src={mainImage} 
            alt={name}
            className="h-40 w-full object-contain"
            onError={(e) => {
              e.target.src = '/placeholder-product.jpg';
            }}
          />
        </figure>
        
        <div className="card-body items-center text-center p-3">
          {categoryName && (
            <div className="text-xs text-base-content/60">
              {categoryName}
            </div>
          )}
          
          <h2 className="card-title text-sm font-medium line-clamp-1 mb-0">
            {name}
          </h2>
          
          {/* Price */}
          <div className="flex items-center justify-center gap-2 mt-1">
            {hasDiscount ? (
              <>
                <span className="text-primary font-semibold">
                  {formatCurrency(discountedPrice)}
                </span>
                <span className="text-xs line-through text-base-content/60">
                  {formatCurrency(price)}
                </span>
              </>
            ) : (
              <span className="text-primary font-semibold">
                {formatCurrency(price)}
              </span>
            )}
          </div>
          
          {/* Quick add button - shows on hover */}
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              className="btn btn-sm btn-outline btn-primary gap-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Add to cart functionality can be added here
              }}
            >
              <ShoppingBag size={14} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
