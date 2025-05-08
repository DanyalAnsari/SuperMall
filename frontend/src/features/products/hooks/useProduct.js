import { useMemo } from 'react';
import { useGetProductQuery } from '../../../services/api/productApi';
import { formatProduct, isOnSale, getDisplayPrice } from '../utils/productUtils';
import { useCart } from '../../cart/hooks/useCart';

/**
 * Custom hook for fetching and managing a single product
 * @param {string} productId - Product ID or slug
 * @returns {Object} Product data and related methods
 */
export const useProduct = (productId) => {
  // Fetch product with RTK Query
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetProductQuery(productId, {
    skip: !productId
  });
  
  // Get cart methods to check if product is in cart
  const { isInCart, getQuantity, addToCart } = useCart();
  
  // Format product data
  const product = useMemo(() => {
    if (!data?.data?.product) return null;
    return formatProduct(data.data.product);
  }, [data]);
  
  // Check if product is on sale
  const onSale = useMemo(() => {
    return isOnSale(product);
  }, [product]);
  
  // Get formatted display price
  const displayPrice = useMemo(() => {
    if (!product) return '';
    return getDisplayPrice(product);
  }, [product]);
  
  // Get similar products (placeholder for future implementation)
  const similarProducts = useMemo(() => {
    // This would be implemented with another API call in a real app
    return [];
  }, []);
  
  // Check if product is in cart
  const inCart = useMemo(() => {
    if (!product) return false;
    return isInCart(product.id);
  }, [product, isInCart]);
  
  // Get quantity in cart
  const quantityInCart = useMemo(() => {
    if (!product) return 0;
    return getQuantity(product.id);
  }, [product, getQuantity]);
  
  // Add to cart helper
  const handleAddToCart = (quantity = 1) => {
    if (!product) return;
    addToCart(product.id, quantity);
  };
  
  return {
    // Data
    product,
    onSale,
    displayPrice,
    similarProducts,
    inCart,
    quantityInCart,
    isLoading,
    isSuccess,
    isError,
    error,
    
    // Methods
    refetch,
    addToCart: handleAddToCart,
  };
}; 