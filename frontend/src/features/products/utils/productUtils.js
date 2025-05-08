import { formatCurrency } from '../../cart/utils/cartUtils';

/**
 * Format product data for display
 * @param {Object} product - Raw product data
 * @returns {Object} Formatted product data
 */
export const formatProduct = (product) => {
  if (!product) return null;
  
  return {
    id: product._id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    discountedPrice: product.discountedPrice,
    formattedPrice: formatCurrency(product.price),
    formattedDiscountedPrice: product.discountedPrice ? formatCurrency(product.discountedPrice) : null,
    discountPercentage: product.discountPercentage,
    category: product.category?._id || product.category,
    categoryName: product.category?.name || '',
    inStock: product.inStock,
    stock: product.stock,
    images: product.images || [],
    mainImage: product.images?.[0] || '/placeholder-product.jpg',
    specifications: product.specifications || {},
    tags: product.tags || [],
    vendor: product.vendor?._id || product.vendor,
    vendorName: product.vendor?.name || '',
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

/**
 * Build query parameters for product filtering
 * @param {Object} filters - Filter criteria
 * @returns {Object} Params object for API query
 */
export const buildProductQueryParams = (filters = {}) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    inStock,
    page = 1,
    limit = 12,
    ...otherFilters
  } = filters;
  
  const params = {
    page,
    limit,
  };
  
  // Add search
  if (search) {
    params.search = search;
  }
  
  // Add category filter
  if (category) {
    params.category = category;
  }
  
  // Add price range filters
  if (minPrice !== undefined) {
    params['price[gte]'] = minPrice;
  }
  
  if (maxPrice !== undefined) {
    params['price[lte]'] = maxPrice;
  }
  
  // Add sort parameter
  if (sort) {
    params.sort = sort;
  }
  
  // Add in stock filter
  if (inStock !== undefined) {
    params.inStock = inStock;
  }
  
  // Add any other filters
  Object.entries(otherFilters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params[key] = value;
    }
  });
  
  return params;
};

/**
 * Check if a product is on sale
 * @param {Object} product - Product data
 * @returns {Boolean} True if product is on sale
 */
export const isOnSale = (product) => {
  return product?.discountedPrice && product.discountedPrice < product.price;
};

/**
 * Get product price to display (discounted or regular)
 * @param {Object} product - Product data
 * @returns {String} Formatted price
 */
export const getDisplayPrice = (product) => {
  if (isOnSale(product)) {
    return formatCurrency(product.discountedPrice);
  }
  return formatCurrency(product.price);
};

/**
 * Calculate discount percentage
 * @param {Number} originalPrice - Original price
 * @param {Number} discountedPrice - Discounted price
 * @returns {Number} Discount percentage
 */
export const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice || discountedPrice >= originalPrice) {
    return 0;
  }
  
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}; 