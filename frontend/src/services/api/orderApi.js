import baseApi from "./api";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserOrders: builder.query({
      query: () => "/orders",
      providesTags: ["Order"],
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        body: data,
      }),
    }),
    getOrderById: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    updateOrderPayment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/orders/${id}/pay`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetUserOrdersQuery,
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useUpdateOrderPaymentMutation,
} = orderApi;
