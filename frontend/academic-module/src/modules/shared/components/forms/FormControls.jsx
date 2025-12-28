import React from "react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const variants = {
    primary:
      "bg-primary-500 text-white hover:bg-primary-600 shadow-sm shadow-primary-200",
    outline:
      "border border-gray-200 text-gray-700 hover:border-primary-500 hover:text-primary-500",
    ghost: "text-gray-500 hover:bg-gray-50",
    danger: "bg-error text-white hover:bg-red-600",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base font-semibold",
  };

  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-lg transition-all active:scale-95 disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, icon, ...props }) => (
  <div className="form-field w-full group">
    {label && (
      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500">
          {icon}
        </div>
      )}
      <input
        className={`w-full bg-white border border-gray-200 rounded-lg py-2.5 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-50/50 ${
          icon ? "pl-10 pr-4" : "px-4"
        }`}
        {...props}
      />
    </div>
  </div>
);
