import React from 'react';
import { ArrowLeft, FileDown, Truck, Package, CheckCircle } from 'lucide-react';
import { Link, useParams } from 'react-router';

const OrderDetail = () => {
  const { orderId } = useParams();
  
  // Mock specific order data
  const order = {
    id: orderId || "ORD-2023-1001",
    date: "October 15, 2023",
    total: "$239.50",
    subtotal: "$219.50",
    shipping: "$10.00",
    tax: "$10.00",
    status: "Delivered",
    trackingNumber: "TRK928374651",
    shippingAddress: {
      name: "John Doe",
      address: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States"
    },
    items: [
      {
        id: 1,
        name: "Wireless Bluetooth Speaker",
        price: "$49.00",
        quantity: 1,
        image: "/api/placeholder/80/80"
      },
      {
        id: 2,
        name: "Designer Reading Glasses",
        price: "$34.99",
        quantity: 2,
        image: "/api/placeholder/80/80"
      },
      {
        id: 3,
        name: "Outdoor Camping Tent",
        price: "$99.00",
        quantity: 1,
        image: "/api/placeholder/80/80"
      }
    ]
  };

  // Order status steps
  const orderSteps = [
    { id: 1, label: "Order Placed", icon: <Package size={18} />, complete: true },
    { id: 2, label: "Processing", icon: <Package size={18} />, complete: true },
    { id: 3, label: "Shipped", icon: <Truck size={18} />, complete: true },
    { id: 4, label: "Delivered", icon: <CheckCircle size={18} />, complete: order.status === "Delivered" }
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      "Delivered": "badge-success",
      "Processing": "badge-warning",
      "Shipped": "badge-info",
      "Cancelled": "badge-error"
    };
    
    return (
      <span className={`badge ${statusStyles[status] || "badge-ghost"}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <Link to="/profile/orders" className="btn btn-ghost btn-sm mb-6">
        <ArrowLeft size={16} className="mr-2" />
        Back to Orders
      </Link>
      
      <div className="flex flex-wrap justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">Order {order.id}</h2>
          <p className="text-sm text-base-content/70">Placed on {order.date}</p>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <span className="badge badge-outline">{order.items.length} Items</span>
          {getStatusBadge(order.status)}
          <button className="btn btn-outline btn-sm">
            <FileDown size={16} className="mr-1" />
            Invoice
          </button>
        </div>
      </div>
      
      {/* Order Progress */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body">
          <h3 className="font-bold text-lg mb-4">Order Status</h3>
          
          <ul className="steps steps-vertical md:steps-horizontal w-full">
            {orderSteps.map((step) => (
              <li 
                key={step.id}
                className={`step ${step.complete ? 'step-primary' : ''}`}
                data-content={step.complete ? "✓" : step.id}
              >
                {step.label}
              </li>
            ))}
          </ul>
          
          {order.trackingNumber && (
            <div className="mt-4 p-3 bg-base-200 rounded-lg">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck size={18} />
                  <span className="font-medium">Tracking Number:</span>
                </div>
                <code className="bg-base-300 px-2 py-1 rounded">{order.trackingNumber}</code>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Order Items */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body">
          <h3 className="font-bold text-lg mb-4">Order Items</h3>
          
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="text-right">Price</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right">{item.price}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">
                      ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Order Summary and Shipping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="font-bold text-lg mb-4">Shipping Address</h3>
            <div className="text-sm space-y-1">
              <p className="font-semibold">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{order.tax}</span>
              </div>
              <div className="divider my-2"></div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{order.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;