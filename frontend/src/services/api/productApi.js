import baseApi from './api';

// Define product-related API endpoints
export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products with filtering, pagination, sorting
    getProducts: builder.query({
      query: (params = {}) => {
        // Construct query string from params
        const queryParams = new URLSearchParams();
        
        // Add search param if it exists
        if (params.search) {
          queryParams.append('search', params.search);
        }
        
        // Add all other params
        Object.entries(params).forEach(([key, value]) => {
          if (key !== 'search' && value !== undefined) {
            queryParams.append(key, value);
          }
        });
        
        return `/products/?${queryParams.toString()}`;
      },
      providesTags: (result) => {
        return result && result.data && result.data.products
          ? [
              ...result.data.products.map(({ _id }) => ({ type: 'Product', id: _id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }];
      }
    }),
    
    // Get single product by ID or slug
    getProduct: builder.query({
      query: (productId) => `/products/${productId}`,
      providesTags: (result) => 
        result && result.data ? [{ type: 'Product', id: result.data.product._id }] : [],
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
              { type: 'Product', id: 'CATEGORY' },
            ]
          : [{ type: 'Product', id: 'CATEGORY' }],
    }),
    
    // Create new product (protected)
    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    
    // Update product (protected)
    updateProduct: builder.mutation({
      query: ({ productId, ...updateData }) => ({
        url: `/products/${productId}`,
        method: 'PATCH',
        body: updateData,
      }),
      invalidatesTags: (result) => 
        result && result.data ? [{ type: 'Product', id: result.data.product._id }] : [],
    }),
    
    // Delete product (protected)
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductsByCategoryQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi; 