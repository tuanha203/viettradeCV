import React from 'react';

const Button = ({className, children, type, ...props}) => {
  return (
    <button type={type} {...props} className={`text-white btn btn-sm ${className}`}>
      {children}
    </button>
  );
};

export default Button;
