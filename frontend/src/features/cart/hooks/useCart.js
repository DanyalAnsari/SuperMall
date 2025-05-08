import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { selectCart, updateCartItemQuantity } from '../slices/cartSlice';
import { 
  useGetCartQuery, 
  useAddToCartMutation, 
  useUpdateCartItemMutation, 
  useRemoveFromCartMutation, 
  useClearCartMutation 
} from '../../../services/api/cartApi';
import { selectAuth } from '../../auth/slices/authSlice';
import { 
  formatCartItem, 
  isItemInCart, 
  getItemQuantity,
  calculateShipping,
  calculateTax,
  validateQuantity,
  isQuantityAvailable 
} from '../utils/cartUtils';

/**
 * Custom hook for cart functionality
 * @returns {Object} Cart methods and data
 */
export const useCart = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(selectAuth);
  const { items, total, count, loading, error } = useSelector(selectCart);
  
  // RTK Query hooks
  const { refetch } = useGetCartQuery(undefined, { 
    skip: !isAuthenticated 
  });
  const [addToCartMutation, addState] = useAddToCartMutation();
  const [updateCartItemMutation, updateState] = useUpdateCartItemMutation();
  const [removeFromCartMutation, removeState] = useRemoveFromCartMutation();
  const [clearCartMutation, clearState] = useClearCartMutation();

  // Auto-fetch cart when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  /**
   * Add item to cart
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to add
   */
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) return;
    
    try {
      await addToCartMutation({ productId, quantity });
    } catch (error) {
      console.error('Add to cart failed:', error);
    }
  };

  /**
   * Update cart item quantity
   * @param {string} productId - Product ID
   * @param {number} quantity - New quantity
   */
  const updateCartItem = async (productId, quantity) => {
    if (!isAuthenticated) return;
    
    try {
      const item = items.find(item => item.product._id === productId);
      if (!item) return;

      // Validate quantity against stock
      const validQuantity = validateQuantity(quantity, item.product.stock);
      if (!isQuantityAvailable(validQuantity, item.product)) {
        throw new Error('Requested quantity not available');
      }

      // Optimistic update for better UX
      dispatch(updateCartItemQuantity({ productId, quantity: validQuantity }));
      await updateCartItemMutation({ productId, quantity: validQuantity });
    } catch (error) {
      console.error('Update cart failed:', error);
      // Refetch actual state on error
      refetch();
    }
  };

  /**
   * Remove item from cart
   * @param {string} productId - Product ID
   */
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
    
    try {
      await removeFromCartMutation(productId);
    } catch (error) {
      console.error('Remove from cart failed:', error);
    }
  };

  /**
   * Clear entire cart
   */
  const clearCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      await clearCartMutation();
    } catch (error) {
      console.error('Clear cart failed:', error);
    }
  };

  /**
   * Check if product is in cart
   * @param {string} productId - Product ID
   * @returns {boolean} True if in cart
   */
  const isInCart = (productId) => {
    return isItemInCart(items, productId);
  };

  /**
   * Get product quantity in cart
   * @param {string} productId - Product ID
   * @returns {number} Quantity
   */
  const getQuantity = (productId) => {
    return getItemQuantity(items, productId);
  };

  // Format cart items for easier access
  const formattedItems = items.map(item => formatCartItem(item));

  // Calculate additional costs
  const shipping = calculateShipping(total);
  const tax = calculateTax(total);
  const grandTotal = total + shipping + tax;

  return {
    // Cart data
    items: formattedItems,
    rawItems: items,
    total,
    count,
    loading,
    error,
    
    // API-related states
    addLoading: addState.isLoading,
    updateLoading: updateState.isLoading,
    removeLoading: removeState.isLoading,
    clearLoading: clearState.isLoading,
    
    // Methods
    refetch,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    isInCart,
    getQuantity,
    shipping,
    tax,
    grandTotal,
  };
};