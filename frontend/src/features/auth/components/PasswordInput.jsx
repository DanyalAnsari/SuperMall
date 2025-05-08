import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  icon,
  label,
  placeholder,
  error,
  register,
  name,
  required = false,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
        {required && <span className="label-text-alt text-error">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50">
            {React.createElement(icon, { size: 16 })}
          </span>
        )}
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={`input input-bordered w-full ${icon ? 'pl-10' : ''} ${error ? 'input-error' : ''}`}
          {...(register && name ? register(name, { required: required && `${label} is required` }) : {})}
          {...rest}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};

export default PasswordInput; 