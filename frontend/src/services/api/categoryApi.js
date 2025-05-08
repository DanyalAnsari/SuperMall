import baseApi from './api';

// Define category-related API endpoints
export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all categories with optional filters
    getCategories: builder.query({
      query: (params = {}) => {
        // Construct query string from params
        const queryParams = new URLSearchParams();
        
        // Add all params
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value);
          }
        });
        
        return `/categories/?${queryParams.toString()}`;
      },
      providesTags: (result) => {
        return result && result.data && result.data.categories
          ? [
              ...result.data.categories.map(({ _id }) => ({ type: 'Category', id: _id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }];
      }
    }),
    
    // Get single category by ID or slug
    getCategory: builder.query({
      query: (categoryId) => `/categories/${categoryId}`,
      providesTags: (result) => 
        result && result.data ? [{ type: 'Category', id: result.data.category._id }] : [],
    }),
    
    // Get products by category ID
    getProductsByCategory: builder.query({
      query: ({ categoryId, ...params }) => {
        // Construct query string from params
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value);
          }
        });
        
        const queryString = queryParams.toString();
        return `/categories/${categoryId}/products${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) => 
        result && result.data
          ? [
              ...result.data.products.map(({ _id }) => ({ type: 'Product', id: _id })),
              { type: 'Category', id: 'PRODUCTS' },
            ]
          : [{ type: 'Category', id: 'PRODUCTS' }],
    }),
    
    // Admin-only mutations (for completeness, may require auth)
    
    // Create new category (protected)
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    
    // Update category (protected)
    updateCategory: builder.mutation({
      query: ({ categoryId, ...updateData }) => ({
        url: `/categories/${categoryId}`,
        method: 'PATCH',
        body: updateData,
      }),
      invalidatesTags: (result) => 
        result && result.data ? [
          { type: 'Category', id: result.data.category._id },
          { type: 'Category', id: 'LIST' }
        ] : [],
    }),
    
    // Delete category (protected)
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetProductsByCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi; 