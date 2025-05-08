import React from "react";
import { useNavigate } from "react-router";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="hero py-16 border-b">
      <div className="hero-content flex-col max-w-4xl">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-normal mb-4">Welcome to Supermall</h1>
            <p className="text-lg text-base-content/70">
              Your one-stop destination for all your shopping needs. Explore a
              wide range of products and enjoy exclusive deals and discounts.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/products")}
              className="btn btn-outline border-black hover:bg-black hover:text-white"
            >
              Shop Now
            </button>
            <button className="btn btn-ghost border hover:bg-base-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
