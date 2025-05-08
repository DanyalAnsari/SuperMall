import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();

  const onsubmit = (data) => {
    console.log("Form submitted", data);
    navigate("/order-confirmation");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-medium mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div className="card bg-base-100 border mb-6">
              <div className="card-body">
                <h2 className="card-title text-base">Shipping Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">First Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      {...register("name")}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Last Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Address</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">City</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">ZIP / Postal Code</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 border mb-6">
              <div className="card-body">
                <h2 className="card-title text-base">Payment Method</h2>

                <div className="mt-4 space-y-4">
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-3">
                      <input
                        type="radio"
                        name="payment-method"
                        className="radio"
                        checked
                      />
                      <span className="label-text">Credit Card</span>
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-3">
                      <input
                        type="radio"
                        name="payment-method"
                        className="radio"
                      />
                      <span className="label-text">PayPal</span>
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-3">
                      <input
                        type="radio"
                        name="payment-method"
                        className="radio"
                      />
                      <span className="label-text">Apple Pay</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Card Number</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="XXXX XXXX XXXX XXXX"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Expiration Date</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="MM/YY"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Security Code</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="CVC"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 border">
              <div className="card-body">
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" className="checkbox" required />
                    <span className="label-text">
                      I agree to the Terms and Conditions
                    </span>
                  </label>
                </div>

                <div className="card-actions mt-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div>
          <div className="card bg-base-100 border sticky top-6">
            <div className="card-body">
              <h2 className="card-title text-base">Order Summary</h2>

              <div className="divider my-2"></div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src="https://placehold.co/80x80" alt="Product" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Wireless Headphones</div>
                    <div className="text-sm opacity-60">Qty: 1</div>
                  </div>
                  <div className="font-medium">$99.99</div>
                </div>
              </div>

              <div className="divider my-2"></div>

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

              <div className="divider my-2"></div>

              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>$107.99</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
