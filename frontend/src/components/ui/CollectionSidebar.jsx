import React from 'react'
import { Link } from 'react-router'

const CollectionSidebar = () => {
  return (
    <div className="p-4 border-r h-full">
      <div className="collapse collapse-arrow mb-4">
        <input type="checkbox" defaultChecked /> 
        <div className="collapse-title px-0 font-medium">
          Categories
        </div>
        <div className="collapse-content px-0">
          <ul className="menu menu-sm">
            <li><Link to="/product/category/1">Electronics</Link></li>
            <li><Link to="/product/category/2">Clothing</Link></li>
            <li><Link to="/product/category/3">Home & Kitchen</Link></li>
            <li><Link to="/product/category/4">Beauty</Link></li>
            <li><Link to="/product/category/5">Sports</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="collapse collapse-arrow mb-4">
        <input type="checkbox" defaultChecked /> 
        <div className="collapse-title px-0 font-medium">
          Price Range
        </div>
        <div className="collapse-content px-0">
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input type="checkbox" className="checkbox checkbox-sm" /> 
              <span className="label-text">Under $25</span>
            </label>
            <label className="label cursor-pointer justify-start gap-2">
              <input type="checkbox" className="checkbox checkbox-sm" /> 
              <span className="label-text">$25 to $50</span>
            </label>
            <label className="label cursor-pointer justify-start gap-2">
              <input type="checkbox" className="checkbox checkbox-sm" /> 
              <span className="label-text">$50 to $100</span>
            </label>
            <label className="label cursor-pointer justify-start gap-2">
              <input type="checkbox" className="checkbox checkbox-sm" /> 
              <span className="label-text">$100 to $200</span>
            </label>
            <label className="label cursor-pointer justify-start gap-2">
              <input type="checkbox" className="checkbox checkbox-sm" /> 
              <span className="label-text">Over $200</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="collapse collapse-arrow mb-4">
        <input type="checkbox" defaultChecked /> 
        <div className="collapse-title px-0 font-medium">
          Customer Ratings
        </div>
        <div className="collapse-content px-0">
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input type="checkbox" className="checkbox checkbox-sm" /> 
              <div className="rating rating-sm">
                <input type="radio" className="mask mask-star-2" checked disabled />
                <input type="radio" className="mask mask-star-2" checked disabled />
                <input type="radio" className="mask mask-star-2" checked disabled />
                <input type="radio" className="mask mask-star-2" checked disabled />
                <input type="radio" className="mask mask-star-2" checked disabled />
              </div>
            </label>
            <label className="label cursor-pointer justify-start gap-2">
              <input type="checkbox" className="checkbox checkbox-sm" /> 
              <div className="rating rating-sm">
                <input type="radio" className="mask mask-star-2" checked disabled />
                <input type="radio" className="mask mask-star-2" checked disabled />
                <input type="radio" className="mask mask-star-2" checked disabled />
                <input type="radio" className="mask mask-star-2" checked disabled />
                <input type="radio" className="mask mask-star-2" disabled />
                <span className="ml-1 label-text">& Up</span>
              </div>
            </label>
            <label className="label cursor-pointer justify-start gap-2">
              <input type="checkbox" className="checkbox checkbox-sm" /> 
              <div className="rating rating-sm">
                <input type="radio" className="mask mask-star-2" checked disabled />
                <input type="radio" className="mask mask-star-2" checked disabled />
                <input type="radio" className="mask mask-star-2" checked disabled />
                <input type="radio" className="mask mask-star-2" disabled />
                <input type="radio" className="mask mask-star-2" disabled />
                <span className="ml-1 label-text">& Up</span>
              </div>
            </label>
            <label className="label cursor-pointer justify-start gap-2">
              <input type="checkbox" className="checkbox checkbox-sm" /> 
              <div className="rating rating-sm">
                <input type="radio" className="mask mask-star-2" checked disabled />
                <input type="radio" className="mask mask-star-2" checked disabled />
                <input type="radio" className="mask mask-star-2" disabled />
                <input type="radio" className="mask mask-star-2" disabled />
                <input type="radio" className="mask mask-star-2" disabled />
                <span className="ml-1 label-text">& Up</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionSidebar