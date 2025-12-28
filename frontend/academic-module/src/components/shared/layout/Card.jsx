// src/components/shared/layout/Card.jsx
import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import "../../../styles/components/Card.css";

const Card = ({
  children,
  variant = "elevated",
  padding = "md",
  hover = false,
  className = "",
  onClick,
  ...props
}) => {
  const cardClasses = [
    "card",
    `card--${variant}`,
    `card--padding-${padding}`,
    hover && "card--hover",
    onClick && "card--clickable",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const cardProps = {
    className: cardClasses,
    ...props,
  };

  if (onClick) {
    cardProps.onClick = onClick;
  }

  return (
    <motion.div
      {...cardProps}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
    >
      {children}
    </motion.div>
  );
};

// Card Header subcomponent
Card.Header = ({ children, className = "" }) => (
  <div className={`card__header ${className}`}>{children}</div>
);

// Card Body subcomponent
Card.Body = ({ children, className = "" }) => (
  <div className={`card__body ${className}`}>{children}</div>
);

// Card Footer subcomponent
Card.Footer = ({ children, className = "" }) => (
  <div className={`card__footer ${className}`}>{children}</div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["elevated", "flat", "glass", "bordered"]),
  padding: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  hover: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

Card.Header.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.Body.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.Footer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;
