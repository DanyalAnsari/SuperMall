import React from 'react';
import { Link } from 'react-router';
import { Eye, FileDown, ShoppingBag } from 'lucide-react';

const Orders = () => {
  // Mock order data
  const orders = [
    {
      id: "ORD-2023-1001",
      date: "October 15, 2023",
      total: "$239.50",
      status: "Delivered",
      items: 3
    },
    {
      id: "ORD-2023-0985",
      date: "September 28, 2023",
      total: "$124.99",
      status: "Delivered",
      items: 2
    },
    {
      id: "ORD-2023-0842",
      date: "August 12, 2023",
      total: "$349.95",
      status: "Delivered",
      items: 4
    },
    {
      id: "ORD-2023-0751",
      date: "July 5, 2023",
      total: "$89.99",
      status: "Delivered",
      items: 1
    },
    {
      id: "ORD-2023-1042",
      date: "October 30, 2023",
      total: "$178.50",
      status: "Processing",
      items: 2
    }
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
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      
      <div>
        {orders.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="hover">
                      <td className="font-medium">{order.id}</td>
                      <td>{order.date}</td>
                      <td>{order.total}</td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>
                        <div className="flex gap-2">
                          <Link to={`/profile/orders/${order.id}`} className="btn btn-sm btn-ghost">
                            <Eye size={16} className="mr-1" />
                            View
                          </Link>
                          <button className="btn btn-sm btn-ghost">
                            <FileDown size={16} className="mr-1" />
                            Invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-center mt-6">
              <div className="join">
                <button className="join-item btn btn-outline" disabled>&laquo;</button>
                <button className="join-item btn btn-active">1</button>
                <button className="join-item btn btn-outline">2</button>
                <button className="join-item btn btn-outline">3</button>
                <button className="join-item btn btn-outline">&raquo;</button>
              </div>
            </div>
          </>
        ) : (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-base-200 mb-4">
                <ShoppingBag size={24} />
              </div>
              <h3 className="card-title">No Orders Yet</h3>
              <p className="mb-4">You haven't placed any orders yet.</p>
              <Link to="/product" className="btn btn-primary">Start Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;