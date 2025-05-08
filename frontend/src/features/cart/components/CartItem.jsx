import React from 'react';
import { Trash, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { formatCurrency } from '../utils/cartUtils';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= item.stock) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center py-4 border-b border-base-300">
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0">
        <Link to={`/products/${item.id}`}>
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover rounded-md"
            onError={(e) => {
              e.target.src = '/placeholder.jpg';
            }}
          />
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex-grow ml-4">
        <Link to={`/products/${item.id}`} className="font-medium hover:text-primary">
          {item.name}
        </Link>
        <div className="text-sm text-base-content/70">
          {formatCurrency(item.price)} each
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center mr-4">
        <button 
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="btn btn-xs btn-circle btn-ghost"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>

        <span className="w-10 text-center">
          {item.quantity}
        </span>

        <button 
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={item.quantity >= item.stock}
          className="btn btn-xs btn-circle btn-ghost"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right w-24 font-medium">
        {formatCurrency(item.subtotal)}
      </div>

      {/* Remove Button */}
      <button 
        onClick={() => onRemove(item.id)} 
        className="ml-4 btn btn-ghost btn-xs btn-circle text-error hover:bg-error hover:bg-opacity-10"
        aria-label="Remove item"
      >
        <Trash size={16} />
      </button>
    </div>
  );
};

export default CartItem; 