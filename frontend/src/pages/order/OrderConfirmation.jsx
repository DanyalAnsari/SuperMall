import React from 'react'
import { Link } from 'react-router'
import { CheckCircle, ShoppingBag, Truck } from 'lucide-react'

const OrderConfirmation = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="mb-8 flex justify-center">
        <CheckCircle className="text-success w-20 h-20" />
      </div>
      
      <h1 className="text-3xl font-medium mb-4">Order Confirmed!</h1>
      <p className="text-lg opacity-70 mb-8">
        Your order #ORD-2023-1042 has been successfully placed.
      </p>
      
      <div className="card bg-base-100 border mb-8">
        <div className="card-body">
          <h2 className="card-title text-base justify-center">Order Details</h2>
          
          <div className="divider"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="font-medium">Order Number</p>
              <p className="opacity-70">ORD-2023-1042</p>
            </div>
            <div>
              <p className="font-medium">Payment Method</p>
              <p className="opacity-70">Credit Card (ending in 4242)</p>
            </div>
            <div>
              <p className="font-medium">Order Date</p>
              <p className="opacity-70">November 15, 2023</p>
            </div>
          </div>
          
          <div className="divider"></div>
          
          <div className="flex items-center justify-center gap-2">
            <Truck size={18} />
            <p>
              Your order will be shipped within 1-2 business days.
            </p>
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 border mb-12">
        <div className="card-body">
          <h2 className="card-title text-base justify-center">Order Summary</h2>
          
          <div className="divider"></div>
          
          <div className="space-y-3">
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
          
          <div className="divider"></div>
          
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>$107.99</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/profile/orders" className="btn btn-primary">
          <ShoppingBag size={18} className="mr-2" />
          View Order
        </Link>
        <Link to="/" className="btn btn-outline">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default OrderConfirmation