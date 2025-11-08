import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`
        px-8 py-3 bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold rounded-full 
        transition-all duration-300 ease-in-out
        hover:bg-cyan-500/50 hover:shadow-[0_0_15px_rgba(72,187,255,0.7)] hover:text-white
        disabled:bg-gray-500/10 disabled:border-gray-600 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
