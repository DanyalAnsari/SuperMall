import React from 'react';
import { Link } from 'react-router';
import { formatCurrency } from '../../cart/utils/cartUtils';

const SimpleProductCard = ({ product }) => {
  if (!product) return null;
  
  const {
    id,
    name,
    slug,
    price,
    discountedPrice,
    mainImage,
  } = product;
  
  const hasDiscount = discountedPrice && discountedPrice < price;
  
  return (
    <Link to={`/products/${slug || id}`} className="mx-2">
      <div className="card card-compact w-32 h-40 border hover:border-primary transition-colors">
        <figure className="pt-2 px-2">
          <img 
            src={mainImage} 
            alt={name}
            className="h-24 w-full object-contain"
            onError={(e) => {
              e.target.src = '/placeholder-product.jpg';
            }}
          />
        </figure>
        
        <div className="card-body items-center justify-center p-2">
          <p className="text-xs text-center line-clamp-1">{name}</p>
          <p className="text-xs font-medium text-primary">
            {hasDiscount 
              ? formatCurrency(discountedPrice) 
              : formatCurrency(price)
            }
          </p>
        </div>
      </div>
    </Link>
  );
};

export default SimpleProductCard; 