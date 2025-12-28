import React from "react";

export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-5 py-2.5 rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-[#e87d26] text-white hover:bg-[#d46b1a] shadow-md",
    outline:
      "border border-gray-200 text-gray-700 hover:border-[#e87d26] hover:text-[#e87d26]",
    ghost: "text-gray-500 hover:bg-gray-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
