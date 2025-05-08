import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { useSelector } from 'react-redux';

// Create a base API with common settings
const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api`,
    prepareHeaders: (headers) => {
      // Get the token from localStorage
      const token =localStorage.getItem('token');
      
      // If token exists, add it to the headers
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      headers.set('Content-Type', 'application/json');
      return headers;
    },
    credentials: 'include', // Important for cookies
  }),
  endpoints: () => ({}),
  tagTypes: ['User', 'Cart', 'Product', 'Order', 'Category'],
});

export default baseApi; 