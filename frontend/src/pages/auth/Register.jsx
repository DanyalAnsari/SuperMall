import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Mail, Lock, User, Phone, ShieldCheck, UserPlus,
  MapPin, Building, Map, Hash, Flag,
} from "lucide-react";
import { useForm } from "react-hook-form";
import Input from "@/features/auth/components/Input";
import PasswordInput from "@/features/auth/components/PasswordInput";
import { useAuth } from "@/features/auth/hook/useAuth";
import Toast from "@/components/ui/Toast";

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, isRegistering } = useAuth();
  const [toast, setToast] = useState(null);

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const userData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      phone_number: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      },
    };

    const result = await registerUser(userData);
    
    if (result.success) {
      setToast({ message: "Registration successful!", type: "success" });
      navigate("/");
    } else {
      setToast({ message: result.error, type: "error" });
    }
  };

  const passwordValue = watch("password", "");

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div className="card w-full max-w-2xl bg-base-100 shadow-md">
        <div className="card-body">
          <div className="text-center mb-4">
            <UserPlus size={32} className="mx-auto mb-2 text-primary" />
            <h2 className="text-2xl font-bold">Create an Account</h2>
            <p className="text-sm mt-1 text-base-content/70">
              Join SuperMall to start shopping with us
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Display global error message */}
            {errors.root && (
              <div className="alert alert-error shadow-lg">
                <span>{errors.root.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                icon={User}
                label="First Name"
                placeholder="First Name"
                register={registerField}
                name="firstName"
                required="First name is required"
                error={errors.firstName?.message}
              />

              <Input
                icon={User}
                label="Last Name"
                placeholder="Last Name"
                register={registerField}
                name="lastName"
                required="Last name is required"
                error={errors.lastName?.message}
              />
            </div>

            <Input
              icon={Mail}
              label="Email"
              type="email"
              placeholder="your@email.com"
              register={registerField}
              name="email"
              required="Email is required"
              error={errors.email?.message}
            />

            <Input
              icon={Phone}
              label="Phone Number"
              type="tel"
              placeholder="Phone Number"
              register={registerField}
              name="phone"
              required="Phone number is required"
              error={errors.phone?.message}
            />

            {/* Address Fields */}
            <div className="divider text-xs text-base-content/50">
              Address Information
            </div>

            <Input
              icon={MapPin}
              label="Street Address"
              placeholder="123 Main St"
              register={registerField}
              name="street"
              required="Street address is required"
              error={errors.street?.message}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                icon={Building}
                label="City"
                placeholder="City"
                register={registerField}
                name="city"
                required="City is required"
                error={errors.city?.message}
              />

              <Input
                icon={Map}
                label="State/Province"
                placeholder="State"
                register={registerField}
                name="state"
                required="State is required"
                error={errors.state?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                icon={Hash}
                label="ZIP/Postal Code"
                placeholder="ZIP Code"
                register={registerField}
                name="zip"
                required="ZIP code is required"
                error={errors.zip?.message}
              />

              <Input
                icon={Flag}
                label="Country"
                placeholder="Country"
                register={registerField}
                name="country"
                required="Country is required"
                error={errors.country?.message}
              />
            </div>

            <div className="divider text-xs text-base-content/50">Security</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PasswordInput
                icon={Lock}
                label="Password"
                placeholder="••••••••"
                register={registerField}
                name="password"
                required="Password is required"
                error={errors.password?.message}
              />

              <PasswordInput
                icon={ShieldCheck}
                label="Confirm Password"
                placeholder="••••••••"
                register={registerField}
                name="confirmPassword"
                required="Please confirm your password"
                validate={(value) =>
                  value === passwordValue || "Passwords do not match"
                }
                error={errors.confirmPassword?.message}
              />
            </div>

            <div className="form-control">
              <label className="cursor-pointer label justify-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-primary"
                  {...registerField("agreeTerms", {
                    required: "You must agree to our terms",
                  })}
                />
                <span className="label-text">
                  I agree to the{" "}
                  <Link to="/terms" className="link link-primary">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="link link-primary">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeTerms && (
                <label className="label mt-0 pt-0">
                  <span className="label-text-alt text-error">
                    {errors.agreeTerms.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control mt-4">
              <button
                type="submit"
                className={`btn btn-primary w-full gap-2 ${
                  isRegistering ? "loading" : ""
                }`}
                disabled={isRegistering}
              >
                {!isRegistering && <UserPlus size={18} />}
                {isRegistering ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="divider text-xs text-base-content/50">OR</div>

          <div className="form-control">
            <button className="btn btn-outline btn-ghost w-full gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-5 h-5"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              Sign up with Google
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account?{" "}
              <Link to="/auth/login" className="link link-primary font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
