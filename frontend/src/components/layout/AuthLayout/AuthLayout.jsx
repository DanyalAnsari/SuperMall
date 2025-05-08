import React from 'react';
import { Outlet, Link } from 'react-router';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost gap-2">
              <ArrowLeft size={18} />
              Back to Home
            </Link>
          </div>
          <div className="flex-none">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <ShoppingBag size={20} className="text-primary" />
              SuperMall
            </Link>
          </div>
        </div>
      </div>
      
      <div className="flex-grow flex items-center justify-center py-8">
        <Outlet />
      </div>
      
      <footer className="footer footer-center p-4 bg-base-100 text-base-content">
        <div>
          <p className="text-sm">© {new Date().getFullYear()} SuperMall. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;