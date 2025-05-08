import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import baseApi from "../services/api/api";
// Import productApi endpoints into the store to register them
import "../services/api/productApi";
import "../services/api/categoryApi";
import authReducer from "../features/auth/slices/authSlice";
import cartReducer from "../features/cart/slices/cartSlice";

// Configure the store
const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    // Add other reducers here
  },
  // Add middleware for RTK Query - only need baseApi middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: true,
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

export default store;
