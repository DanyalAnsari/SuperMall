import React, { useState } from 'react';
import { ShoppingCart, Check, AlertTriangle } from 'lucide-react';
import { useAddToCartMutation } from '../../../services/api/cartApi';
import { useSelector } from 'react-redux';
import { selectCart } from '../slices/cartSlice';
import { isItemInCart, getItemQuantity } from '../utils/cartUtils';
import { useNavigate } from 'react-router';

const AddToCartButton = ({ 
  productId, 
  stock = 0, 
  className = '', 
  showQuantity = false,
  redirectToCart = false
}) => {
  const navigate = useNavigate();
  const { items } = useSelector(selectCart);
  const [quantity, setQuantity] = useState(1);
  const [addToCart, { isLoading }] = useAddToCartMutation();
  
  const isInCart = isItemInCart(items, productId);
  const currentQuantity = getItemQuantity(items, productId);
  const availableStock = stock - currentQuantity;
  
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity >= 1 && newQuantity <= availableStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (availableStock < 1) return;
    
    try {
      await addToCart({ 
        productId, 
        quantity: quantity 
      });
      
      if (redirectToCart) {
        navigate('/cart');
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  // Out of stock
  if (availableStock < 1) {
    return (
      <button 
        className={`btn btn-disabled ${className}`}
        disabled
      >
        <AlertTriangle size={16} className="mr-2" />
        Out of Stock
      </button>
    );
  }

  // Already in cart
  if (isInCart && !showQuantity) {
    return (
      <button 
        onClick={() => navigate('/cart')}
        className={`btn btn-outline btn-success ${className}`}
      >
        <Check size={16} className="mr-2" />
        In Cart
      </button>
    );
  }

  return (
    <div className={`flex ${showQuantity ? 'flex-row' : 'w-full'}`}>
      {showQuantity && (
        <div className="join">
          <button 
            className="btn btn-sm join-item" 
            onClick={() => quantity > 1 && setQuantity(q => q - 1)}
            disabled={quantity <= 1}
          >
            -
          </button>
          <input 
            type="number" 
            className="input input-sm join-item w-16 text-center" 
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            max={availableStock}
          />
          <button 
            className="btn btn-sm join-item" 
            onClick={() => quantity < availableStock && setQuantity(q => q + 1)}
            disabled={quantity >= availableStock}
          >
            +
          </button>
        </div>
      )}
      
      <button 
        onClick={handleAddToCart}
        disabled={isLoading || availableStock < 1}
        className={`btn btn-primary ${className} ${showQuantity ? 'ml-2' : 'w-full'} ${isLoading ? 'loading' : ''}`}
      >
        {!isLoading && <ShoppingCart size={16} className="mr-2" />}
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCartButton; 