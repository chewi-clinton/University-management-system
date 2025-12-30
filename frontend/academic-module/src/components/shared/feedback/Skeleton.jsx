import React from "react";
import "../../../styles/components/Skeleton.css";

const Skeleton = ({
  variant = "text",
  width,
  height,
  circle = false,
  className = "",
  style = {},
  count = 1,
}) => {
  const skeletonStyle = {
    width: width || (variant === "text" ? "100%" : undefined),
    height:
      height ||
      (variant === "text" ? "1em" : variant === "circular" ? "40px" : "200px"),
    borderRadius: circle || variant === "circular" ? "50%" : undefined,
    ...style,
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`skeleton skeleton--${variant} ${className}`}
      style={skeletonStyle}
    />
  ));

  return count > 1 ? (
    <div className="skeleton__group">{skeletons}</div>
  ) : (
    skeletons[0]
  );
};

export default Skeleton;
