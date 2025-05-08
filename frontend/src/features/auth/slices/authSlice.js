import { createSlice } from "@reduxjs/toolkit";
import { userHelpers } from "@/services/api/userApi";
import { authHelpers } from "@/services/api/authApi";

const user = userHelpers.getCurrentUser();

// Initial state
const initialState = {
  user: user,
  token: localStorage.getItem("token"),
  isAuthenticated: !!user,
  isLoading: false,
  error: null,
};

// Create auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Update user data (e.g., after profile update)
    updateUser: (state, action) => {
      state.user = action.payload;
      // Also update localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    // Login success
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      // Clear localStorage
      authHelpers.logout();
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const {
  setLoading,
  setError,
  updateUser,
  loginSuccess,
  logout,
  clearError,
} = authSlice.actions;

// Export auth selector
export const selectAuth = (state) => state.auth;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated= (state) => state.auth.isAuthenticated;
export const selectCurrentUser = (state) => state.auth.user;

export default authSlice.reducer;
