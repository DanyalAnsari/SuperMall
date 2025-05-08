import { useState, useMemo } from 'react';
import { useGetProductsQuery } from '../../../services/api/productApi';
import { buildProductQueryParams, formatProduct } from '../utils/productUtils';

/**
 * Custom hook for fetching and managing products
 * @param {Object} initialFilters - Initial filter criteria
 * @returns {Object} Products data and filter methods
 */
export const useProducts = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  
  // Build query params from filters
  const queryParams = useMemo(() => buildProductQueryParams(filters), [filters]);
  
  // Fetch products with RTK Query
  const {
    data,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetProductsQuery(queryParams);
  
  // Format products data
  const formattedProducts = useMemo(() => {
    if (!data?.data.products) return [];
    return data.data.products.map((product) => formatProduct(product));
  }, [data]);
  
  // Extract pagination info
  const pagination = data?.data.pagination || { total: 0, page: 1, pages: 1 };
  
  // Set a single filter
  const setFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset to page 1 when filters change
      page: key === 'page' ? value : 1,
    }));
  };
  
  // Update multiple filters at once
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when filters change
      page: newFilters.page || 1,
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: initialFilters.limit || 12,
    });
  };
  
  // Handle page change
  const goToPage = (page) => {
    setFilter('page', page);
  };
  
  return {
    // Data
    products: formattedProducts,
    pagination,
    filters,
    isLoading: isLoading || isFetching,
    isSuccess,
    isError,
    error,
    
    // Methods
    refetch,
    setFilter,
    updateFilters,
    resetFilters,
    goToPage,
  };
}; 