import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { selectCart } from '../slices/cartSlice';

const CartIcon = ({ className = '' }) => {
  const { count } = useSelector(selectCart);
  
  return (
    <Link 
      to="/cart" 
      className={`relative flex items-center justify-center ${className}`}
      aria-label="View your shopping cart"
    >
      <ShoppingCart size={24} />
      {count > 0 && (
        <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-primary text-primary-content text-xs font-bold">
          {count > 99 ? '99+' : count}
        </div>
      )}
    </Link>
  );
};

export default CartIcon; 