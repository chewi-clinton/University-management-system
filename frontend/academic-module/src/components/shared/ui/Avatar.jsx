import React from 'react';
import PropTypes from 'prop-types';

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  variant = 'circle',
  status,
  className = '',
  fallback,
  ...props 
}) => {
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarClasses = [
    'avatar',
    `avatar--${size}`,
    `avatar--${variant}`,
    status && `avatar--status-${status}`,
    className
  ].filter(Boolean).join(' ');

  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  return (
    <div className={avatarClasses} {...props}>
      {src ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="avatar__image"
          onError={handleImageError}
        />
      ) : null}
      
      {!src && fallback && (
        <div className="avatar__fallback">
          {fallback}
        </div>
      )}
      
      {!src && !fallback && alt && (
        <div className="avatar__initials">
          {getInitials(alt)}
        </div>
      )}
      
      {status && (
        <div className="avatar__status">
          <div className={`avatar__status-indicator avatar__status-indicator--${status}`} />
        </div>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['circle', 'square', 'rounded']),
  status: PropTypes.oneOf(['online', 'offline', 'away', 'busy']),
  className: PropTypes.string,
  fallback: PropTypes.node
};

export default Avatar;