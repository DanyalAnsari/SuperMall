import React from "react";

const Input = ({ 
  icon, 
  label, 
  type = "text", 
  placeholder, 
  error, 
  register, 
  name,
  required = false,
  ...rest 
}) => {
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
          type={type}
          placeholder={placeholder}
          className={`input input-bordered w-full ${icon ? 'pl-10' : ''} ${error ? 'input-error' : ''}`}
          {...(register && name ? register(name, { required: required && `${label} is required` }) : {})}
          {...rest}
        />
      </div>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};

export default Input;
