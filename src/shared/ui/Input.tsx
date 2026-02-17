import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="mb-5">
      <label className="block text-gobdocs-primary text-sm font-medium mb-2">
        {label}
      </label>
      <input 
        className="w-full border border-blue-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gobdocs-primary focus:border-transparent transition-all"
        {...props} 
      />
    </div>
  );
};