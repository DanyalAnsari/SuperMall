// import React from "react";
// import { Navigate } from "react-router-dom";

// //Layouts
// import MainLayout from "./components/layout/MainLayout/MainLayout";
// import VendorLayout from "./components/layout/VendorLayout/VendorLayout";
// import AuthLayout from "./components/layout/AuthLayout/AuthLayout";
// import AdminLayout from "./components/layout/AdminLayout/AdminLayout";

// //Auth Pages
// import Register from "./pages/auth/Register";
// import Login from "./pages/auth/Login";

// //Public Pages
// import Home from "./pages/home/Home";
// import About from "./pages/about/About";
// import Contact from "./pages/contact/Contact";
// import Shop from "./pages/Products";
// import ProductDetail from "./pages/product/ProductDetail";
// import Cart from "./pages/cart/Cart";

// //User Page
// import Profile from "./pages/profile/Profile";
// import Order from "./pages/order/Order";
// import OrderDetails from "./pages/order/OrderDetails";
// import Adresses from "./pages/profile/Adresses";
// import Checkout from "./pages/order/Checkout";
// import OrderConfirmation from "./pages/order/OrderConfirmation";

// //Vendor Pages
// import VendorDashboard from "./pages/vendor/VendorDashboard";
// import VendorProducts from "./pages/vendor/VendorProducts";
// import VendorOrders from "./pages/vendor/VendorOrders";
// import VendorCustomers from "./pages/vendor/VendorCustomers";
// import VendorProductForm from "./pages/vendor/VendorProductForm";

// //Admin Pages
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminUsers from "./pages/admin/AdminUsers";
// import AdminProducts from "./pages/admin/AdminProducts";
// import AdminOrders from "./pages/admin/AdminOrders";
// import AdminCategories from "./pages/admin/AdminCategories";

// //Error Pages
// import NotFoundPage from "./pages/error/NotFoundPage";
// import UnauthorizedPage from "./pages/error/UnauthorizedPage";
// import ServerErrorPage from "./pages/error/ServerErrorPage";

// //Auth Guard Component
// import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute";

// //Route Configuration with nested Route
// const routes = [
//   {
//     path: "/",
//     element: <MainLayout />,
//     children: [
//       { index: true, element: <Home /> },
//       { path: "about", element: <About /> },
//       { path: "contact", element: <Contact /> },
//       {
//         path: "shop",
//         children: [
//           { index: true, element: <Shop /> },
//           { path: ":id", element: <ProductDetail /> },
//           { path: "category/:categoryId", element: <Shop /> },
//         ],
//       },
//       { path: "cart", element: <Cart /> },
//       {
//         path: "checkout",
//         element: (
//           <ProtectedRoute>
//             <Checkout />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "order-confirmation/:id",
//         element: (
//           <ProtectedRoute>
//             <OrderConfirmation />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "profile",
//         element: (
//           <ProtectedRoute>
//             <Profile />
//           </ProtectedRoute>
//         ),
//         children: [
//           { path: "orders", element: <Order /> },
//           { path: "orders/:id", element: <OrderDetails /> },
//           { path: "addresses", element: <Adresses /> },
//         ],
//       },
//     ],
//   },
//   {
//     path: "/auth",
//     element: <AuthLayout />,
//     children: [
//       { path: "login", element: <Login /> },
//       { path: "register", element: <Register /> },
//     ],
//   },
//   {
//     path: "/vendor",
//     element: (
//       <ProtectedRoute requiredRole="vendor">
//         <VendorLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       { index: true, element: <VendorDashboard /> },
//       { path: "produts", element: <VendorProducts /> },
//       { path: "produts/new", element: <VendorProductForm /> },
//       { path: "produts/edit/:id", element: <VendorProductForm /> },
//       { path: "orders", element: <VendorOrders /> },
//       { path: "customers", element: <VendorCustomers /> },
//     ],
//   },
//   {
//     path: "/admin",
//     element: (
//       <ProtectedRoute requiredRole="admin">
//         <AdminLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       { index: true, element: <AdminDashboard /> },
//       { path: "produts", element: <AdminProducts /> },
//       { path: "users", element: <AdminUsers /> },
//       { path: "categorie", element: <AdminCategories /> },
//       { path: "orders", element: <AdminOrders /> },
//     ],
//   },
//   //Error Routes
//   { path: "401", element: <UnauthorizedPage /> },
//   { path: "404", element: <NotFoundPage /> },
//   { path: "500", element: <ServerErrorPage /> },
//   { path: "*", element: <Navigate to="/404" replace /> },
// ];

// export default routes;
