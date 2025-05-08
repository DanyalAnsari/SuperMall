import React from 'react';
import { Outlet, NavLink } from 'react-router';
import { User, ShoppingBag, MapPin, CreditCard, LogOut } from 'lucide-react';
import { useForm } from 'react-hook-form';

const Profile = () => {
  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    phone: "+1 (234) 567-890",
    dob: "1990-01-01"
  };
  
  // Form setup with React Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch,
    reset
  } = useForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dob: user.dob,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });
  
  // Watch password fields for validation
  const newPassword = watch("newPassword");
  
  // Form submission handler
  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your API
    alert("Profile updated successfully!");
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <div className="mb-6 flex flex-col items-center">
            <div className="avatar placeholder mb-4">
              <div className="bg-neutral text-neutral-content rounded-full w-20">
                <span className="text-xl">JD</span>
              </div>
            </div>
            <h2 className="text-xl font-medium">{user.name}</h2>
            <p className="text-sm text-neutral-content">{user.email}</p>
          </div>
          
          <nav>
            <ul className="menu bg-base-100 w-full border-l border-l-base-300">
              <li>
                <NavLink to="/profile" end className={({ isActive }) => 
                  isActive ? "active border-l-4 border-primary" : ""
                }>
                  <User size={18} />
                  Personal Info
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile/orders" className={({ isActive }) => 
                  isActive ? "active border-l-4 border-primary" : ""
                }>
                  <ShoppingBag size={18} />
                  Orders
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile/addresses" className={({ isActive }) => 
                  isActive ? "active border-l-4 border-primary" : ""
                }>
                  <MapPin size={18} />
                  Addresses
                </NavLink>
              </li>
              <li>
                <a className="text-error">
                  <LogOut size={18} />
                  Logout
                </a>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Main Content Area */}
        <div className="md:col-span-3">
          {/* Outlet for nested routes */}
          <Outlet />
          
          {/* Default content when no nested route is active */}
          <div className="route-default">
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input 
                    type="text" 
                    className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`}
                    {...register("firstName", { 
                      required: "First name is required",
                      minLength: { value: 2, message: "Name must be at least 2 characters" }
                    })}
                  />
                  {errors.firstName && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.firstName.message}</span>
                    </label>
                  )}
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input 
                    type="text" 
                    className={`input input-bordered w-full ${errors.lastName ? 'input-error' : ''}`}
                    {...register("lastName", { 
                      required: "Last name is required",
                      minLength: { value: 2, message: "Name must be at least 2 characters" }
                    })}
                  />
                  {errors.lastName && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.lastName.message}</span>
                    </label>
                  )}
                </div>
              </div>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email" 
                  className="input input-bordered w-full bg-base-200" 
                  {...register("email")}
                  readOnly 
                />
                <label className="label">
                  <span className="label-text-alt text-info">Email cannot be changed</span>
                </label>
              </div>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input 
                  type="tel" 
                  className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`}
                  {...register("phone", { 
                    pattern: {
                      value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/,
                      message: "Please enter a valid phone number"
                    }
                  })}
                />
                {errors.phone && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.phone.message}</span>
                  </label>
                )}
              </div>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Date of Birth</span>
                </label>
                <input 
                  type="date" 
                  className={`input input-bordered w-full ${errors.dob ? 'input-error' : ''}`}
                  {...register("dob")}
                />
                {errors.dob && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.dob.message}</span>
                  </label>
                )}
              </div>
              
              <div className="divider"></div>
              
              <h3 className="text-xl font-bold mb-4">Change Password</h3>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Current Password</span>
                </label>
                <input 
                  type="password" 
                  className={`input input-bordered w-full ${errors.currentPassword ? 'input-error' : ''}`}
                  {...register("currentPassword", {
                    minLength: { value: 8, message: "Password must be at least 8 characters" }
                  })}
                />
                {errors.currentPassword && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.currentPassword.message}</span>
                  </label>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">New Password</span>
                  </label>
                  <input 
                    type="password" 
                    className={`input input-bordered w-full ${errors.newPassword ? 'input-error' : ''}`}
                    {...register("newPassword", {
                      minLength: { value: 8, message: "Password must be at least 8 characters" }
                    })}
                  />
                  {errors.newPassword && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.newPassword.message}</span>
                    </label>
                  )}
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Confirm New Password</span>
                  </label>
                  <input 
                    type="password" 
                    className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
                    {...register("confirmPassword", {
                      validate: value => value === newPassword || "Passwords do not match"
                    })}
                  />
                  {errors.confirmPassword && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.confirmPassword.message}</span>
                    </label>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => reset()}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;