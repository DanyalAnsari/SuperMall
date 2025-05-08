import { createSlice } from '@reduxjs/toolkit';
import { cartApi } from '../../../services/api/cartApi';

// Initial state
const initialState = {
  items: [],
  total: 0,
  count: 0,
  loading: false,
  error: null,
  lastUpdated: null,
};

// Create cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Clear cart state (local only)
    clearCartState: (state) => {
      state.items = [];
      state.total = 0;
      state.count = 0;
      state.lastUpdated = new Date().toISOString();
    },

    // Handle cart item calculation locally (for quick UI updates)
    updateCartItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product._id === productId);

      if (existingItem) {
        existingItem.quantity = quantity;
      }

      // Recalculate totals
      state.count = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    // Handle getCart.fulfilled
    builder.addMatcher(
      cartApi.endpoints.getCart.matchFulfilled,
      (state, { payload }) => {
        if (payload.data && payload.data.cart) {
          state.items = payload.data.cart.items || [];
          state.total = payload.data.totalValue || 0;
          state.count = state.items.reduce((total, item) => total + item.quantity, 0);
          state.error = null;
          state.lastUpdated = new Date().toISOString();
        }
      }
    );

    // Handle cart mutations (add, update, remove, clear)
    const cartMutations = [
      cartApi.endpoints.addToCart,
      cartApi.endpoints.updateCartItem,
      cartApi.endpoints.removeFromCart,
      cartApi.endpoints.clearCart,
    ];

    cartMutations.forEach(endpoint => {
      builder
        .addMatcher(endpoint.matchPending, (state) => {
          state.loading = true;
        })
        .addMatcher(endpoint.matchFulfilled, (state, { payload }) => {
          if (payload.data && payload.data.cart) {
            state.items = payload.data.cart.items || [];
            state.total = payload.data.totalValue || 0;
            state.count = state.items.reduce((total, item) => total + item.quantity, 0);
          } else if (payload.data && endpoint.name === 'clearCart') {
            state.items = [];
            state.total = 0;
            state.count = 0;
          }
          state.loading = false;
          state.error = null;
          state.lastUpdated = new Date().toISOString();
        })
        .addMatcher(endpoint.matchRejected, (state, { error }) => {
          state.loading = false;
          state.error = error.message || 'Failed to update cart';
        });
    });
  },
});

// Export actions
export const { 
  setLoading, 
  setError, 
  clearCartState,
  updateCartItemQuantity
} = cartSlice.actions;

// Export cart selector
export const selectCart = (state) => state.cart;

export default cartSlice.reducer; 