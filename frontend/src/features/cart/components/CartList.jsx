import products from "@/assets/data/products";
import { Trash } from "lucide-react";
import React from "react";

const CartList = () => {
  const productList = products.slice(0, 4);
  
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {productList.map((product, index) => (
            <tr key={index}>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm opacity-60">{product.category}</div>
                  </div>
                </div>
              </td>
              <td>
                <div>
                  ${product.price}
                  {product.discountedPrice && (
                    <div className="text-sm opacity-60 line-through">
                      ${product.discountedPrice}
                    </div>
                  )}
                </div>
              </td>
              <td>
                <input
                  type="number"
                  className="input input-bordered input-sm w-16"
                  min="1"
                  defaultValue="1"
                  max={product.stock}
                />
              </td>
              <td className="font-medium">
                ${product.price}
              </td>
              <td>
                <button className="btn btn-ghost btn-circle btn-sm">
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartList;
