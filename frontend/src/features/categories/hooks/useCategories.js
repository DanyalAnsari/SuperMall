import { useState, useMemo } from 'react';
import { useGetCategoriesQuery } from '../../../services/api/categoryApi';
import { formatCategory } from '../utils/categoryUtils';

/**
 * Custom hook for fetching and managing categories
 * @param {Object} initialFilters - Initial filter criteria
 * @returns {Object} Categories data and filter methods
 */
export const useCategories = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  
  // Fetch categories with RTK Query
  const {
    data,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetCategoriesQuery(filters);
  
  // Format categories data
  const formattedCategories = useMemo(() => {
    if (!data?.data?.categories) return [];
    return data.data.categories.map((category) => formatCategory(category));
  }, [data]);
  
  // Extract pagination info
  const pagination = data?.data?.pagination || { total: 0, page: 1, pages: 1 };
  
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
  
  return {
    // Data
    categories: formattedCategories,
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
  };
}; 