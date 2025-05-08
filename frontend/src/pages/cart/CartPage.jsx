import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ShoppingCart, ArrowLeft, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/features/cart/hooks/useCart";
import { useAuth } from "@/features/auth/hook/useAuth";
import { formatCurrency } from "@/features/cart/utils/cartUtils";

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    items,
    total,
    loading,
    error,
    updateCartItem,
    removeFromCart,
    clearCart,
    clearLoading,
    shipping,
    grandTotal,
  } = useCart();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login?redirect=/cart");
    }
  }, [isAuthenticated, navigate]);

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await updateCartItem(productId, quantity);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Empty cart state
  if (!loading && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingCart className="mr-2" /> Shopping Cart
        </h1>

        <div className="card shadow-xl bg-base-100">
          <div className="card-body items-center text-center py-12">
            <ShoppingBag size={64} className="text-base-300 mb-4" />
            <h2 className="card-title text-xl mb-2">Your cart is empty</h2>
            <p className="text-base-content/70 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingCart className="mr-2" /> Shopping Cart
        </h1>

        <div className="card shadow-md bg-base-100">
          <div className="card-body">
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <ShoppingCart className="mr-2" /> Shopping Cart
      </h1>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="card shadow-md bg-base-100">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">Items ({items.length})</h2>
                <button
                  onClick={handleClearCart}
                  disabled={clearLoading || loading}
                  className="btn btn-ghost btn-sm text-error gap-1"
                >
                  <Trash2 size={16} /> Clear Cart
                </button>
              </div>

              <div className="divide-y divide-base-300">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveItem}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </div>

              <div className="mt-6">
                <Link to="/products" className="btn btn-ghost btn-sm gap-1">
                  <ArrowLeft size={16} /> Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="card shadow-md bg-base-100 sticky top-4">
            <div className="card-body">
              <h2 className="card-title mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between font-bold text-lg pt-3 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  className="btn btn-primary w-full"
                  disabled={loading || items.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
