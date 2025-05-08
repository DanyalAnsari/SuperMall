import React from 'react';
import { Plus, Edit, Trash2, Home, Briefcase } from 'lucide-react';

const Addresses = () => {
  // Mock address data
  const addresses = [
    {
      id: 1,
      type: 'Home',
      default: true,
      name: 'John Doe',
      address: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '+1 (234) 567-890'
    },
    {
      id: 2,
      type: 'Work',
      default: false,
      name: 'John Doe',
      address: '456 Business Ave, Suite 200',
      city: 'New York',
      state: 'NY',
      zipCode: '10011',
      country: 'United States',
      phone: '+1 (234) 567-890'
    }
  ];

  const getAddressIcon = (type) => {
    if (type === 'Home') return <Home size={18} />;
    if (type === 'Work') return <Briefcase size={18} />;
    return null;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Addresses</h2>
        <button className="btn btn-primary btn-sm">
          <Plus size={16} className="mr-1" />
          Add New Address
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map(address => (
          <div key={address.id} className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="badge badge-outline gap-1">
                    {getAddressIcon(address.type)}
                    {address.type}
                  </div>
                  {address.default && (
                    <div className="badge badge-primary">Default</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-xs">
                    <Edit size={14} />
                  </button>
                  <button className="btn btn-ghost btn-xs text-error">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div className="text-sm space-y-1">
                <p className="font-semibold">{address.name}</p>
                <p>{address.address}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
                <p className="mt-2">{address.phone}</p>
              </div>
              
              {!address.default && (
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-sm btn-outline">Set as Default</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {addresses.length === 0 && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-base-200 mb-4">
              <MapPin size={24} />
            </div>
            <h3 className="card-title">No Addresses Saved</h3>
            <p className="mb-4">You haven't added any shipping addresses yet.</p>
            <button className="btn btn-primary">
              <Plus size={16} className="mr-1" />
              Add New Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;