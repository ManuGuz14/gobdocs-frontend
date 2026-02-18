import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button 
      className="w-full bg-gobdocs-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all shadow-md active:scale-[0.99]"
      {...props}
    >
      {children}
    </button>
  );
};