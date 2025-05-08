import React from "react";
import { useNavigate } from "react-router";

const ProductSummaryCard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="card bg-base-100 border">
      <div className="card-body">
        <h2 className="card-title text-base">Order Summary</h2>
        
        <div className="space-y-3 my-4">
          <div className="flex justify-between">
            <span className="opacity-70">Subtotal</span>
            <span>$99.99</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Tax</span>
            <span>$8.00</span>
          </div>
        </div>
        
        <div className="divider my-2"></div>
        
        <div className="flex justify-between font-medium mb-6">
          <span>Total</span>
          <span>$107.99</span>
        </div>
        
        <div className="card-actions">
          <button 
            className="btn btn-primary btn-block"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSummaryCard;
