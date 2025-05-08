import React from "react";
import { Link } from "react-router";

const CollectionHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="breadcrumbs text-sm">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/collections">Collections</Link></li>
          <li>All Products</li>
        </ul>
      </div>
      <select className="select select-bordered select-sm w-auto min-w-[160px]">
        <option disabled selected>Sort by</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
        <option>Newest First</option>
        <option>Top Rated</option>
      </select>
    </div>
  );
};

export default CollectionHeader;
