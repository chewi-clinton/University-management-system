import React from "react";
import "./Card.css";

const Card = ({ children, variant = "elevated", className = "", onClick }) => {
  return (
    <div
      className={`card card-${variant} ${
        onClick ? "clickable" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
