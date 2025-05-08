import baseApi from "./api";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user (for checking auth status)
    getCurrentUser: builder.query({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),
    updateCurrentUserDetails: builder.mutation({
      query: (data) => ({
        url: "users/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateUserPassword: builder.mutation({
      query: (data) => ({
        url: "users/update-password",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetCurrentUserQuery,
  useUpdateCurrentUserDetailsMutation,
  useUpdateUserPasswordMutation,
} = userApi;

export const userHelpers = {
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      localStorage.removeItem("user");
      return null;
    }
  },
};
