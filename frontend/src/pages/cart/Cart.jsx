import CartList from "@/features/cart/components/CartList";
import ProductSummaryCard from "@/features/cart/components/ProductSummaryCard";
import React from "react";

const Cart = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-medium mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card bg-base-100">
            <div className="card-body p-0">
              <CartList />
            </div>
          </div>
        </div>
        <div>
          <ProductSummaryCard />
        </div>
      </div>
    </div>
  );
};

export default Cart;
