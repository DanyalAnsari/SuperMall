/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Calculate item subtotal
 * @param {object} item - Cart item
 * @returns {number} Subtotal
 */
export const calculateItemSubtotal = (item) => {
  return item.price * item.quantity;
};

/**
 * Calculate total cart items count
 * @param {Array} items - Cart items
 * @returns {number} Total items count
 */
export const calculateTotalItems = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Calculate cart total
 * @param {Array} items - Cart items
 * @returns {number} Cart total
 */
export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => total + calculateItemSubtotal(item), 0);
};

/**
 * Check if item exists in cart
 * @param {Array} items - Cart items
 * @param {string} productId - Product ID to check
 * @returns {boolean} True if item exists
 */
export const isItemInCart = (items, productId) => {
  return items.some(item => item.product._id === productId);
};

/**
 * Get item quantity in cart
 * @param {Array} items - Cart items
 * @param {string} productId - Product ID to check
 * @returns {number} Item quantity
 */
export const getItemQuantity = (items, productId) => {
  const item = items.find(item => item.product._id === productId);
  return item ? item.quantity : 0;
};

/**
 * Prepare cart item for display
 * @param {object} item - Cart item
 * @returns {object} Formatted cart item
 */
export const formatCartItem = (item) => {
  return {
    id: item.product._id,
    name: item.name || item.product.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image || (item.product.images && item.product.images[0]),
    subtotal: calculateItemSubtotal(item),
    stock: item.product.stock || 0,
  };
};

/**
 * Calculate shipping cost based on cart total
 * @param {number} total - Cart total
 * @returns {number} Shipping cost
 */
export const calculateShipping = (total) => {
  if (total >= 100) return 0; // Free shipping over $100
  return 10; // Base shipping rate
};

/**
 * Calculate tax amount
 * @param {number} subtotal - Cart subtotal
 * @param {number} taxRate - Tax rate (default: 0.1 for 10%)
 * @returns {number} Tax amount
 */
export const calculateTax = (subtotal, taxRate = 0.1) => {
  return subtotal * taxRate;
};

/**
 * Validate cart item quantity against stock
 * @param {number} quantity - Requested quantity
 * @param {number} stock - Available stock
 * @returns {number} Valid quantity
 */
export const validateQuantity = (quantity, stock) => {
  return Math.min(Math.max(1, quantity), stock);
};

/**
 * Check if requested quantity is available
 * @param {number} quantity - Requested quantity
 * @param {object} product - Product object
 * @returns {boolean} True if quantity is available
 */
export const isQuantityAvailable = (quantity, product) => {
  return product.stock >= quantity;
};