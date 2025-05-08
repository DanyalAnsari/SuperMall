import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useProduct } from "@/features/products/hooks/useProduct";
import Carousel from "@/components/ui/Carousel";
import { ShoppingBag, Heart, Share2, ArrowLeft } from "lucide-react";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  const { 
    product, 
    isLoading, 
    isError, 
    error, 
    onSale,
    addToCart 
  } = useProduct(id);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center">
          <div className="alert alert-error">
            <span>Error loading product: {error?.data?.message || "Product not found"}</span>
          </div>
          <button 
            className="btn btn-outline mt-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="alert alert-warning">
          <span>Product not found</span>
        </div>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(quantity);
  };
  
  const handleBuyNow = () => {
    addToCart(quantity);
    navigate('/cart');
  };
  
  return (
    <div className="mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        <div>
          <Carousel images={product.images} />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <div className="badge badge-ghost mb-2">{product.categoryName}</div>
            <h1 className="text-2xl font-medium mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="rating rating-sm">
                <input type="radio" className="mask mask-star-2" disabled />
                <input type="radio" className="mask mask-star-2" disabled />
                <input type="radio" className="mask mask-star-2" disabled />
                <input type="radio" className="mask mask-star-2" checked disabled />
                <input type="radio" className="mask mask-star-2" disabled />
              </div>
              <span className="text-sm opacity-70 ml-2">(24 reviews)</span>
            </div>
            <p className="opacity-80">{product.description}</p>
          </div>
          
          <div className="text-xl font-semibold">
            {onSale ? (
              <>
                {product.formattedDiscountedPrice}
                <span className="text-sm opacity-60 line-through ml-2">
                  {product.formattedPrice}
                </span>
              </>
            ) : (
              product.formattedPrice
            )}
          </div>
          
          <div className="divider"></div>
          
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Quantity</span>
              </div>
              <input 
                type="number" 
                className="input input-bordered w-20" 
                min="1" 
                max={product.stock} 
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </label>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button 
              className="btn btn-primary"
              onClick={handleBuyNow}
              disabled={!product.inStock || product.stock <= 0}
            >
              <ShoppingBag size={16} />
              Buy Now
            </button>
            <button 
              className="btn btn-outline"
              onClick={handleAddToCart}
              disabled={!product.inStock || product.stock <= 0}
            >
              <ShoppingBag size={16} />
              Add to Cart
            </button>
            <button className="btn btn-square btn-outline">
              <Heart size={16} />
            </button>
            <button className="btn btn-square btn-outline">
              <Share2 size={16} />
            </button>
          </div>
          
          {(!product.inStock || product.stock <= 0) && (
            <div className="alert alert-warning mt-2">
              <span>This product is currently out of stock</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
